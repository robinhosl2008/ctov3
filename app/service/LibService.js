import firestore                                from '@react-native-firebase/firestore';
import store                                    from '../state/store';
import util                                     from '../util/util';
import { 
    updateLibEquipamentoStatus, 
    updateLibEmAlertaAtuacao,
    updateLibEquipamentoMotivoRetirada,
    updateLibFiltroAtuacao
} from '../state/Lib/LibAction';
import { RecyclerViewBackedScrollView } from 'react-native';
const onbusMobileCTOCollection  = firestore().collection('onbus-mobile-cto');
const ctoLibraryCollection      = firestore().collection('cto-library');

export default {
    async watch_lib_equipamento_status(){
        await onbusMobileCTOCollection.doc("lib-equipamento-status").onSnapshot((documentSnapshot) => {
            if (documentSnapshot.data()){ 
                
                // Armazena a lista original
                let docData = util.obj_to_array(documentSnapshot.data());

                // Processa e armazena a lista por ID: STATUS
                let arr_temp = {};
                let obj_id_status = docData.map(item => {
                    return arr_temp[item.id] = item.nome;
                });

                store.dispatch(updateLibEquipamentoStatus({
                    data:           docData,
                    obj_id_status:  obj_id_status
                }));
            }
        });
    },

    async watch_lib_em_alerta_atuacao(){
        await ctoLibraryCollection.doc("lib-em-alerta-atuacao").onSnapshot((docSnapshot) => {
            if (docSnapshot !== null){
                store.dispatch(updateLibEmAlertaAtuacao({
                    lib_em_alerta_atuacao: util.obj_to_array(docSnapshot.data()).sort(util.order_by("nome")),
                }));   
            }
        });
    },

    async watch_lib_equipamento_motivo_retirada(){
        await ctoLibraryCollection.doc("lib-equipamento-motivo-retirada").onSnapshot((docSnapshot) => {
            if (docSnapshot.data()){
                store.dispatch(updateLibEquipamentoMotivoRetirada({
                    lib_equipamento_motivo_retirada: util.obj_to_array(docSnapshot.data()).sort(util.order_by("motivo")),
                }));   
            }
        });
    },

    async watch_funcionario_filtro_atuacao (){
        return new Promise((resolve, reject) => {
            firestore().collection('cto-library').doc("funcionario-filtro-atuacao").onSnapshot((documentSnapshot) => {

                if (documentSnapshot.data()){
                    
                    console.info("::: VERIFICANDO ALERTAS QUE O TÉCNICO PODE ATUAR");
                    console.info("::: VERIFICANDO ALERTAS QUE O TÉCNICO PODE ATUAR");
                    console.info("::: VERIFICANDO ALERTAS QUE O TÉCNICO PODE ATUAR");
                    console.info("::: VERIFICANDO ALERTAS QUE O TÉCNICO PODE ATUAR");
                    console.info("::: VERIFICANDO ALERTAS QUE O TÉCNICO PODE ATUAR");
                    console.info("::: USUARIO LOGADO", user_auth);


                    // Armazena a lista original
                    let user_auth   = store.getState().app.user_auth;
                    let docData     = util.obj_to_array(documentSnapshot.data()); 
    
                    // Filtra apenas os itens cujo usuário está associado
                    let arr_filtro_atuacao  = docData.filter((item) => {
                        if (item.id_funcionario == user_auth.id){ 
                            console.info("::: FUNCIONARIO PODE ATUAR NO ALERTA ", item);
                            return item;
                        }
                    }).map((item) => {
                        return item.id_lib_em_alerta; 
                    });
    
                    store.dispatch(updateLibFiltroAtuacao({
                        arr_filtro_atuacao:  arr_filtro_atuacao
                    }));

                    resolve(true); 
                }
    
            });    
        });
    },

}
