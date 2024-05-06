import firestore                    from '@react-native-firebase/firestore';
import store                        from '../state/store';
import util                         from '../util/util';
import * as _ from 'underscore';

const state                     = store.getState();
const onbusMobileCTOCollection  = firestore().collection('onbus-mobile-cto');
const docName                   = "historico-atuacao-88";

export default {

    registrar_atuacao(payload){

        // Documento de histórico da atuação
        let docRef                      = onbusMobileCTOCollection.doc(docName);
        let filename                    = (payload.filename !== undefined) ? payload.filename : null;
        let numero_onibus               = payload.numero_onibus;
        let id_onibus_em_alerta         = payload.id_onibus_em_alerta;
        let id_onibus_em_alerta_atuacao = payload.id_onibus_em_alerta_atuacao;
        let atuacao                     = payload.atuacao;

        //Registra a atuação
        docRef.set({
            [`atuacao-${id_onibus_em_alerta_atuacao}`] : {
                filename:                       filename,
                numero_onibus:                  numero_onibus,
                id_onibus_em_alerta:            id_onibus_em_alerta,
                id_onibus_em_alerta_atuacao:    id_onibus_em_alerta_atuacao,
                atuacao:                        atuacao,
                sync:                           false,
                data_atuacao:                   util.now()
            }
        });
        
    },

    registrar_checking(){

    }

}
