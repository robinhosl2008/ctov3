import React from 'react'
import firestore                    from '@react-native-firebase/firestore';
import firebaseStorage              from '@react-native-firebase/storage';
import util                         from '../util/util';
import store                        from './../state/store';
import {updateCTOSync}              from './../state/CTOSync/CTOSyncAction';
import updateChecking               from './../state/Checking/CheckingAction';

const onbusMobileCTOSyncCollection              = firestore().collection('onbus-mobile-cto-sync');
const onbusMobileOOHSyncCollection              = firestore().collection('onbus-mobile-ooh-sync');
const onbusMobileCTOPatrimonioSyncCollection    = firestore().collection('onbus-mobile-cto-patrimonio-sync');
const onbusMobileColetaSyncCollection           = firestore().collection('onbus-mobile-cto-coleta-sync');
const onbusMobileCheckingSyncCollection         = firestore().collection('onbus-mobile-cto-checking-sync')

export default {

    get_unique_sync(tipo_movimento, submovimento, id_funcionario){
        let unix = util.get_unix();
        return `${tipo_movimento}-${submovimento}-${id_funcionario}-${unix}`;
    },

    async watch_cto_sync(){

        let state       = store.getState(); 
        let user_auth   = state.app.user_auth;
        let docRef      = await onbusMobileCTOSyncCollection.doc(`funcionario-${user_auth.id}`);
        // console.log(docRef);

        if (docRef){

            docRef.onSnapshot((documentSnapshot) => {
                if (documentSnapshot.data()){ 
    
                    console.info("::: TIPO DA VARIÁVEL :::");
                    console.info("::: TIPO DA VARIÁVEL :::");
                    console.info("::: TIPO DA VARIÁVEL :::");
                    console.info(typeof updateCTOSync);

                    store.dispatch(updateCTOSync({
                        data: util.obj_to_array(documentSnapshot.data())
                    }));

                }
            });

        }        
    },

    async registrar_atuacao(payload){

        let state       = store.getState(); 
        let user_auth   = state.app.user_auth;
        let docRef      = onbusMobileCTOSyncCollection.doc(`funcionario-${user_auth.id}`);

        // Dados que serão enviados para retaguarda
        let id_onibus                   = payload.id_onibus;        // Obrigatório
        let numero_onibus               = payload.numero_onibus;    // Obrigatório
        let data_atuacao                = payload.data_atuacao;     // Obrigatório
        let tipo_movimento              = payload.tipo_movimento;   // Obrigatório ['OPERACAO_GARAGEM','CHECKING']
        let submovimento                = payload.submovimento;     // Obrigatório ['ATUACAO','CONCLUIR_ALERTA','REGISTRO_FOTO']
        let arr_movimento               = payload.arr_movimento;    // Obrigatório
        let onibus_em_alerta            = (payload.onibus_em_alerta !== undefined) ? payload.onibus_em_alerta : null;
        let onibus_em_alerta_atuacao    = (payload.onibus_em_alerta_atuacao !== undefined) ? payload.onibus_em_alerta_atuacao : null;

        onbusMobileCTOSyncCollection.add({
            id_funcionario:                 user_auth.id,
            uniq_sync:                      this.get_unique_sync(tipo_movimento, submovimento, user_auth.id),
            sync:                           false,  // Como a atuação foi registrada nesse momento, ela ainda não foi sincronizada com a
            id_onibus:                      id_onibus,
            numero_onibus:                  numero_onibus,
            onibus_em_alerta:               onibus_em_alerta,
            onibus_em_alerta_atuacao:       onibus_em_alerta_atuacao,
            data_atuacao:                   data_atuacao,
            tipo_movimento:                 tipo_movimento,
            submovimento:                   submovimento,
            arr_movimento:                  arr_movimento
        })
    },

    async registrar_atuacao_ooh(payload){

        let state       = store.getState(); 
        let user_auth   = state.app.user_auth;

        // Dados que serão enviados para retaguarda
        let id_ooh_estabelecimento_ponto    = payload.id_ooh_estabelecimento_ponto;        // Obrigatório
        let data_atuacao                    = payload.data_atuacao;     // Obrigatório
        let tipo_movimento                  = payload.tipo_movimento;   // Obrigatório ['OPERACAO_GARAGEM','CHECKING']
        let submovimento                    = payload.submovimento;     // Obrigatório ['ATUACAO','CONCLUIR_ALERTA','REGISTRO_FOTO']
        let arr_movimento                   = payload.arr_movimento;    // Obrigatório
        let ooh_ponto_em_alerta             = (payload.ooh_ponto_em_alerta !== undefined)? payload.ooh_ponto_em_alerta : null;
        let ooh_ponto_em_alerta_atuacao     = (payload.ooh_ponto_em_alerta_atuacao !== undefined)? payload.ooh_ponto_em_alerta_atuacao : null;

        onbusMobileOOHSyncCollection.add({
            id_funcionario:                 user_auth.id,
            uniq_sync:                      this.get_unique_sync(tipo_movimento, submovimento, user_auth.id),
            sync:                           false,  // Como a atuação foi registrada nesse momento, ela ainda não foi sincronizada com a
            id_ooh_estabelecimento_ponto:   id_ooh_estabelecimento_ponto,
            ooh_ponto_em_alerta:            ooh_ponto_em_alerta,
            ooh_ponto_em_alerta_atuacao:    ooh_ponto_em_alerta_atuacao,
            data_atuacao:                   data_atuacao,
            tipo_movimento:                 tipo_movimento,
            submovimento:                   submovimento,
            arr_movimento:                  arr_movimento
        });
    },

    async registrar_movimentacao_patrimonio(payload){

        let state           = store.getState(); 
        let user_auth       = state.app.user_auth;
        let docRef          = onbusMobileCTOPatrimonioSyncCollection.doc(`funcionario-${user_auth.id}`);
        let tipo_movimento  = "TRANSFERENCIA-PATRIMONIO";
        let submovimento    = payload.submovimento;
        let arr_movimento   = payload.arr_movimento;

        onbusMobileCTOPatrimonioSyncCollection.add({
            id_funcionario:                 user_auth.id,
            uniq_sync:                      this.get_unique_sync(tipo_movimento, submovimento, user_auth.id),
            concluir_atuacao:               true,
            tipo_movimento:                 tipo_movimento,
            data_atuacao:                   util.now(),
            submovimento:                   submovimento,
            arr_movimento:                  arr_movimento
        })
    },

    async registrar_movimentacao_coleta(payload){

        let state           = store.getState(); 
        let user_auth       = state.app.user_auth;
        let id_coleta       = payload.id_coleta;
        let status_destino  = payload.nxtstatus;
        let coleta          = payload.coleta;

        let tipo_movimento  = "COLETA";
        let submovimento    = payload.submovimento;

        onbusMobileColetaSyncCollection.add({
            id_funcionario:                 user_auth.id,
            id_coleta_patrimonio_lote:      id_coleta,
            uniq_sync:                      this.get_unique_sync(tipo_movimento, submovimento, user_auth.id),
            id_lib_coleta_status:           status_destino,
            tipo_movimento:                 tipo_movimento,
            data_atuacao:                   util.now(),
            submovimento:                   submovimento,
        })
    },

    async registrar_checking_fotografico(payload){

        let state                   = store.getState(); 
        let user_auth               = state.app.user_auth;
        let docRef                  = onbusMobileCheckingSyncCollection.doc(`funcionario-${user_auth.id}`);
        let id_onibus               = payload.id_onibus;
        let numero_onibus           = payload.numero_onibus;
        let av_checking_calendario  = payload.av_checking_calendario;
        let data_atuacao            = payload.data_atuacao;
        let tipo_movimento          = payload.tipo_movimento;
        let submovimento            = payload.submovimento;
        let arr_movimento           = payload.arr_movimento;

        onbusMobileCheckingSyncCollection.add({
            id_funcionario:                 user_auth.id,
            uniq_sync:                      this.get_unique_sync(tipo_movimento, submovimento, user_auth.id), 
            sync:                           false,  // Como a atuação foi registrada nesse momento, ela ainda não foi sincronizada com a
            id_onibus:                      id_onibus,
            numero_onibus:                  numero_onibus,
            av_checking_calendario:         av_checking_calendario,
            data_atuacao:                   data_atuacao,
            tipo_movimento:                 tipo_movimento,
            submovimento:                   submovimento,
            arr_movimento:                  arr_movimento
        });
    }

}
