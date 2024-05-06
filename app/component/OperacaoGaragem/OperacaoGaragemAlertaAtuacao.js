import React, { useEffect, useState }             from 'react';
import { View, Text, StyleSheet, PermissionsAndroid }       from 'react-native';
import { useRoute }                     from '@react-navigation/native';
import { connect }                      from 'react-redux';
import util                             from './../../util/util';
import { Badge, List, Modal, Portal, Button, Provider }                  from 'react-native-paper';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Entypo                           from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons           from 'react-native-vector-icons/MaterialCommunityIcons';
import Title                            from './../../component/Title';
import { useNavigation }                from '@react-navigation/native';
import store                            from './../../state/store';
import ServiceMedia                     from '../../service/MediaService';
import {launchCamera}                   from 'react-native-image-picker';
import OperacaoGaragemService           from './../../service/OperacaoGaragemService';

import { clearFilterParamPatrimonioRecebido, filterParamPatrimonioRecebido }   from './../../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import OperacaoGaragemOnibusEquipamento from './OperacaoGaragemOnibusEquipamento';
import CardTitle from '../CardTitle';
import OperacaoGaragemSemAtuacao from './OperacaoGaragemSemAtuacao';
import AppButton from '../AppButton';

function OperacaoGaragemAlertaAtuacao(props) {
    
    const {params}                                  = useRoute()
    const navigation                                = useNavigation();
    let id_onibus                                   = params.params.id_onibus;
    let id_onibus_em_alerta                         = params.params.id_onibus_em_alerta;
    const [modalSemAtuacao, setModalSemAtuacao]     = useState(false);
    const [onibusSemAtauacao, setOnibusSemAtuacao]  = useState(null);

    // Obtém apenas os dados do Ônibus em Alerta
    let onibus_em_alerta    = props.state.onibus_em_alerta.data
    .filter((item, key) => {
        if (item.id_onibus == id_onibus){
            return item;
        }
    })[0];

    function selecionar_onibus_sem_atuacao(){
        navigation.navigate('OperacaoGaragemSemAtuacaoScreen', {
            screen: 'OperacaoGaragemSemAtuacaoScreen',
            params: { 
                onibus_em_alerta: onibus_em_alerta,
                popCount: 2,
            },
        });
    }

    // Obtém apenas os dados do Alerta selecionado anteriormente
    let alerta          = onibus_em_alerta['arr_alerta'][id_onibus_em_alerta];
    let arr_atuacao     = (alerta['arr_atuacao'] !== undefined) ? util.obj_to_array(alerta['arr_atuacao']).sort(util.order_by("atuacao")) : [];
    let arr_equipamento = (onibus_em_alerta.arr_equipamento !== undefined) ? onibus_em_alerta.arr_equipamento : [];

    async function selecionar_atuacao(item_atuacao){
        
        // Variáveis de controle
        let acao_patrimonio         = null;
        let hasPhoto                = false;
        let hasVideo                = false;
        
        // 1. Limpa qualquer parametro de filtro utilizado anteriormente
        store.dispatch(clearFilterParamPatrimonioRecebido());

        // 2. Listar apenas Patrimonio que esteja com status 15 - Backup Garagem
        store.dispatch(filterParamPatrimonioRecebido({id_equipamento_status: 15}));

        // 3. Filtra apenas Patrimonio do tipo que deve ser associado, conforme a atuação
        if (item_atuacao.has_player == '1'){

            // Filtro para exibir apenas PLAYER na página de Associar/Desasssociar/Substituir
            store.dispatch(filterParamPatrimonioRecebido({id_lib_equipamento_tipo: 1}));

        } else if (item_atuacao.has_modem == '1') {

            // Filtro para exibir apenas MODEM na página de Associar/Desasssociar/Substituir
            store.dispatch(filterParamPatrimonioRecebido({id_lib_equipamento_tipo: 2}));

        } else if (item_atuacao.has_tela == '1') {

            // Filtro para exibir apenas TELA na página de Associar/Desasssociar/Substituir
            store.dispatch(filterParamPatrimonioRecebido({id_lib_equipamento_tipo: 3}));

        } else if (item_atuacao.has_roteador == '1') {

            // Filtro para exibir apenas ROTEADOR na página de Associar/Desasssociar/Substituir
            store.dispatch(filterParamPatrimonioRecebido({id_lib_equipamento_tipo: 4})); 
            
        } else if (item_atuacao.has_foto == '1'){
            hasPhoto = true;
        } else if (item_atuacao.has_video == '1'){
            hasVideo = true;
        }

        console.info("::: ITEM DE ATUAÇÃO :::");
        console.info("::: ITEM DE ATUAÇÃO :::");
        console.info("::: ITEM DE ATUAÇÃO :::");
        console.info("::: ITEM DE ATUAÇÃO :::");
        console.info("::: ITEM DE ATUAÇÃO :::");
        console.info("::: ITEM DE ATUAÇÃO :::");
        console.info("::: ITEM DE ATUAÇÃO :::");
        console.info("::: ITEM DE ATUAÇÃO :::");
        console.info("::: ITEM DE ATUAÇÃO :::");
        console.info(item_atuacao);

        // 4. Caso seja ação envolvendo patrimônio, verificar o que deve ser realizado (Associar, Desassociar ou Substituir)
        if (item_atuacao.has_player == '1' || item_atuacao.has_modem == '1' || item_atuacao.has_tela == '1' || item_atuacao.has_roteador == '1'){
            if (item_atuacao.has_associar == '1'){
                acao_patrimonio = 'ASSOCIAR';
            } else if (item_atuacao.has_desassociar == '1'){
                acao_patrimonio = 'DESASSOCIAR';
            } else if (item_atuacao.has_troca_equipamento == '1'){
                acao_patrimonio = 'SUBSTITUIR';
            }
        } 
        
        if (acao_patrimonio == 'ASSOCIAR'){
            navigation.navigate('OperacaoGaragemAssociarPatrimonioScreen', {
                screen: 'OperacaoGaragemAssociarPatrimonioScreen',
                params: { 
                    onibus_em_alerta:           onibus_em_alerta,
                    alerta:                     alerta, 
                    onibus_em_alerta_atuacao:   item_atuacao 
                },
            });    
        } else if (acao_patrimonio == 'DESASSOCIAR'){
            navigation.navigate('OperacaoGaragemRetirarPatrimonioScreen', {
                screen: 'OperacaoGaragemRetirarPatrimonioScreen',
                params: { 
                    onibus_em_alerta:           onibus_em_alerta,
                    alerta:                     alerta, 
                    onibus_em_alerta_atuacao:   item_atuacao,
                    has_substituir:             false // Indica que haverá apenas desassociação de patrimônio
                },
            });
        } else if (acao_patrimonio == 'SUBSTITUIR'){
            navigation.navigate('OperacaoGaragemRetirarPatrimonioScreen', {
                screen: 'OperacaoGaragemRetirarPatrimonioScreen',
                params: { 
                    onibus_em_alerta:           onibus_em_alerta,
                    alerta:                     alerta, 
                    onibus_em_alerta_atuacao:   item_atuacao,
                    has_substituir:             true // Indica que haverá substituição de patrimônio
                },
            });
        } else if(hasPhoto){

            await ServiceMedia.take_photo({
                nome_arquivo:               onibus_em_alerta.numero_onibus, 
                onibus_em_alerta:           onibus_em_alerta,
                alerta:                     alerta, 
                onibus_em_alerta_atuacao:   item_atuacao 
            }).then((filename) => {

                navigation.navigate('LoadingSuccessScreen', {
                    screen: 'LoadingSuccessScreen',
                    params: { 
                        popCount: 1,
                    },
                });

                // Registra a atuação
                OperacaoGaragemService.registrar_foto_atuacao({
                    onibus_em_alerta:           onibus_em_alerta,
                    alerta:                     alerta, 
                    onibus_em_alerta_atuacao:   item_atuacao,
                    filename:                   filename
                });

            }).catch((error) => {
                // NOTIFICATION-ERROR AQUI!!!
                // NOTIFICATION-ERROR AQUI!!!
                // NOTIFICATION-ERROR AQUI!!!
            });

        } else if(hasVideo) {

            await ServiceMedia.take_video().then(async (filename) => {
                await OperacaoGaragemService.registrar_video_atuacao({
                    onibus_em_alerta:           onibus_em_alerta,
                    alerta:                     alerta, 
                    onibus_em_alerta_atuacao:   item_atuacao,
                    filename:                   filename
                });
            }).catch((error) => {
                console.error("::: VÍDEO NÃO GRAVADO :::");
                console.info(error);
            });

        }
    }

    function adicionar_atuacao(){
        navigation.navigate('OperacaoGaragemAdicionarAtuacaoScreen', {
            screen: 'OperacaoGaragemAdicionarAtuacaoScreen',
            params: { 
                onibus_em_alerta:           onibus_em_alerta,
                alerta:                     alerta
            },
        });
    }

    // Função que verifica se ainda há atuação para ser realizada
    function hasAtuacao(){
        let arr_atuacao_pendente = arr_atuacao.filter((item) => {
            if (item['metadata'] === undefined && ( item['id_lib_em_alerta_atuacao_status'] == 1 || item['id_lib_em_alerta_atuacao_status'] == 3 )){
                return item;
            }
        });
        
        return (arr_atuacao_pendente.length > 0) ? true : false;
    }

    async function concluir_atuacao(){
        await OperacaoGaragemService.concluir_atuacao({
            onibus_em_alerta:           onibus_em_alerta,
            alerta:                     alerta
        });
        navigation.navigate('LoadingSuccessScreen', {
            screen: 'LoadingSuccessScreen',
            params: { 
                popCount: 2,
            },
        });
    }

    function render_item_atuacao(item_atuacao){

        // Se o status da atuação for igual a 1 (A fazer) ou 3 (Rejeitado) e não houver metadata
        // O usuário ainda precisa reazlizar a atuação
        let hasDone = false;

        if ((item_atuacao.id_lib_em_alerta_atuacao_status !== 1 && item_atuacao.id_lib_em_alerta_atuacao_status !== 3) || item_atuacao['metadata'] !== undefined){
            if (item_atuacao.has_troca_equipamento == '0'){
                hasDone = true;
            }
        }

        return (
            <TouchableOpacity disabled={hasDone} key={item_atuacao.id_onibus_em_alerta_atuacao} onPress={() => { selecionar_atuacao(item_atuacao) }}>
                <List.Item
                    title={item_atuacao.atuacao}
                    description={item_atuacao.descricao}
                    style={[style.listItem]}
                    titleStyle={[(hasDone) ? {color: 'darkgray'} : {color: 'black'}]}
                    left={props => <MaterialCommunityIcons name={(hasDone) ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} color={(hasDone) ? "darkgray" : "black"} style={{alignSelf: 'center'}} size={20} />}
                    right={props => <Entypo name="chevron-small-right" color={(hasDone) ? "darkgray" : "black"} style={{alignSelf: 'center'}} size={20} />}
                />                                
            </TouchableOpacity>  
        )
    }

    return (
        <>
        <View style={{padding: 10}}>
            <View style={style.container_header}>
                <View style={style.onibus_info}>
                    <Text style={{color: 'gray', fontWeight: 'bold'}}>CARRO EM ATUAÇÃO</Text>
                    <Text style={{fontSize: 30, fontWeight: 'bold', marginTop: 10, marginBottom: 5}}>{onibus_em_alerta.numero_onibus}</Text>
                    <Text style={{color: 'gray'}}>{onibus_em_alerta.garagem}</Text>
                    <View style={style.header_status}>
                        { onibus_em_alerta.has_alerta ? (
                        <>
                            <Badge style={[style.badge_status]}>EM ALERTA</Badge>
                            <Text style={{paddingHorizontal: 5}}>|</Text>
                            <Text style={{fontSize: 12, fontWeight: 'bold'}}>{(onibus_em_alerta.em_alerta_at) ? util.diff_in_days(onibus_em_alerta.em_alerta_at) + " dia(s)" : "Tempo Indefinido"}</Text>
                        </>
                        ) : (
                        <>
                            <Text>...</Text>
                        </>) }
                    </View>
                </View>
                <View style={style.container_alerta_info}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>{alerta.alerta}</Text>
                    <Text style={{fontSize: 15, marginVertical: 5}}>{alerta.observacao}</Text>
                </View>
            </View>
            
            <View style={{marginTop: 20}}>
                <OperacaoGaragemOnibusEquipamento arr_equipamento={arr_equipamento}></OperacaoGaragemOnibusEquipamento>
            </View>

            <CardTitle title="Selecione a atuação a ser realizada:" style={{marginTop: 20, marginBottom: 20}}>
                {
                    alerta.has_facultativo == '1' && (
                        <Button onPress={() => {adicionar_atuacao()}} icon="plus" mode="outlined" color="white" style={{marginVertical: 10, padding: 5, backgroundColor: 'limegreen'}}>Adicionar Atuação</Button>
                    )
                }
                {
                    arr_atuacao.map((item_atuacao) => {
                        return render_item_atuacao(item_atuacao)
                    })
                }
            </CardTitle>
            <CardTitle title="Finalizar atuação" style={{marginBottom: 20}}>
                <View>
                    {
                        (!hasAtuacao()) ? <AppButton style={{marginTop: 10}} onPress={() => { concluir_atuacao(); }}>Concluir Atuação</AppButton> : <></>
                    }
                    <AppButton style={{marginVertical: 20, backgroundColor: 'black'}} onPress={() => { selecionar_onibus_sem_atuacao() }}>Registrar Sem Atuação</AppButton>
                </View>
            </CardTitle>
        </View>
        <Provider>
            <Portal>
                <Modal visible={modalSemAtuacao} onDismiss={() => { setModalSemAtuacao(false) }} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 5}}>
                    <OperacaoGaragemSemAtuacao onibus_em_alerta={onibusSemAtauacao} setModalSemAtuacao={setModalSemAtuacao} />
                </Modal>
            </Portal>
        </Provider>
        </>
    )
}

const style = StyleSheet.create({
    container_header:{
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 10,
    },
    onibus_info: {
        alignItems: 'center',
        backgroundColor: '#fafafa',
        width: '100%',
        padding: 10,
        borderRadius: 10,
    },
    header_status: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    badge_status: {
        borderRadius: 5,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        backgroundColor: 'orangered',
        color: 'white'
    },
    container_alerta_info: {
        width: "100%", 
        alignItems: 'center',
        paddingVertical: 15,
        borderTopWidth: 0.2
    },
    listItem: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 5
    }
});

export default connect(function mapStateToProps(state){ return {state} })(OperacaoGaragemAlertaAtuacao);
