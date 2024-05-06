import firestore                    from '@react-native-firebase/firestore';
import firebaseStorage              from '@react-native-firebase/storage';
import store                        from './../state/store';
import util                         from './../util/util';
import HistoricoAtuacaoService      from './HistoricoAtuacaoService';
import ApiService                   from './ApiService';
import OnbusMobileCTOSyncService    from './OnbusMobileCTOSyncService';
import { updateOnibusEmAlerta, updateFiltroAtuacao }     from './../state/OperacaoGaragem/OnibusEmAlertaAction';
import { appModalLoading }          from './../state/App/AppAction';
import * as _                       from 'underscore';
import {useSelector}                from 'react-redux';
import EmpresaOnibusFuncionarioService from './EmpresaOnibusFuncionarioService';
import { collection, doc, setDoc, query, where, orderBy, startAfter, limit, getDocs }  from "@react-native-firebase/firestore";
import { updateCTOStatus } from '../state/CTOStatus/CTOStatusAction';

const state                     = store.getState();
const onbusMobileCTOCollection  = firestore().collection('cto-onibus-em-alerta');


export default {

    async listar_onibus_em_alerta(arr_param){
        return new Promise( async (resolve, reject) => { 

            //Filtro de empresa
            let id_empresa_onibus = null;
            
            if(arr_param && arr_param.id_empresa_onibus){
                id_empresa_onibus = arr_param.id_empresa_onibus;
            }

            //Recuperar filtro de atuação
            let user_auth                       = store.getState().app.user_auth;
            //console.log("::USER: "+JSON.stringify(user_auth));
            let doc_funcionario_filtro_atuacao  = await firestore().collection('cto-library').doc("funcionario-filtro-atuacao").get();

            // Filtra os alertas possíveis que o Técnico pode atuar
            let arr_id_lib_em_alerta            = util.obj_to_array(doc_funcionario_filtro_atuacao.data())
            .filter((item) => {
                if (item.id_funcionario == user_auth.id){
                    return item;
                }  
            })
            .map((item) => {
                return item.id_lib_em_alerta 
            });

            let arr_onibus_em_alerta                   = [];

            //FILTRAR LISTA PELA EMPRESA DE ACORDO COM A CONDICIONAL
            //verifica se há filtro, se houver filtra a lista apenas para a empresa
            if(id_empresa_onibus!=null){
                console.log(":::TEM ID SELECIONADO, FILTRAR LISTA")
                //recuperar dados do banco utilizando a clausula where para filtrar pela empresa
                let onibus_em_alerta_garagem            =  await firestore().collection('cto-onibus-em-alerta').where('id_garagem', '==', id_empresa_onibus).get();

                onibus_em_alerta_garagem._docs.forEach((item)=>{
                    let onibus_em_alerta = item.data();
                    let lista_alertas = util.obj_to_array(onibus_em_alerta.arr_alerta);
                    onibus_em_alerta.arr_alerta = lista_alertas;
                    arr_onibus_em_alerta.push(onibus_em_alerta);
                })
            }
            //se não tem nenhum filtro de empresa, filtrar lista de acordo com as empresas associadas ao funcionario
            else{
                //recuperar toda a lista de onibus em alerta
                let collection_onibus_em_alerta            =  await firestore().collection('cto-onibus-em-alerta').get();
                //recuperar garagens associadas ao usuário logado
                let arr_empresa_onibus_funcionario = await EmpresaOnibusFuncionarioService.listar_empresa_onibus_funcionario();
                
                console.log(":::::SEM FILTRO DE EMPRESA, FILTRAR PELA LISTA DE EMPRESAS ASSOCIADAS");
                //console.log(arr_empresa_onibus_funcionario);
                
                collection_onibus_em_alerta.forEach((item)=>{
                    //define a variavel pelos dados da coleção
                    let onibus_em_alerta = item.data();
                    //testa se o onibus em alerta pertence a alguma das empresas que o tecnico pode atuar
                    for(let empresa of arr_empresa_onibus_funcionario){
                        if(empresa.id_empresa_onibus === onibus_em_alerta.id_garagem){
                            //Convertendo alertas em array para manter a estrutura de dados esperadas
                            let lista_alertas = util.obj_to_array(onibus_em_alerta.arr_alerta);
                            onibus_em_alerta.arr_alerta = lista_alertas;
                            //se o onibus pertence a empresa, incluir no arr_onibus_em_alerta
                            arr_onibus_em_alerta.push(onibus_em_alerta);
                        }
                    }
                })
            }
            
            //Filtrando os alertas pelo filtro de atuacao
            let arr_onibus_em_alerta_filtrado = [] //Cria uma lista vazia para receber alertas filtrados
            //varrer array onibus_em_alerta
            arr_onibus_em_alerta.map(item => {
                let alerta_filtro = [] //Lista auxiliar para remover alertas onde o técnico não pode atuar
                //mapear arr de alertas
                item.arr_alerta.map(alerta => {
                    //se a lista lib em alertas inclui o lib do alerta o técnico pode atuar
                    if(arr_id_lib_em_alerta.includes(alerta.id_lib_em_alerta)){
                        alerta_filtro.push(alerta); //add o alerta na lista aux filtrada
                    }
                })
                //define a variavel arr_alerta para a versão filtrada que exclui alertas que não podem ser atuados
                item.arr_alerta=alerta_filtro;
                //push no array de onibus em alertas filtrado
                arr_onibus_em_alerta_filtrado.push(item)
            })

            //ORDENANDO POR NUMERO (ORDENAÇÃO PADRAO)
            arr_onibus_em_alerta_filtrado.sort(function(b,a){
                return b.numero_onibus - a.numero_onibus;
            });

            /* console.log(":::::VERIFICANDO ARR_ONIBUS_EM_ALERTA");
            console.log(arr_onibus_em_alerta);
            console.log(":::::VERIFICANDO ARR_ONIBUS_EM_ALERTA FILTRADO");
            console.log(arr_onibus_em_alerta_filtrado); */

            resolve(arr_onibus_em_alerta_filtrado);

        });
    },

    ordenar_lista(tipo, lista){
        if(tipo == "data-asc"){
          return lista.sort(function(b,a){
            return util.diff_in_days(b.em_alerta_at) - util.diff_in_days(a.em_alerta_at);
          });
        }
        else if(tipo == "data-desc"){
          return lista.sort(function(a,b){
            return util.diff_in_days(b.em_alerta_at) - util.diff_in_days(a.em_alerta_at);
          });
        }
        //Ordenação padrão: por numero
        else{
          return lista.sort(function(b,a){
            return b.numero_onibus - a.numero_onibus;
          });
        }
    },

    filtrar_por_numero(str, lista){
        return lista.filter(item=>{
            if (item.numero_onibus.startsWith(str)){
                return item;
            }
        })
    },

    async watch_onibus_em_alerta(){

        // Analisar se já temos as garagens relacionadas ao usuário
        let timer = setInterval(async () =>{

            let state                           = store.getState();
            let arr_empresa_onibus_funcionario  = state.empresa_onibus_funcionario.data;

            if (arr_empresa_onibus_funcionario.length){

                await onbusMobileCTOCollection.onSnapshot((snapshot) => {
                    if (snapshot){

                        let state                           = store.getState();
                        let arr_onibus_em_alerta            = snapshot.docs.map(doc => doc.data());
                        let arr_empresa_onibus_funcionario  = state.empresa_onibus_funcionario.data;

                        // Filtra apenas os onibus que estão associados a Garagens em que o usuário pode atuar
                        let arr_onibus_em_alerta_filter     = arr_onibus_em_alerta.filter((item) => {
                            for(let empresa_onibus_funcionario of arr_empresa_onibus_funcionario){
                                if (empresa_onibus_funcionario.id_empresa_onibus == item.id_garagem){
                                    return item;
                                }
                            }
                        });

                        // Lista as Garagens que o Técnico está associado
                        store.dispatch(updateOnibusEmAlerta({
                            data: arr_onibus_em_alerta_filter,
                            array_garagem: arr_empresa_onibus_funcionario
                        }));

                    }
                });

                // Como já temos registro de garagens associadas, parar o Timer
                clearInterval(timer);
            }

        }, 500);

    },

    async watch_funcionario_filtro_atuacao (){
        let user_auth   = store.getState().app.user_auth;
        
        await firestore().collection('cto-library').doc("funcionario-filtro-atuacao").onSnapshot((documentSnapshot) => {

            if (documentSnapshot.data()){
                let docData     = util.obj_to_array(documentSnapshot.data());
                // Armazena a lista original
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

    async associar_patrimonio(payload){
        try {

            let onibus_em_alerta            = payload.onibus_em_alerta;
            let alerta                      = payload.alerta;
            let onibus_em_alerta_atuacao    = payload.onibus_em_alerta_atuacao;
            let equipamento                 = payload.equipamento;
            let reutilizar                  = payload.reutilizar;

            // Caso não haja "id_onibus_em_alerta_atuacao", precisamos cria-lo agora
            // Significa que a atuação foi criada pelo Técnico no momento da atuação
            let id_onibus_em_alerta_atuacao = await this.verificar_adicionar_atuacao({
                onibus_em_alerta:           onibus_em_alerta,
                onibus_em_alerta_atuacao:   onibus_em_alerta_atuacao,
                alerta:                     alerta
            }); 

            // Documento do onibus_em_alerta que será editado
            let id_onibus_em_alerta = alerta.id_onibus_em_alerta;
            let idx_atuacao         = `arr_alerta.${id_onibus_em_alerta}.arr_atuacao.${id_onibus_em_alerta_atuacao}`;
            let docRef              = firestore().collection('cto-onibus-em-alerta').doc(onibus_em_alerta.numero_onibus);
            let docEquip            = firestore().collection('onbus-mobile-cto').doc("equipamento-funcionario-controle");

            // Monta o indice para que o patrimonio seja vinculado a atuação correta
            let arr_metadata                = (onibus_em_alerta_atuacao['metadata'] !== undefined) ? onibus_em_alerta_atuacao['metadata'] : [];

            await docRef.get({source: 'default'}).then( async (docResp) => {

                if (!docResp){
                    throw "Carro não localizado para atuação!";
                }

                // 3. Vincula temporariamente o patrimonio ao carro
                // 3.1 Caso haja, obtém os equipamentos já associados ao carro, do contrário, cria um array vazio
                let arr_onibus_equipamento = (onibus_em_alerta.arr_equipamento !== undefined) ? util.obj_to_array(onibus_em_alerta.arr_equipamento) : [];
        
                // 3.2 Vincula o patrimonio na lista do carro
                // Se o patrimonio estiver sendo reutilizado, não precisa fazer a etapa logo abaixo
                if (!reutilizar){

                    arr_onibus_equipamento.push({
                        id_equipamento:             equipamento.id_equipamento,
                        id_lib_equipamento_tipo:    equipamento.id_lib_equipamento_tipo,
                        patrimonio:                 equipamento.patrimonio,
                        tipo:                       equipamento.tipo,
                        descricao:                  equipamento.descricao,
                        sync:                       false // Indica que o equipamento ainda não foi sincronizado na CGO
                    }); 
                    
                }

                //Registra a atuação
                arr_metadata.push({
                    id_equipamento:             equipamento.id_equipamento,
                    id_lib_equipamento_tipo:    equipamento.id_lib_equipamento_tipo,
                    patrimonio:                 equipamento.patrimonio,
                    flag:                       'ENTRADA',
                    data_atuacao:               util.now()
                });

                // Registra que o patrimonio foi associado
                docRef.update({
                    [`${idx_atuacao}.metadata`]: arr_metadata,
                    [`arr_equipamento`]: arr_onibus_equipamento
                });

            });

            docEquip.update({
                [`idx-${equipamento.id_equipamento}.metadata`]: {
                    status: `Associado ao carro ${onibus_em_alerta.numero_onibus}`
                }
            });

            // Sincroniza a atuação com a CGO
            OnbusMobileCTOSyncService.registrar_atuacao({
                id_onibus:                      onibus_em_alerta.id_onibus,
                numero_onibus:                  onibus_em_alerta.numero_onibus,
                onibus_em_alerta:               alerta,
                onibus_em_alerta_atuacao:       onibus_em_alerta_atuacao, 
                data_atuacao:                   util.now(),
                tipo_movimento:                 'OPERACAO_GARAGEM',
                submovimento:                   'ASSOCIAR_PATRIMONIO',
                arr_movimento:                  [
                    {
                        id_onibus_em_alerta_atuacao:        id_onibus_em_alerta_atuacao,
                        id_lib_em_alerta_atuacao:           onibus_em_alerta_atuacao.id_lib_em_alerta_atuacao,
                        id_equipamento:                     equipamento.id_equipamento,
                        patrimonio:                         equipamento.patrimonio,
                        id_lib_equipamento_tipo:            equipamento.id_lib_equipamento_tipo,
                        flag:                               'ENTRADA'
                    }
                ]
            });

        } catch (e){
            console.error("::: ERRO AO ASSOCIAR PATRIMÔNIO :::");
            console.error("::: ERRO AO ASSOCIAR PATRIMÔNIO :::");
            console.error("::: ERRO AO ASSOCIAR PATRIMÔNIO :::");
            console.error(e);
        }
    },

    async desassociar_patrimonio(payload){
        try {

            let onibus_em_alerta                = payload.onibus_em_alerta;
            let alerta                          = payload.alerta;
            let onibus_em_alerta_atuacao        = payload.onibus_em_alerta_atuacao;
            let equipamento                     = payload.equipamento_saida;
            let lib_equipamento_motivo_retirada = payload.lib_equipamento_motivo_retirada;
            let observacao                      = payload.observacao;

            // Caso não haja "id_onibus_em_alerta_atuacao", precisamos cria-lo agora
            // Significa que a atuação foi criada pelo Técnico no momento da atuação
            let id_onibus_em_alerta_atuacao = await this.verificar_adicionar_atuacao({
                onibus_em_alerta:           onibus_em_alerta,
                onibus_em_alerta_atuacao:   onibus_em_alerta_atuacao,
                alerta:                     alerta
            }); 

            // Documento do onibus_em_alerta que será editado
            let id_onibus_em_alerta = alerta.id_onibus_em_alerta;
            let idx_atuacao         = `arr_alerta.${id_onibus_em_alerta}.arr_atuacao.${id_onibus_em_alerta_atuacao}`;
            let arr_metadata        = (onibus_em_alerta_atuacao['metadata'] !== undefined) ? onibus_em_alerta_atuacao['metadata'] : [];
            let docRef              = firestore().collection('cto-onibus-em-alerta').doc(onibus_em_alerta.numero_onibus);
            let docEquip            = firestore().collection('onbus-mobile-cto').doc("equipamento-funcionario-controle");

            await docRef.get({source: 'default'}).then( async (docResp) => {

                if (!docResp){
                    throw "Carro não localizado para atuação!";
                }

                // 3. Desvincula temporariamente o patrimônio do carro
                let arr_onibus_equipamento  = (onibus_em_alerta.arr_equipamento !== undefined) ? util.obj_to_array(onibus_em_alerta.arr_equipamento) : [];
                

                // Localiza o index do equipamento no array de patrimonios associados ao carro
                if (arr_onibus_equipamento.length){

                    let i_equip                 = null;
                    arr_onibus_equipamento.filter((item, i) => {
                        if (item.id_equipamento == equipamento.id_equipamento){
                            i_equip = i;
                            return item;
                        }
                    });
    
                    // Se encontarmos o indice do patrimonio, remove-lo
                    if (i_equip){
                        arr_onibus_equipamento.splice(i_equip, 1);
                    }

                }

                //Registra a atuação
                arr_metadata.push({
                    id_equipamento:                     equipamento.id_equipamento,
                    id_lib_equipamento_tipo:            equipamento.id_lib_equipamento_tipo,
                    id_lib_equipamento_motivo_retirada: lib_equipamento_motivo_retirada.id,
                    patrimonio:                         equipamento.patrimonio,
                    observacao:                         observacao,
                    flag:                               'SAIDA',
                    data_atuacao:                       util.now()
                });

                docRef.update({
                    [`${idx_atuacao}.metadata`]: arr_metadata,
                    [`arr_equipamento`]: arr_onibus_equipamento
                });

            });

            docEquip.update({
                [`idx-${equipamento.id_equipamento}.metadata`]: {
                    status: `Desassociado do carro ${onibus_em_alerta.numero_onibus}`
                }
            });

            // Sincroniza a atuação com a CGO
            OnbusMobileCTOSyncService.registrar_atuacao({
                id_onibus:                      onibus_em_alerta.id_onibus,
                numero_onibus:                  onibus_em_alerta.numero_onibus,
                onibus_em_alerta:               alerta,
                onibus_em_alerta_atuacao:       onibus_em_alerta_atuacao,
                data_atuacao:                   util.now(),
                tipo_movimento:                 'OPERACAO_GARAGEM',
                submovimento:                   'DESASSOCIAR_PATRIMONIO',
                arr_movimento:                  [
                    {
                        id_onibus_em_alerta_atuacao:        id_onibus_em_alerta_atuacao,
                        id_lib_em_alerta_atuacao:           onibus_em_alerta_atuacao.id_lib_em_alerta_atuacao,
                        id_equipamento:                     equipamento.id_equipamento,
                        patrimonio:                         equipamento.patrimonio,
                        id_lib_equipamento_tipo:            equipamento.id_lib_equipamento_tipo,
                        id_lib_equipamento_motivo_retirada: lib_equipamento_motivo_retirada.id,
                        observacao:                         observacao,
                        flag:                               'SAIDA'
                    }
                ]
            });
            
        } catch (e){
            console.error("::: ERRO AO DESASSOCIAR PATRIMÔNIO :::");
            console.error("::: ERRO AO DESASSOCIAR PATRIMÔNIO :::");
            console.error("::: ERRO AO DESASSOCIAR PATRIMÔNIO :::");
            console.error(e);
        }
    },

    async substituir_patrimonio(payload){
        try {

            let onibus_em_alerta                = payload.onibus_em_alerta;
            let alerta                          = payload.alerta;
            let onibus_em_alerta_atuacao        = payload.onibus_em_alerta_atuacao;
            let equipamento_entrada             = payload.equipamento_entrada;
            let equipamento_saida               = payload.equipamento_saida;
            let lib_equipamento_motivo_retirada = payload.lib_equipamento_motivo_retirada;
            let observacao                      = payload.observacao;
            
            // Caso não haja "id_onibus_em_alerta_atuacao", precisamos cria-lo agora
            // Significa que a atuação foi criada pelo Técnico no momento da atuação
            let id_onibus_em_alerta_atuacao = await this.verificar_adicionar_atuacao({
                onibus_em_alerta:           onibus_em_alerta,
                onibus_em_alerta_atuacao:   onibus_em_alerta_atuacao,
                alerta:                     alerta
            }); 

            // Documento do onibus_em_alerta que será editado
            let idx_atuacao = `arr_alerta.${alerta.id_onibus_em_alerta}.arr_atuacao.${id_onibus_em_alerta_atuacao}`;
            let docRef      = firestore().collection('cto-onibus-em-alerta').doc(onibus_em_alerta.numero_onibus);
            let docEquip    = firestore().collection('onbus-mobile-cto').doc("equipamento-funcionario-controle");
    
            await docRef.get({source: 'default'}).then( async (docResp) => {

                if (!docResp){
                    throw "Carro não localizado para atuação!";
                }

                // 3. Desvincula temporariamente o patrimônio do carro
                let arr_onibus_equipamento  = (onibus_em_alerta.arr_equipamento !== undefined) ? util.obj_to_array(onibus_em_alerta.arr_equipamento) : [];
                

                // Localiza o index do equipamento no array de patrimonios associados ao carro
                if (arr_onibus_equipamento.length){

                    let i_equip                 = null;
                    arr_onibus_equipamento.filter((item, i) => {
                        if (item.id_equipamento == equipamento_saida.id_equipamento){
                            i_equip = i;
                            return item;
                        }
                    });
    
                    // Se encontarmos o indice do patrimonio, remove-lo
                    if (i_equip){
                        arr_onibus_equipamento.splice(i_equip, 1);
                    }

                }

                // Registra a associação do patrimônio ao carro
                arr_onibus_equipamento.push({
                    id_equipamento:             equipamento_entrada.id_equipamento,
                    id_lib_equipamento_tipo:    equipamento_entrada.id_lib_equipamento_tipo,
                    patrimonio:                 equipamento_entrada.patrimonio,
                    tipo:                       equipamento_entrada.tipo,
                    descricao:                  equipamento_entrada.descricao,
                    sync:                       false // Indica que o equipamento ainda não foi sincronizado na CGO
                });

                //Registra a atuação de retirada de patrimônio
                let arr_metadata = [];

                arr_metadata.push({
                    id_equipamento:                     equipamento_saida.id_equipamento,
                    id_lib_equipamento_tipo:            equipamento_saida.id_lib_equipamento_tipo,
                    id_lib_equipamento_motivo_retirada: lib_equipamento_motivo_retirada.id,
                    patrimonio:                         equipamento_saida.patrimonio,
                    observacao:                         observacao,
                    flag:                               'SAIDA',
                    data_atuacao:                       util.now()
                });

                // Registra a atuação de entrada de patrimônio
                arr_metadata.push({
                    id_equipamento:             equipamento_entrada.id_equipamento,
                    id_lib_equipamento_tipo:    equipamento_entrada.id_lib_equipamento_tipo,
                    
                    flag:                       'ENTRADA',
                    data_atuacao:               util.now()
                });

                docRef.update({
                    [`${idx_atuacao}.metadata`]: arr_metadata,
                    [`arr_equipamento`]: arr_onibus_equipamento
                });

            }); 

            docEquip.update({
                [`idx-${equipamento_entrada.id_equipamento}.metadata`]: {
                    status: `Associado ao carro ${onibus_em_alerta.numero_onibus}`
                },
                [`idx-${equipamento_saida.id_equipamento}.metadata`]: {
                    status: `Desassociado ao carro ${onibus_em_alerta.numero_onibus}`
                }
            });

            // Sincroniza a atuação com a CGO
            OnbusMobileCTOSyncService.registrar_atuacao({
                id_onibus:                      onibus_em_alerta.id_onibus,
                numero_onibus:                  onibus_em_alerta.numero_onibus,
                onibus_em_alerta:               alerta,
                onibus_em_alerta_atuacao:       onibus_em_alerta_atuacao,
                data_atuacao:                   util.now(),
                tipo_movimento:                 'OPERACAO_GARAGEM',
                submovimento:                   'SUBSTITUIR_PATRIMONIO',
                arr_movimento:                  [
                    {
                        id_onibus_em_alerta_atuacao:        id_onibus_em_alerta_atuacao,
                        id_lib_em_alerta_atuacao:           onibus_em_alerta_atuacao.id_lib_em_alerta_atuacao,
                        id_equipamento:                     equipamento_saida.id_equipamento,
                        patrimonio:                         equipamento_saida.patrimonio,
                        id_lib_equipamento_tipo:            equipamento_saida.id_lib_equipamento_tipo,
                        id_lib_equipamento_motivo_retirada: lib_equipamento_motivo_retirada.id,
                        observacao:                         observacao,
                        flag:                               'SAIDA'
                    },
                    {
                        id_onibus_em_alerta_atuacao:        id_onibus_em_alerta_atuacao,
                        id_lib_em_alerta_atuacao:           onibus_em_alerta_atuacao.id_lib_em_alerta_atuacao,
                        id_equipamento:                     equipamento_entrada.id_equipamento,
                        patrimonio:                         equipamento_entrada.patrimonio,
                        id_lib_equipamento_tipo:            equipamento_entrada.id_lib_equipamento_tipo,
                        flag:                               'ENTRADA'
                    }
                ]
            });

        } catch (e){
            console.error("::: ERRO AO SUBSTITUIR PATRIMÔNIO :::");
            console.error("::: ERRO AO SUBSTITUIR PATRIMÔNIO :::");
            console.error("::: ERRO AO SUBSTITUIR PATRIMÔNIO :::");
            console.error(e);
        }
    },

    async registrar_foto_atuacao(payload){

        let onibus_em_alerta            = payload.onibus_em_alerta;
        let alerta                      = payload.alerta;
        let onibus_em_alerta_atuacao    = payload.onibus_em_alerta_atuacao;
        let filename                    = payload.filename;

        // Monta o indice para que o patrimonio seja vinculado a atuação correta
        let id_onibus_em_alerta         = alerta.id_onibus_em_alerta;

        // Caso não haja "id_onibus_em_alerta_atuacao", precisamos cria-lo agora
        // Significa que a atuação foi criada pelo Técnico no momento da atuação
        let id_onibus_em_alerta_atuacao = await this.verificar_adicionar_atuacao({
            onibus_em_alerta:           onibus_em_alerta,
            onibus_em_alerta_atuacao:   onibus_em_alerta_atuacao,
            alerta:                     alerta
        }); 

        // Documento do onibus_em_alerta que será editado
        let idx_atuacao                 = `arr_alerta.${id_onibus_em_alerta}.arr_atuacao.${id_onibus_em_alerta_atuacao}`;
        let docRef                      = firestore().collection('cto-onibus-em-alerta').doc(onibus_em_alerta.numero_onibus);

        await docRef.get({source: 'default'}).then( async (docResp) => {

            if (!docResp){
                throw "Carro não localizado para atuação!";
            }

            // Registra o envio do arquivo para Firebase Storage
            let nome_arquivo    = util.fileNameAndExt(payload.filename);
            let file_path       = `cto/${nome_arquivo}`;
            const ref           = firebaseStorage().ref(`${file_path}`);
    
            // Realiza o upload do arquivo para o Firebase Storage
            let task = ref.putFile(payload.filename).then((res) => {

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
                OnbusMobileCTOSyncService.registrar_atuacao({
                    id_onibus:                      onibus_em_alerta.id_onibus,
                    numero_onibus:                  onibus_em_alerta.numero_onibus,
                    onibus_em_alerta:               alerta,
                    onibus_em_alerta_atuacao:       onibus_em_alerta_atuacao,
                    data_atuacao:                   util.now(),
                    tipo_movimento:                 'OPERACAO_GARAGEM',
                    submovimento:                   'FOTO_ATUACAO',
                    arr_movimento:                  [
                        {
                            id_onibus_em_alerta_atuacao:    id_onibus_em_alerta_atuacao,
                            id_lib_em_alerta_atuacao:       onibus_em_alerta_atuacao.id_lib_em_alerta_atuacao,
                            filename:                       file_path
                        }
                    ]
                });

            });

        });


    },

    async registrar_video_atuacao(payload){

        let onibus_em_alerta            = payload.onibus_em_alerta;
        let alerta                      = payload.alerta;
        let onibus_em_alerta_atuacao    = payload.onibus_em_alerta_atuacao;
        let filename                    = payload.filename;

        // Monta o indice para que o patrimonio seja vinculado a atuação correta
        let id_onibus_em_alerta         = alerta.id_onibus_em_alerta;

        // Caso não haja "id_onibus_em_alerta_atuacao", precisamos cria-lo agora
        // Significa que a atuação foi criada pelo Técnico no momento da atuação
        let id_onibus_em_alerta_atuacao = await this.verificar_adicionar_atuacao({
            onibus_em_alerta:           onibus_em_alerta,
            onibus_em_alerta_atuacao:   onibus_em_alerta_atuacao,
            alerta:                     alerta
        }); 

        // Documento do onibus_em_alerta que será editado
        let idx_atuacao = `arr_alerta.${id_onibus_em_alerta}.arr_atuacao.${id_onibus_em_alerta_atuacao}`;
        let docRef      = firestore().collection('cto-onibus-em-alerta').doc(onibus_em_alerta.numero_onibus);

        await docRef.get({source: 'default'}).then( async (docResp) => {

            if (!docResp){
                throw "Carro não localizado para atuação!";
            }

            // Registra o envio do arquivo para Firebase Storage
            let nome_arquivo    = util.fileNameAndExt(payload.filename);
            let filename        = `cto/${nome_arquivo}`;
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
                OnbusMobileCTOSyncService.registrar_atuacao({
                    id_onibus:                      onibus_em_alerta.id_onibus,
                    numero_onibus:                  onibus_em_alerta.numero_onibus,
                    onibus_em_alerta:               alerta,
                    onibus_em_alerta_atuacao:       onibus_em_alerta_atuacao,
                    data_atuacao:                   util.now(),
                    tipo_movimento:                 'OPERACAO_GARAGEM', 
                    submovimento:                   'VIDEO_ATUACAO',
                    arr_movimento:                  [
                        {
                            id_onibus_em_alerta_atuacao:    id_onibus_em_alerta_atuacao,
                            filename:                       filename
                        }
                    ]
                });

            });

        });

    },

    async registrar_checklist(payload){

        let onibus_em_alerta                = payload.onibus_em_alerta;
        let alerta                          = payload.alerta;
        let arr_checklist_patrimonio        = payload.arr_checklist_patrimonio;
        let id_lib_em_alerta_sem_atuacao    = null;
        
        // Monta o indice para que o patrimonio seja vinculado a atuação correta
        let id_onibus_em_alerta         = alerta.id_onibus_em_alerta;
        let idx_alerta                  = `arr_alerta.${id_onibus_em_alerta}`;

        // Define o ID de Sem Atuação, com base no tipo de checklist realizado
        switch(payload.tipo){
            case "equipamento-furtado": id_lib_em_alerta_sem_atuacao    = 2; break;
            case "carro-vendido": id_lib_em_alerta_sem_atuacao          = 5; break; 
        }

        // Documento do onibus_em_alerta que será editado
        let docRef              = firestore().collection('cto-onibus-em-alerta').doc(onibus_em_alerta.numero_onibus);

        await docRef.get({source: 'default'}).then( async (docResp) => {

            if (!docResp){
                throw "Carro não localizado para atuação!";
            }

            //Registra a atuação
            docRef.update({
                [`${idx_alerta}.metadata`]: { 
                    checklist_patrimonio:       true, 
                    data_atuacao:               util.now()
                }
            });

            // Sincroniza a atuação com a CGO
            OnbusMobileCTOSyncService.registrar_atuacao({
                id_onibus:                      onibus_em_alerta.id_onibus,
                numero_onibus:                  onibus_em_alerta.numero_onibus,
                onibus_em_alerta:               onibus_em_alerta,
                tipo_movimento:                 'OPERACAO_GARAGEM',
                submovimento:                   'CHECKLIST_PATRIMONIO',
                arr_movimento:                  [
                    {
                        id_lib_em_alerta_sem_atuacao:   id_lib_em_alerta_sem_atuacao,
                        arr_checklist:                  arr_checklist_patrimonio,
                        data_atuacao:                   util.now(),
                    }
                ]
            }); 

        });

    },

    async confirmar_carro_nao_encontrado(payload){

        let onibus_em_alerta            = payload.onibus_em_alerta; 

        // Monta o indice para que o patrimonio seja vinculado a atuação correta
        let id_onibus_em_alerta         = alerta.id_onibus_em_alerta;
        let idx_alerta                 = `arr_alerta.${id_onibus_em_alerta}`;

        // Documento do onibus_em_alerta que será editado
        let docRef              = firestore().collection('cto-onibus-em-alerta').doc(onibus_em_alerta.numero_onibus);

        await docRef.get({source: 'default'}).then( async (docResp) => {

            if (!docResp){
                throw "Carro não localizado para atuação!";
            }

            //Registra a atuação
            docRef.update({
                [`${idx_alerta}.metadata`]: {
                    carro_nao_encontrado:       true,
                    data_atuacao:               util.now()
                }
            });

            // Sincroniza a atuação com a CGO
            OnbusMobileCTOSyncService.registrar_atuacao({
                id_onibus:                      onibus_em_alerta.id_onibus,
                numero_onibus:                  onibus_em_alerta.numero_onibus,
                onibus_em_alerta:               onibus_em_alerta, 
                data_atuacao:                   util.now(),
                tipo_movimento:                 'OPERACAO_GARAGEM',
                submovimento:                   'CARRO_NAO_ENCONTRADO',
                arr_movimento:                  [
                    {
                        id_lib_em_alerta_sem_atuacao:   3,
                        data_atuacao:                   util.now(),
                    }
                ]
            });

        });

    },


    async registrar_resolvido_sem_atuacao(payload){

        let onibus_em_alerta            = payload.onibus_em_alerta;
        let alerta                      = payload.alerta;
        let filename                    = payload.filename;

        // Monta o indice para que o patrimonio seja vinculado a atuação correta
        let id_onibus_em_alerta         = alerta.id_onibus_em_alerta;

        // Documento do onibus_em_alerta que será editado
        let idx_alerta = `arr_alerta.${id_onibus_em_alerta}`;
        let docRef      = firestore().collection('cto-onibus-em-alerta').doc(onibus_em_alerta.numero_onibus);

        await docRef.get({source: 'default'}).then( async (docResp) => {

            if (!docResp){
                throw "Carro não localizado para atuação!";
            }

            // Registra o envio do arquivo para Firebase Storage
            let nome_arquivo    = util.fileNameAndExt(payload.filename);
            let filename        = `cto/${nome_arquivo}`;
            const ref           = firebaseStorage().ref(filename);
    
            // Realiza o upload do arquivo para o Firebase Storage
            let task = ref.putFile(payload.filename).then((res) => {

                console.log("::: ARQUIVO REGISTRADO COM SUCESSO! :::");

                    //Registra a atuação
                    docRef.update({
                        [`${idx_alerta}.metadata`]: {
                            resolvido_sem_atuacao:      false,
                            data_atuacao:               util.now()
                        }
                    });

            });

            task.then(() => {

                // Sincroniza a atuação com a CGO
                OnbusMobileCTOSyncService.registrar_atuacao({
                    id_onibus:                      onibus_em_alerta.id_onibus,
                    numero_onibus:                  onibus_em_alerta.numero_onibus,
                    onibus_em_alerta:               alerta,
                    data_atuacao:                   util.now(),
                    tipo_movimento:                 'OPERACAO_GARAGEM', 
                    submovimento:                   'RESOLVIDO_SEM_ATUACAO',
                    arr_movimento:                  [
                        {
                            id_lib_em_alerta_sem_atuacao:   1, // Resolvido sem atuação
                            data_atuacao:                   util.now(),
                            filename:                       filename
                        }
                    ]
                });

            });

        });

    },

    async concluir_atuacao(payload){

        let onibus_em_alerta            = payload.onibus_em_alerta;
        let alerta                      = payload.alerta;

        // Monta o indice para que o patrimonio seja vinculado a atuação correta
        let id_onibus_em_alerta         = alerta.id_onibus_em_alerta;
        let idx_alerta                 = `arr_alerta.${id_onibus_em_alerta}`;

        // Documento do onibus_em_alerta que será editado
        let docRef      = firestore().collection('cto-onibus-em-alerta').doc(onibus_em_alerta.numero_onibus);

        await docRef.get({source: 'default'}).then( async (docResp) => {

            if (!docResp){
                throw "Carro não localizado para atuação!";
            }

            //Registra a atuação
            docRef.update({
                [`${idx_alerta}.metadata`]: {
                    concluir_atuacao: true,
                    data_atuacao:     util.now()
                }
            });
            
            // Sincroniza a atuação com a CGO
            OnbusMobileCTOSyncService.registrar_atuacao({
                id_onibus:                      onibus_em_alerta.id_onibus,
                numero_onibus:                  onibus_em_alerta.numero_onibus,
                onibus_em_alerta:               alerta,
                data_atuacao:                   util.now(),
                tipo_movimento:                 'OPERACAO_GARAGEM', 
                submovimento:                   'CONCLUIR_ALERTA',
                arr_movimento:                  [
                    {
                        data_atuacao:                   util.now(),
                    }
                ]
            });
            
        });

    },


    async verificar_adicionar_atuacao(payload){
        
        return new Promise((resolve, reject) => {

            let onibus_em_alerta            = payload.onibus_em_alerta;
            let alerta                      = payload.alerta;
            let onibus_em_alerta_atuacao    = payload.onibus_em_alerta_atuacao;
            
            if (onibus_em_alerta_atuacao.id_onibus_em_alerta_atuacao){
                resolve(onibus_em_alerta_atuacao.id_onibus_em_alerta_atuacao);
            } else {

                let arr_atuacao                 = (onibus_em_alerta['arr_alerta'][alerta.id_onibus_em_alerta]['arr_atuacao'] !== undefined) ? onibus_em_alerta['arr_alerta'][alerta.id_onibus_em_alerta]['arr_atuacao'] : {};
                let docRef                      = firestore().collection('cto-onibus-em-alerta').doc(onibus_em_alerta.numero_onibus);
                let idx_atuacao                 = `add-idx-${util.get_unix()}`;
    
                // Registra a nova atuação
                arr_atuacao[`${idx_atuacao}`] = {
                    "id_onibus_em_alerta_atuacao"       : idx_atuacao,
                    "id_lib_em_alerta_atuacao"          : onibus_em_alerta_atuacao.id_lib_em_alerta_atuacao,
                    "id_lib_em_alerta_atuacao_status"   : 1,
                    "atuacao"                           : onibus_em_alerta_atuacao.atuacao,
                    "descricao"                         : onibus_em_alerta_atuacao.descricao,
                    "has_foto"                          : onibus_em_alerta_atuacao.has_foto,
                    "has_modem"                         : onibus_em_alerta_atuacao.has_modem,
                    "has_observacao"                    : onibus_em_alerta_atuacao.has_observacao,
                    "has_player"                        : onibus_em_alerta_atuacao.has_player,
                    "has_roteador"                      : onibus_em_alerta_atuacao.has_roteador,
                    "has_tela"                          : onibus_em_alerta_atuacao.has_tela,
                    "has_troca_equipamento"             : onibus_em_alerta_atuacao.has_troca_equipamento,
                    "has_video"                         : onibus_em_alerta_atuacao.has_video,
                    "status"                            : "Pendente" ,
                }
    
                docRef.update({[`arr_alerta.${alerta.id_onibus_em_alerta}.arr_atuacao`]: arr_atuacao});
                resolve(idx_atuacao);
            }
        });
        
    },
    
    async listar_onibus(params){
        return new Promise((resolve,reject) => {
            let arr_temp = [];
            let arr_onibus_alerta = store.getState().onibus_em_alerta.data;
            let count = 0;

            arr_onibus_alerta.forEach((doc) => {
                if(doc.id_garagem == params.id_garagem){
                    arr_temp.push(doc);
                }
            })

            if(!arr_onibus_alerta){
                reject();
            }

            resolve(arr_temp);

        })
    },

    async calcular_onibus_alerta(){
        let user_auth = store.getState().app.user_auth;
        let _total_garagem_a_fazer = 0;

        await onbusMobileCTOCollection.get().then(snapshot => {
            
            snapshot.forEach(doc => {
                
                util.obj_to_array(doc.data().arr_alerta).map((elm) => {
                    if(elm.id_funcionario == user_auth.id){
                        _total_garagem_a_fazer++
                    }
                })
            })


        });
        
        store.dispatch(updateCTOStatus({
            total_garagem_a_fazer: _total_garagem_a_fazer
        }))
        
    }
 


}
