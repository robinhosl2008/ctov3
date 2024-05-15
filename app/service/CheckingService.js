import firestore                                from '@react-native-firebase/firestore';
import firebaseStorage                          from '@react-native-firebase/storage';
import store                                    from '../state/store';
import util                                     from '../util/util';
import { updateChecking }                       from '../state/Checking/CheckingAction';
import OnbusMobileCTOSyncService                from './OnbusMobileCTOSyncService';
import AsyncUploadFileService                   from './AsyncUploadFileService';
import { updateCTOStatus } from '../state/CTOStatus/CTOStatusAction';

const onbusMobileCTOCollection                  = firestore().collection('onbus-mobile-cto');

export default {
    async watch_checking_fotografico(){
        await onbusMobileCTOCollection.doc("checking-fotografico").onSnapshot((documentSnapshot) => {
            if (documentSnapshot){ 
                let user_auth = store.getState().app.user_auth;
                let total_checking_a_fazer = 0;
                let arr_checking_fotografico = [];

                Object.values(documentSnapshot.data()).map((doc) => {
                    let item_checking = doc;
                    arr_checking_fotografico.push(item_checking);
                    total_checking_a_fazer++;
                })

                store.dispatch(updateChecking({ 
                    data: util.obj_to_array(documentSnapshot.data())
                }));

                store.dispatch(updateCTOStatus({
                    total_checking_a_fazer: total_checking_a_fazer,
                }))
            }
        });
    },

    async agrupar_avs_por_numero(){
        return new Promise((resolve,reject) => {
            let arr_checking_a_fazer = store.getState().checking.data;
            let arr_agrupado = [];

            arr_checking_a_fazer.map((item) => {
                separar_por_numero(item);
            })

            
            function separar_por_numero(item){
                let i_av = arr_agrupado.findIndex(av => av.id_av == item.id);
                console.log(i_av);
                if(i_av >= 0){
                    arr_agrupado[i_av]['arr_alerta'].push(item);
                } else {
                    arr_agrupado.push({
                        id_av: item.id,
                        cliente: item.cliente, 
                        campanha: item.nome_campanha,
                        termino: item.termino,
                        checking_calendario:[item.checking_calendario],
                        arr_alerta: [item]
                    })
                }
            }

            resolve(arr_agrupado);
        })
    },

    async agrupar_avs_por_estabelecimento(){
        return new Promise((resolve,reject) => {
            let arr_checking_a_fazer = store.getState().checking.data;
            let arr_agrupado = [];

            arr_checking_a_fazer.map((item) => {
                separar_por_estabelecimento(item);
            })

            
            function separar_por_estabelecimento(item){
                let i_ponto = arr_agrupado.findIndex(av => av.estabelecimento == item.estabelecimento);
                if(i_ponto >= 0 ){
                    console.log('1. chegou aqui');
                    arr_agrupado[i_ponto]['arr_pontos'].push(item);
                } else {
                    console.log('2. chegou aqui');
                    arr_agrupado.push({
                        id_av: item.id,
                        cliente: item.cliente,
                        campanha: item.nome_campanha,
                        estabelecimento: item.estabelecimento,
                        termino: item.termino,
                        checking_calendario:[item.checking_calendario],
                        arr_pontos: [item]
                    })
                }
            }
            resolve(arr_agrupado);
        })
    },

    filtrar_checking(str, arr_checking){
        if(str!=null && str!=undefined){
            let arr_resp = []
            arr_checking.map((item)=>{
                let avid = String(item.id);
                let avcampanha = item.nome_campanha.toLowerCase();
                let avcliente = item.cliente.toLowerCase();
                let filtrominusculo = str.toLowerCase();
                if(
                    (avid.startsWith(str)) ||
                    (avcampanha.indexOf(filtrominusculo)>-1) ||
                    (avcliente.indexOf(filtrominusculo)>-1)
                  ){
                    arr_resp.push(item);
                  }
            })
            return arr_resp;
        }
        return arr_checking;
    },

    async listar_checking_fotografico(){
        return new Promise( async (resolve, reject) => {
            
            //Recuperando coleção de checking
            let collection_checking_fotografico     =  await firestore().collection('onbus-mobile-cto').doc('checking-fotografico').get();
            let arr_checking                        = util.obj_to_array(collection_checking_fotografico._data);

            console.log(":::::VERIFICANDO COLLECTION CHECKING");
            console.log(collection_checking_fotografico);
            console.log(":::::VERIFICANDO ARR CHECKING");
            console.log(arr_checking);

            resolve(arr_checking);

        });
    },

    async registrar_checking(payload){
        return new Promise(async (resolve, reject) => {

            let onibus                      = payload.onibus;
            let av_checking                 = payload.av_checking;
            let av_checking_calendario      = payload.av_checking_calendario;
            let filename                    = payload.filename;
    
            // Monta o indice para que o registro da foto seja salvo no onibus
            let idx_atuacao                 = `${av_checking_calendario.av_id}.checking_calendario.${av_checking_calendario.id}.onibus`;
    
            // Documento do onibus_em_alerta que será editado
            let docRef                      = firestore().collection('onbus-mobile-cto').doc("checking-fotografico");
    
            await docRef.get({source: 'default'}).then( async (docResp) => {
    
                if (!docResp){
                    throw "Checking não localizado para atuação!";
                }
    
                // Registra o envio do arquivo para Firebase Storage
                let nome_arquivo    = util.fileNameAndExt(filename);

                await AsyncUploadFileService.create({
                    path_local_file: filename,
                    path_remote_file: `checking-fotografico/${nome_arquivo}`,
                    payload: {
                        id_onibus:                      onibus.id,
                        numero_onibus:                  onibus.numeroOnibus,
                        av_checking_calendario:         av_checking_calendario,
                        concluir_atuacao:               true,
                        data_atuacao:                   util.now(),
                        tipo_movimento:                 'CHECKING-FOTOGRAFICO',
                        submovimento:                   'REGISTRO_FOTO',
                        arr_movimento:                  [
                            {
                                filename:                   nome_arquivo,
                                id_av:                      av_checking.id,
                                nome_campanha:              av_checking.nome_campanha,
                                cliente:                    av_checking.cliente,
                            }
                        ]
                    }
                });

            });

        });
    }
}
