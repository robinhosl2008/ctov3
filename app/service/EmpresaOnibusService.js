import firestore                                from '@react-native-firebase/firestore';
import store                                    from '../state/store';
import util                                     from '../util/util';
import { updateEmpresaOnibus }           from '../state/EmpresaOnibus/EmpresaOnibusAction';
const onbusMobileCTOCollection                  = firestore().collection('onbus-mobile-cto');

export default {
    async watch_empresa_onibus(){
        await onbusMobileCTOCollection.doc("empresa-onibus").onSnapshot((documentSnapshot) => {
            if (documentSnapshot.data()){ 
                
                // Armazena a lista original
                let docData = util.obj_to_array(documentSnapshot.data());

                // Processa e armazena a lista por ID: STATUS
                let arr_temp = {};
                let obj_id_item = docData.map(item => {
                    return arr_temp[item.id] = {nomeFantasia: item.nomeFantasia, razaoSocial: item.razaoSocial};
                });

                store.dispatch(updateEmpresaOnibus({
                    data:         docData,
                    obj_id_item:  obj_id_item
                }));    
                
            }
        });
    },



}
  