import firestore                                                    from '@react-native-firebase/firestore';
import store                                                        from './../state/store';
import util                                                         from './../util/util';
import { updateEquipamentoFuncionarioControle }                     from './../state/EquipamentoFuncionarioControle/EquipamentoFuncionarioControleAction';
import { updatePatrimonioEncaminhado, delPatrimonioReceber }        from '../state/EquipamentoFuncionarioControle/PatrimonioEncaminhadoAction';
import { updatePatrimonioRecebido, delPatrimonioRecebidoEnviar }    from '../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import { appModalLoading }                                          from './../state/App/AppAction';
import OnbusMobileCTOSyncService                                    from './OnbusMobileCTOSyncService';
import * as _ from 'underscore';

const onbusMobileCTOCollection  = firestore().collection('onbus-mobile-cto');
const docName                   = "equipamento-funcionario-controle";

export default {

    async watch_firestore(){
        await onbusMobileCTOCollection.doc(docName).onSnapshot((documentSnapshot) => {    

            if (documentSnapshot.data()){ 

                let state                       = store.getState(); 
                let user_auth                   = state.app.user_auth;
                let arr_fluxo_status            = state.equipamento_controle_fluxo.arr_fluxo_status;

                // Critérios de seleção para exibição de patrimônios
                // 1. Seleciona apenas os patrimônios onde o usuário é Destinatário
                // let docData             = util.obj_filter(documentSnapshot.data(), (item) => (item.id_destinatario  == user_auth.id || item.arr_destinatario[user_auth.id] != undefined) && item.metadata == undefined );
                let arrDocData          = util.obj_to_array(documentSnapshot.data());
                let docData             = arrDocData.filter((item) => {
                    if (item.metadata == undefined){

                        let arr_destinatario        = (item['arr_destinatario'] !== undefined) ? item['arr_destinatario'] : [];
                        let has_arr_destinatario    = arr_destinatario.filter((id_funcionario) => {
                            if (user_auth.id == id_funcionario){
                                return item;
                            }
                        }).length;

                        // Retorna o patrimônio caso o usuário seja o destinatário
                        if (item['id_destinatario'] == user_auth.id || has_arr_destinatario){
                            return item;    
                        }

                        // Retorna o patrimônio caso o usuário tenha o status definido no "EQUIPAMENTO_CONTROLE_FLUXO"
                        // Utilizado por exemplo para controle de estoque, quando o patrimônio está no Estoque e não  
                        // tem usuário específico relacionado.
                        if (item.fluxo_status == 'ESTOQUE'){
                           let item_estoque = arr_fluxo_status.filter((fluxo_status) => {
                                if (fluxo_status.id_status_recebe == item.id_equipamento_status){
                                    return item;
                                }
                            });
                            if (item_estoque.length){
                                return item;
                            }
                        }

                    }
                });
                
                // 2. Separa os patrimonios pelo status de "ENCAMINHADO" ou "RECEBIDO"
                let docDataEncaminhado  = util.obj_filter(docData, (item) => item.fluxo_status == 'ENCAMINHADO' );
                let docDataRecebido     = util.obj_filter(docData, (item) => item.fluxo_status == 'ESTOQUE' || item.fluxo_status == 'RECEBIDO' );

                let objStateEncaminhado = this.proc_patrimonio_encaminhado(docDataEncaminhado);
                let objStateRecebido    = this.proc_patrimonio_recebido(docDataRecebido);

                store.dispatch(updateEquipamentoFuncionarioControle({
                    total_patrimonio_receber: util.obj_size(docDataEncaminhado),
                    total_patrimonio_enviar: util.obj_size(docDataRecebido)
                }));
                store.dispatch(updatePatrimonioEncaminhado(objStateEncaminhado));    
                store.dispatch(updatePatrimonioRecebido(objStateRecebido));    
            }            

        });
    },

    async confirmar_recebimento_patrimonio(){

        // Habilita a Modal de Loading
        store.dispatch(appModalLoading({modal_loading:{ visible: true }}));

        // Obtém o status corrente da aplicação
        let state                       = store.getState();
        let arr_data                    = state.patrimonio_encaminhado.data;
        let arr_id_patrimonio_receber   = state.patrimonio_encaminhado.arr_id_patrimonio_receber;
        let curDateTime                 = util.now();
        let batch                       = firestore().batch();
        let docItemRef                  = onbusMobileCTOCollection.doc(docName);

        // Sincroniza a movimentação de patrimônio com a CGO
        if (arr_id_patrimonio_receber.length){
            await OnbusMobileCTOSyncService.registrar_movimentacao_patrimonio({
                submovimento: 'PATRIMONIO-RECEBER',
                arr_movimento: {
                    arr_id_patrimonio_receber: arr_id_patrimonio_receber 
                }
            });
        }
        

        // Obtém os dados de todos os patrimonios marcados como recebidos
        let arr_patrimonio_recebido = [];

         arr_data.filter(item => {
             if (arr_id_patrimonio_receber.indexOf(item.id_equipamento) > -1){

                let updatedObj = {};

                console.info("::: RECEBMOS O PATRIMONIO :::", item);
                arr_patrimonio_recebido.push(item);

                updatedObj["idx-"+item.id_equipamento] = {
                    "metadata":{
                        "received_at": curDateTime
                    }
                };

                batch.set(docItemRef, updatedObj, {merge: true});

                // Remove o item dos patrimonios relacionados
                store.dispatch(delPatrimonioReceber(item.id_equipamento));

             }
        });

        batch.commit().then(function () {
            
            console.info("::: DEMOS COMMIT NOS DADOS :::");

        }).catch((error) => {
            console.log("::: ERRO AO ENVIAR O BATCH :::");
            console.error(error);
        });

    },

    async confirmar_envio_patrimonio(){

        // Habilita a Modal de Loading
        store.dispatch(appModalLoading({modal_loading:{ visible: true }}));

        // Obtém o status corrente da aplicação
        let state                       = store.getState();
        let arr_data                    = state.patrimonio_recebido.data;
        let envio_patrimonio            = state.patrimonio_recebido.envio_patrimonio;
        let arr_id_patrimonio_enviar    = envio_patrimonio.arr_id_patrimonio_enviar;
        let curDateTime                 = util.now();
        let batch                       = firestore().batch();
        let docItemRef                  = onbusMobileCTOCollection.doc(docName);

        // Sincroniza os patrimônios enviados
        if (arr_id_patrimonio_enviar.length){
            await OnbusMobileCTOSyncService.registrar_movimentacao_patrimonio({
                submovimento: 'PATRIMONIO-ENVIO',
                arr_movimento: envio_patrimonio
            });
        }

        // Obtém os dados de todos os patrimonios marcados para serem enviados
        arr_data.filter(item => {
            if (arr_id_patrimonio_enviar.indexOf(item.id_equipamento) > -1){
            
            let updatedObj = {};
            updatedObj["idx-"+item.id_equipamento] = {
                "metadata":{
                    "sent_at":                  curDateTime,
                    "id_status_destino":        envio_patrimonio.id_status_destino,
                    "id_destinatario":          envio_patrimonio.id_destinatario
                }
            };

            batch.set(docItemRef, updatedObj, {merge: true});

            // Remove o item dos patrimonios relacionados
            store.dispatch(delPatrimonioRecebidoEnviar(item.id_equipamento));

            }
        });

        batch.commit().then(function () {
            
            console.info("::: DEMOS COMMIT NOS DADOS :::");

        }).catch((error) => {
            console.log("::: ERRO AO ENVIAR O BATCH :::");
            console.error(error);
        });
        
    },

    proc_patrimonio_encaminhado(docData){

        let state       = store.getState();
        let user_auth   = state.app.user_auth;

        // 1. Processa os remetentes e respectivas quantidades enviadas
        let remetente_qtd = Object.keys(docData).reduce((total, index) => {
            if (index){
                let id_remetente    = docData[index].id_remetente.toString();
                let fluxo_status    = docData[index].fluxo_status;
                if (fluxo_status == 'ENCAMINHADO'){
                    total[id_remetente] = (total[id_remetente] || 0) + 1;
                }
            }
            return total;
        }, {});

        // 2. Relaciona os remetentes com o total de patrimonios encaminhados
        // Percorre cada item do array de usuário para verificar se o usuário consta como Remetente
        // no state de equipamento_funcionario_controle
        let arr_remetente_qtd = state.users.map(item => {
            let temp            = Object.assign({}, _.pick(item, 'id', 'nome', 'nick'));
            temp.total_enviado  = (remetente_qtd[item.id] !== undefined) ? remetente_qtd[item.id] : 0;
            return temp;
        });

        // 2.1 Ordena pelo usuário que enviou a maior quantidade
        arr_remetente_qtd = _.sortBy(arr_remetente_qtd, "total_enviado").reverse();

        // 3. Monta o payload para ser enviado ao State
        let objState = {
            arr_remetente_qtd:          arr_remetente_qtd,
            data:                       util.obj_to_array(docData)
        };

        return objState;
    },

    proc_patrimonio_recebido(docDataRecebido){

        let state       = store.getState();
        let user_auth   = state.app.user_auth;

        // 1. Agrupa a quantidade de patrimonios por status
        let arr_temp_qtd = Object.keys(docDataRecebido).reduce((total, index) => {
            if (index){
                let id_equipamento_status    = docDataRecebido[index].id_equipamento_status;
                total[id_equipamento_status] = (total[id_equipamento_status] || 0) + 1;
            }
            return total;
        }, {});

        // 2. Relaciona os status com os respectivos labels
        let arr_status_qtd = state.lib.lib_equipamento_status.data.map(item => {
            let temp            = Object.assign({}, _.pick(item, 'id', 'nome'));
            temp.total_recebido = (arr_temp_qtd[item.id] !== undefined) ? arr_temp_qtd[item.id] : 0;
            return temp;
        });

        return {
            total_patrimonio_recebido:  Object.keys(docDataRecebido).length,
            arr_status_qtd:             arr_status_qtd,
            data:                       util.obj_to_array(docDataRecebido)
        };

    }

}
  