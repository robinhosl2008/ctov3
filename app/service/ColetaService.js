import firestore                                                from '@react-native-firebase/firestore';
import store                                                    from './../state/store';
import util                                                     from './../util/util';
import { definirColeta }                                        from '../state/Coleta/ColetaAction';
import * as _ from 'underscore';
import { appModalLoading }                                      from './../state/App/AppAction';
import { sub } from 'react-native-reanimated';
import OnbusMobileCTOSyncService                                    from './OnbusMobileCTOSyncService';

const onbusMobileCTOCollection  = firestore().collection('onbus-mobile-cto');
const docName                   = "coleta-patrimonio-lote";

export default {

    async watch_coleta(){

        await onbusMobileCTOCollection.doc(docName).onSnapshot((documentSnapshot) => {
            if (documentSnapshot.data()) {

                let state                       =store.getState();                  //recupera o estado
                let user_auth                   =state.app.user_auth;               //recupera o id do usuario logado
                let cont_coletas_ativas         =0;

                // 1. Converter o retorno em Array de Objeto
                let docData                     = util.obj_to_array(documentSnapshot.data());

                // 2. Processa as coletas nas quais o usuário está relacionado
                let arr_coletas  = docData.filter((item) => {
                    if (item.id_remetente == user_auth.id || item.id_destinatario == user_auth.id || item.id_coletador == user_auth.id){
                        if(item.id_lib_coleta_status==1 || item.id_lib_coleta_status==2 || item.id_lib_coleta_status==3) {
                            cont_coletas_ativas ++;
                        }
                        //console.info("::: FUNCIONARIO PODE VER COLETA ", item);
                        return item;
                    }
                }).map((item) => {
                    return item; 
                });

                store.dispatch(definirColeta({
                    data: util.obj_to_array(documentSnapshot.data()),
                    arr_coleta: arr_coletas,
                    cont_coletas_ativas: cont_coletas_ativas,
                }));
            }
            else{
                console.log("\n::\n::\n::\n::\n::\n::SEM DADOS")
            }
        });
    },
    async atualizar_coleta(payload){
        //console.log("ENtrou no atualizar_coleta")
        // Habilita a Modal de Loading
        store.dispatch(appModalLoading({modal_loading:{ visible: true }}));

        // OBTER DADOS PELO PAYLOAD
        let coleta                      = payload.coleta;
        let coleta_id                   = coleta.id;
        let nextstatus                  = payload.nxtstatus;
        // OBTER ESTADO
        //let state                       = store.getState();
        //OBTER DATA
        let curDateTime                 = util.now();

        //batch
        let batch                       = firestore().batch();
        let docItemRef                  = onbusMobileCTOCollection.doc(docName);

        //DEFINE O SUBMOVIMENTO
        let submovimento = '';
        if(nextstatus == 2){submovimento = 'COLETADO';}
        else if(nextstatus == 3){submovimento = 'COLETA-ENTREGUE';}
        else if(nextstatus == 4){submovimento = 'COLETA-CANCELADA';}
        else if(nextstatus == 5){submovimento = 'COLETA-FINALIZADA';}
        
        //
        //console.log(":::VAI SINCRONIZAR CGO - DADOS NECESSARIOS:");
        //console.log(coleta); console.log(coleta_id); console.log(submovimento);
        // Sincroniza a alteração do estado da coleta com a CGO
        await OnbusMobileCTOSyncService.registrar_movimentacao_coleta({
            coleta:                     coleta,
            id_coleta:                  coleta_id,
            submovimento:               submovimento,
            nxtstatus:                  nextstatus
        });

        // Atualizar a coleta com o metadata
        if(coleta){
            let updatedObj = {};

            console.info("::: ATUALIZANDO O STATUS DA COLETA :::", coleta);
            updatedObj["idx-"+coleta.id] = {
                "metadata":{
                    "status_destino": nextstatus,
                    "received_at": curDateTime
                }
            };

            batch.set(docItemRef, updatedObj, {merge: true});
        }

        batch.commit().then(function () {
            
            console.info("::: DEMOS COMMIT NOS DADOS :::");

        }).catch((error) => {
            console.log("::: ERRO AO ENVIAR O BATCH :::");
            console.error(error);
        });

    },

    

}
  