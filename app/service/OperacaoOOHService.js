import firestore                    from '@react-native-firebase/firestore';
import firebaseStorage              from '@react-native-firebase/storage';
import store                        from './../state/store';
import util                         from './../util/util';
import HistoricoAtuacaoService      from './HistoricoAtuacaoService';
import ApiService                   from './ApiService';
import OnbusMobileCTOSyncService    from './OnbusMobileCTOSyncService';
import { updateOOHEmAlerta, updateFiltroAtuacao }     from './../state/OperacaoOOH/OperacaoOOHAction';
import { updateCTOStatus }          from '../state/CTOStatus/CTOStatusAction';
import { appModalLoading }          from './../state/App/AppAction';
import * as _                       from 'underscore';
import {useSelector}                from 'react-redux';
import { reject } from 'underscore';

const state                     = store.getState();
const onbusMobileCTOCollection  = firestore().collection('cto-ooh-em-alerta');

export default {

    async listar_ooh_pontos_em_alerta(arr_param){
        return new Promise( async (resolve, reject) => {
                let user_auth = store.getState().app.user_auth;
    
                // Lista todos os documentos de Pontos OOH Em Aerta
                let collection_cto_ooh_em_alerta    = await onbusMobileCTOCollection.get();  
                let arr_cto_ooh_em_alerta           = [];

                //Mapeia todos os pontos em alerta
                collection_cto_ooh_em_alerta.forEach((item) => {
                    let ooh_ponto_em_alerta = item.data();
                    arr_cto_ooh_em_alerta.push(ooh_ponto_em_alerta);
                });

               	
                let arr_filtro_atuacao   = store.getState().lib.arr_filtro_atuacao;

                // Lista que armazenará todos os alertas que o técnico pode atuar
                // Ainda tem a parte de filtrar os alertas que o técnico está relacionado, mas acho que issso você já fez e está até funcionando.
                let arr_lista_alerta = [];
                console.log(arr_filtro_atuacao);

                // Vamos iterar cada item recebido do Firestore
                arr_cto_ooh_em_alerta.map((item) => { 

                   console.log(item.id_lib_em_alerta);

                    // Se o técnico pode atuar nesse id_lib_em_alerta, vamos incluir 
                    if (arr_filtro_atuacao.includes(item.id_lib_em_alerta)){
                        incluir_alerta_ooh(item); 
                    }
                
                });

            resolve(arr_lista_alerta);

        });
    },

    async listar_alerta_agrupado_por_tipo(){
        return new Promise((resolve,reject) => {
            let arr_filtro_atuacao = store.getState().lib.arr_filtro_atuacao;
            let arr_ooh_pontos_em_alerta = store.getState().ooh_pontos_em_alerta.pontos_em_alerta;
            let arr_alertas_por_tipo = [];
            
            arr_ooh_pontos_em_alerta.map((item_ooh_alerta) => {
                if(arr_filtro_atuacao.includes(item_ooh_alerta.id_lib_em_alerta)
                     && !Object.keys(item_ooh_alerta).includes('metadata')){
                        incluir_alerta_ooh(item_ooh_alerta)
                    }
            }) 
            
            
            function incluir_alerta_ooh(item) {
                // Vamos procurar na variável "arr_lista_alerta" o "id_lib_em_alerta", para checar se já existe algum registro com o id_lib_em_alerta do item que está no loop
                let i_alerta = arr_alertas_por_tipo.findIndex( alerta => alerta.id_lib_em_alerta == item.id_lib_em_alerta );
                // Se houver algum registro, o valor do índice será maior ou igual a zero
                if (i_alerta >= 0){ 
                    // Vamos apenas adicionar o novo alerta
                    arr_alertas_por_tipo[i_alerta]['arr_alerta'].push(item);
                } else {
                    // Ainda não existe nenhum registro do id_lib_em_alerta na lista de alertas, então vamos criá-lo
                    arr_alertas_por_tipo.push({
                        id_lib_em_alerta: item.id_lib_em_alerta,
                        id_ooh_ponto_em_alerta: item.id_ooh_ponto_em_alerta,
                        alerta: item.alerta,
                        id_ooh_ponto_em_alerta: item.id_ooh_ponto_em_alerta,
                        id_ooh_estabelecimento_ponto: item.id_ooh_estabelecimento_ponto,
                        av: (item.av) ? item.av : null,
                        arr_alerta: [item]
                    });
                }
            }

            resolve(arr_alertas_por_tipo);

        });
    },

    async listar_alerta_agrupado_por_estabelecimento(params){
        return new Promise((resolve,reject) => {
            let arr_filtro_atuacao = store.getState().lib.arr_filtro_atuacao;
            let arr_ooh_pontos_em_alerta = store.getState().ooh_pontos_em_alerta.pontos_em_alerta;
            let arr_alertas_por_estabelecimento = [];

            console.info("::: PONTOS AGRUPADOS POR ESTABELECIMENTO :::");
            console.info("::: PONTOS AGRUPADOS POR ESTABELECIMENTO :::");
            console.info("::: PONTOS AGRUPADOS POR ESTABELECIMENTO :::");
            console.log(JSON.stringify(arr_ooh_pontos_em_alerta, null, 4));

            arr_ooh_pontos_em_alerta.map((item_ooh_alerta) => {
                if(item_ooh_alerta.metadata==undefined){
                    separar_por_estabelecimento(item_ooh_alerta);
                }
            })

            //Função que separa os alertas por estabelecimento
            function separar_por_estabelecimento(item){

                let i_estabelecimento = arr_alertas_por_estabelecimento
                .findIndex( estabelecimento => {
                    estabelecimento.id_estabelecimento == item.id_estabelecimento 
                });
                if(i_estabelecimento >= 0 ){
                    arr_alertas_por_estabelecimento[i_estabelecimento]['arr_pontos'].push(item);
                } else {
                    arr_alertas_por_estabelecimento.push({
                        id_lib_em_alerta: item.id_lib_em_alerta,
                        id_ooh_ponto_em_alerta: item.id_ooh_ponto_em_alerta,
                        id_estabelecimento: item.id_estabelecimento,
                        estabelecimento: item.estabelecimento,
                        arr_pontos: [item]
                    })
                }
            }

            resolve(arr_alertas_por_estabelecimento);
        });
    },

    async listar_alerta_para_atuacao(params){
        return new Promise((resolve,reject) => {
            let arr_ooh_pontos_em_alerta = store.getState().ooh_pontos_em_alerta.pontos_em_alerta;
            let arr_lista_exibicao_tipo = [];
            let arr_lista_exibicao_estabelecimento = [];

            if('id_lib_em_alerta' in params){
                arr_ooh_pontos_em_alerta.map((item_ooh_alerta) => {
                    if(params.id_lib_em_alerta == item_ooh_alerta.id_lib_em_alerta){
                        arr_lista_exibicao_tipo.push(item_ooh_alerta);
                    }
                })
                resolve(arr_lista_exibicao_tipo);
            }

            if('id_estabelecimento' in params){
                arr_ooh_pontos_em_alerta.map((item_ooh_alerta) => {
                    if(params.id_estabelecimento == item_ooh_alerta.id_estabelecimento){
                        arr_lista_exibicao_estabelecimento.push(item_ooh_alerta);
                    }
                })
                resolve(arr_lista_exibicao_estabelecimento);
            }

        });
    },

    async watch_ooh_pontos_em_alerta (){
        await onbusMobileCTOCollection.onSnapshot((snapshot) => { 
            if (snapshot){
                let user_auth                           = store.getState().app.user_auth;
                let arr_filtro_atuacao                  = store.getState().lib.arr_filtro_atuacao;
                let arr_lista_alerta                    = [];
                let arr_alertas                         = [];
                let total_ooh_a_fazer = 0;


                snapshot.docs.map(function(doc){

                    let item_ooh_alerta = doc.data(); 

                    arr_alertas.push(item_ooh_alerta);

                    console.info("*** *** *** ***");
                    console.info(arr_filtro_atuacao);
                    console.info("*** *** *** ***");
                    
        
                    //Filtra se o documento está no array de alertas 
                    //que o técnico pode atuar e verifica se ele já foi concluido
                    if(arr_filtro_atuacao.includes(item_ooh_alerta.id_lib_em_alerta)
                     && !Object.keys(item_ooh_alerta).includes('metadata')){
                        // console.info(`::: Adicionando alerta OOH para o técnico atuar: ${item_ooh_alerta.id_lib_em_alerta}`);
                            arr_lista_alerta.push(item_ooh_alerta);
                            total_ooh_a_fazer++;
                    }

                });

                console.log("::: ALERTAS DE OOH QUE PODEM SER ATUADOS :::");
                console.log("::: ALERTAS DE OOH QUE PODEM SER ATUADOS :::");
                console.log("::: ALERTAS DE OOH QUE PODEM SER ATUADOS :::");
                console.log(JSON.stringify(arr_filtro_atuacao, null, 2));

                // Atualizar lista
                store.dispatch(updateOOHEmAlerta({
                    //pontos_em_alerta: arr_ooh_pontos_em_alerta,
                    pontos_em_alerta: arr_lista_alerta
                }));

                //Atualiza a quantidade de alertas OOH que aquele técnico tem para atuar
                store.dispatch(updateCTOStatus({
                    total_ooh_a_fazer: total_ooh_a_fazer,
                }))

            }
        });
    },

    async watch_funcionario_filtro_atuacao (){
        await firestore().collection('cto-library').doc("funcionario-filtro-atuacao").onSnapshot((documentSnapshot) => {

            if (documentSnapshot.data()){

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

                store.dispatch(updateFiltroAtuacao({
                    arr_filtro_atuacao:  arr_filtro_atuacao
                }));    

            }
                            
        });
    },

    async registrar_foto_atuacao(payload){

            let alerta                      = payload.alerta;
            let ponto_em_alerta_atuacao     = payload.ponto_em_alerta_atuacao
            let filename                    = payload.filename;

            // Monta os indices para vinculação da atuação
            let id_ooh_ponto_em_alerta         = alerta.id_ooh_ponto_em_alerta;
            let id_ooh_ponto_em_alerta_atuacao = ponto_em_alerta_atuacao.id;

            // Documento do ponto_em_alerta que será editado
            let idx_atuacao                 = `arr_atuacao.${id_ooh_ponto_em_alerta_atuacao}`;
            let docRef                      = firestore().collection('cto-ooh-em-alerta').doc(id_ooh_ponto_em_alerta.toString());

            await docRef.get({source: 'default'}).then( async (docResp) => {

                if (!docResp){
                    throw "Alerta não localizado para atuação!";
                }

                // Registra o envio do arquivo para Firebase Storage
                let nome_arquivo    = util.fileNameAndExt(filename);
                let file_path       = `ooh/${nome_arquivo}`;
                const ref           = firebaseStorage().ref(`${file_path}`);
        
                // Realiza o upload do arquivo para o Firebase Storage
                let task = ref.putFile(filename).then((res) => {

                    console.log("::: ARQUIVO REGISTRADO COM SUCESSO! :::");

                    //Registra a atuação
                    docRef.update({
                        [`${idx_atuacao}.metadata`]: {
                            filename:                   file_path,
                            sync:                       false,
                            data_atuacao:               util.now()
                        }
                    }); 
                });

                task.then(() => {

                    // Sincroniza a atuação com a CGO
                    OnbusMobileCTOSyncService.registrar_atuacao_ooh({
                        id_ooh_estabelecimento_ponto:   alerta.id_ooh_estabelecimento_ponto,
                        ooh_ponto_em_alerta:            alerta,
                        ooh_ponto_em_alerta_atuacao:    ponto_em_alerta_atuacao,
                        data_atuacao:                   util.now(),
                        tipo_movimento:                 'OPERACAO_OOH',
                        submovimento:                   'FOTO_ATUACAO',
                        arr_movimento:                  [
                            {
                                id_ooh_ponto_em_alerta_atuacao: id_ooh_ponto_em_alerta_atuacao,
                                id_lib_em_alerta_atuacao:       ponto_em_alerta_atuacao.id_lib_em_alerta_atuacao,
                                filename:                       file_path
                            }
                        ]
                    });

                });

            }).catch((error) => {
                console.error("::: ERRO NA FUNÇÃO :::");
                console.info(error);
            });

    },

    async registrar_video_atuacao(payload){

        let alerta                      = payload.alerta;
        let ponto_em_alerta_atuacao     = payload.ponto_em_alerta_atuacao
        let filename                    = payload.filename;

        // Monta o indice para que o patrimonio seja vinculado a atuação correta
        let id_ooh_ponto_em_alerta         = alerta.id_ooh_ponto_em_alerta;
        let id_ooh_ponto_em_alerta_atuacao = ponto_em_alerta_atuacao.id;

        // Documento do ponto_em_alerta que será editado
        let idx_atuacao                 = `arr_atuacao.${id_ooh_ponto_em_alerta_atuacao}`;
        let docRef                      = firestore().collection('cto-ooh-em-alerta').doc(id_ooh_ponto_em_alerta.toString());

        await docRef.get({source: 'default'}).then( async (docResp) => {

            if (!docResp){
                throw "Alerta não localizado para atuação!";
            }

            // Registra o envio do arquivo para Firebase Storage
            let nome_arquivo    = util.fileNameAndExt(payload.filename);
            let filename        = `ooh/${nome_arquivo}`;
            const ref           = firebaseStorage().ref(filename);
    
            // Realiza o upload do arquivo para o Firebase Storage
            let task = ref.putFile(payload.filename).then((res) => {

                console.log("::: ARQUIVO REGISTRADO COM SUCESSO! :::");

                //Registra a atuação
                docRef.update({
                    [`${idx_atuacao}.metadata`]: {
                        filename:                   filename,
                        sync:                       false,
                        data_atuacao:               util.now()
                    }
                });

            });

            task.then(() => {

                // Sincroniza a atuação com a CGO
                OnbusMobileCTOSyncService.registrar_atuacao_ooh({
                    id_ooh_estabelecimento_ponto:   alerta.id_ooh_estabelecimento_ponto,
                    ooh_ponto_em_alerta:            alerta,
                    ooh_ponto_em_alerta_atuacao:    ponto_em_alerta_atuacao,
                    data_atuacao:                   util.now(),
                    tipo_movimento:                 'OPERACAO_OOH', 
                    submovimento:                   'VIDEO_ATUACAO',
                    arr_movimento:                  [
                        {
                            id_ooh_ponto_em_alerta_atuacao:     id_ooh_ponto_em_alerta_atuacao,
                            filename:                           filename
                        }
                    ]
                });

            });

        });

    },

    async concluir_atuacao(payload){

        let alerta                      = payload.alerta;

        // Monta o indice vincular a atuação
        let id_ooh_ponto_em_alerta              = alerta.id_ooh_ponto_em_alerta;
        //let idx_alerta                 = `arr_alerta.${id_onibus_em_alerta}`;

        // Documento do onibus_em_alerta que será editado
        let docRef      = firestore().collection('cto-ooh-em-alerta').doc(id_ooh_ponto_em_alerta.toString());

        await docRef.get({source: 'default'}).then( async (docResp) => {

            if (!docResp){
                throw "Alerta não localizado para atuação!";
            }

            //Registra a atuação
            docRef.update({
                [`metadata`]: {
                    concluir_atuacao: true,
                    data_atuacao:     util.now()
                }
            });
            
            // Sincroniza a atuação com a CGO
            OnbusMobileCTOSyncService.registrar_atuacao_ooh({
                id_ooh_estabelecimento_ponto:   alerta.id_ooh_estabelecimento_ponto,
                ooh_ponto_em_alerta:            alerta,
                data_atuacao:                   util.now(),
                tipo_movimento:                 'OPERACAO_OOH', 
                submovimento:                   'CONCLUIR_ALERTA',
                arr_movimento:                  [
                    {
                        data_atuacao:                   util.now(),
                    }
                ]
            });
            
        });

    },
    
}

