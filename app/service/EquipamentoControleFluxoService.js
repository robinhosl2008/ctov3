import firestore                                                from '@react-native-firebase/firestore';
import store                                                    from './../state/store';
import util                                                     from './../util/util';
import { updateEquipamentoControleFluxo }                       from '../state/EquipamentoControleFluxo/EsquipamentoControleFluxoAction';
import * as _ from 'underscore';

const onbusMobileCTOCollection  = firestore().collection('onbus-mobile-cto');
const docName                   = "equipamento-controle-fluxo";

export default {

    async watch_firestore(){
        await onbusMobileCTOCollection.doc(docName).onSnapshot((documentSnapshot) => {    

            if (documentSnapshot.data()){ 

                let state                   = store.getState(); 
                let user_auth               = state.app.user_auth;
                let lib_equipamento_status  = state.lib.lib_equipamento_status.obj_id_status;
                let arr_user                = state.users;

                // 1. Converte o retorno em Array de Objeto
                let docData     = util.obj_to_array(documentSnapshot.data());

                // 2. Processa os status que o usuário logado está relacionado
                let arr_fluxo_status = docData
                .map( item => {
                    if (item.id_funcionario == user_auth.id){
                        return {
                            id_status_recebe:       item.id_lib_equipamento_status_recebe, 
                            status_recebe:          lib_equipamento_status[item.id_lib_equipamento_status_recebe],
                            id_status_transfere:    item.id_lib_equipamento_status_transfere,
                            status_transfere:       lib_equipamento_status[item.id_lib_equipamento_status_transfere]
                        };
                    }
                }).filter(item => {
                    if (item !== undefined){
                        return item;
                    }
                });

                // 3. Lista todos os possíveis status para recebimento de patrimonio
                let arr_status_destino_user = _.uniq(docData
                    .map((item) => { 
                        if (item.id_lib_equipamento_status_recebe){
                            return {
                                id_lib_equipamento_status_recebe:   item.id_lib_equipamento_status_recebe,
                                user:                               _.first(arr_user.filter((user) => { return user.id === item.id_funcionario}))
                            }
                        } 
                    })
                    .filter(item => { return item !== null && item !== undefined }) 
                );

                store.dispatch(updateEquipamentoControleFluxo({
                    data:                       docData,
                    arr_status_destino_user:    arr_status_destino_user,
                    arr_fluxo_status:           arr_fluxo_status
                }));

            }            

        });
    },

}
  