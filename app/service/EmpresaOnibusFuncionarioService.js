import firestore                                from '@react-native-firebase/firestore';
import store                                    from '../state/store';
import util                                     from '../util/util';
import { updateEmpresaOnibusFuncionario }           from '../state/EmpresaOnibusFuncionario/EmpresaOnibusFuncionarioAction';
import { filterParamOnibusEmAlerta } from '../state/OperacaoGaragem/OnibusEmAlertaAction';
const onbusMobileCTOCollection                  = firestore().collection('onbus-mobile-cto');
import { updateCTOStatus } from '../state/CTOStatus/CTOStatusAction';

export default {
    async watch_empresa_onibus_funcionario(){
        await onbusMobileCTOCollection.doc("empresa-onibus-funcionario").onSnapshot(async (documentSnapshot) => {
            if (documentSnapshot.data()){ 
                
                let state       = store.getState(); 
                let user_auth   = state.app.user_auth;

                // Filtra apenas as garagens associadas ao usuário logado
                let docData = util.obj_to_array(documentSnapshot.data()).filter(item => {
                    if (item.id_funcionario == user_auth.id ){
                        return item;
                    }
                });

                store.dispatch(updateEmpresaOnibusFuncionario({data: docData}));
                store.dispatch(filterParamOnibusEmAlerta({array_garagem: docData}));
                store.dispatch(updateCTOStatus({total_garagem_a_fazer: docData.length})); 
                
            }
        });
    },

    async listar_empresa_onibus_funcionario(arr_param){
        return new Promise( async (resolve, reject) => {

            let user_auth                       = store.getState().app.user_auth;
            let doc_empresa_onibus_funcionario  = await firestore().collection('onbus-mobile-cto').doc("empresa-onibus-funcionario").get();
            let _total_garagem_a_fazer           = 0;
            // Filtrar as garagens associadas ao usuário
            let garagens_associadas = util.obj_to_array(doc_empresa_onibus_funcionario.data()).filter(item => {
                if(item.id_funcionario == user_auth.id){
                    return item;
                }
            })

            
            
            resolve(garagens_associadas);
        });
    },
}
