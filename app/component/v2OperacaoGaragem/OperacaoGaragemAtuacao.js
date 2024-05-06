import React, { useEffect, useState }             from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import AppIcon from '../AppIcon';
import ServiceMedia                     from '../../service/MediaService';
import OperacaoGaragemService           from './../../service/OperacaoGaragemService';
import store                            from './../../state/store';
import { clearFilterParamPatrimonioRecebido, filterParamPatrimonioRecebido }   from './../../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import { useNavigation }                from '@react-navigation/native';
import { Badge } from 'react-native-paper';

function OperacaoGaragemAlertaAtuacao(props) {

    const navigation        = useNavigation();
    let onibus_em_alerta    = props.onibus_em_alerta;
    let alerta              = props.alerta;
    let item_atuacao        = props.item_atuacao;

    async function selecionar_atuacao(item_atuacao){
        
        // Variáveis de controle
        let acao_patrimonio         = null;
        let hasPhoto                = false;
        let hasVideo                = false;
        let id_lib_equipamento_tipo = null;
        
        // 1. Limpa qualquer parametro de filtro utilizado anteriormente
        store.dispatch(clearFilterParamPatrimonioRecebido());

        // 2. Listar apenas Patrimonio que esteja com status 15 - Backup Garagem
        store.dispatch(filterParamPatrimonioRecebido({id_equipamento_status: 15}));

        // 3. Filtra apenas Patrimonio do tipo que deve ser associado, conforme a atuação
        if (item_atuacao.has_player == '1'){

            // Filtro para exibir apenas PLAYER na página de Associar/Desasssociar/Substituir
            id_lib_equipamento_tipo = 1;
            store.dispatch(filterParamPatrimonioRecebido({id_lib_equipamento_tipo: 1}));

        } else if (item_atuacao.has_modem == '1') {

            // Filtro para exibir apenas MODEM na página de Associar/Desasssociar/Substituir
            id_lib_equipamento_tipo = 2;
            store.dispatch(filterParamPatrimonioRecebido({id_lib_equipamento_tipo: 2}));

        } else if (item_atuacao.has_tela == '1') {

            // Filtro para exibir apenas TELA na página de Associar/Desasssociar/Substituir
            id_lib_equipamento_tipo = 3;
            store.dispatch(filterParamPatrimonioRecebido({id_lib_equipamento_tipo: 3}));

        } else if (item_atuacao.has_roteador == '1') {

            // Filtro para exibir apenas ROTEADOR na página de Associar/Desasssociar/Substituir
            id_lib_equipamento_tipo = 4;
            store.dispatch(filterParamPatrimonioRecebido({id_lib_equipamento_tipo: 4})); 
            
        } else if (item_atuacao.has_foto == '1'){
            hasPhoto = true;
        } else if (item_atuacao.has_video == '1'){
            hasVideo = true;
        }

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

            console.info("::: VAMOS ASSOCIAR PATRIMOMIO :::");
            console.info("::: VAMOS ASSOCIAR PATRIMOMIO :::");
            console.info("::: VAMOS ASSOCIAR PATRIMOMIO :::");

            navigation.navigate('OperacaoGaragemAssociarPatrimonioScreen', {
                screen: 'OperacaoGaragemAssociarPatrimonioScreen',
                params: { 
                    onibus_em_alerta:           onibus_em_alerta,
                    alerta:                     alerta, 
                    onibus_em_alerta_atuacao:   item_atuacao 
                },
            });    
        } else if (acao_patrimonio == 'DESASSOCIAR'){


            console.info("::: VAMOS DESASSOCIAR PATRIMOMIO :::");
            console.info("::: VAMOS DESASSOCIAR PATRIMOMIO :::");
            console.info("::: VAMOS DESASSOCIAR PATRIMOMIO :::");

            navigation.navigate('OperacaoGaragemRetirarPatrimonioScreen', {
                screen: 'OperacaoGaragemRetirarPatrimonioScreen',
                params: { 
                    onibus_em_alerta:           onibus_em_alerta,
                    alerta:                     alerta, 
                    onibus_em_alerta_atuacao:   item_atuacao,
                    id_lib_equipamento_tipo:    id_lib_equipamento_tipo
                },
            });
        } else if (acao_patrimonio == 'SUBSTITUIR'){

            console.info("::: VAMOS SUBSTITUIR PATRIMOMIO :::");
            console.info("::: VAMOS SUBSTITUIR PATRIMOMIO :::");
            console.info("::: VAMOS SUBSTITUIR PATRIMOMIO :::");

            navigation.navigate('OperacaoGaragemSubstituirPatrimonioScreen', {
                screen: 'OperacaoGaragemSubstituirPatrimonioScreen',
                params: { 
                    onibus_em_alerta:           onibus_em_alerta,
                    alerta:                     alerta, 
                    onibus_em_alerta_atuacao:   item_atuacao,
                    id_lib_equipamento_tipo:    id_lib_equipamento_tipo
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

            await ServiceMedia.take_video({navigation: navigation}).then(async (filename) => {

                navigation.navigate('LoadingSuccessScreen', {
                    screen: 'LoadingSuccessScreen',
                    params: { 
                        popCount: 1,
                    },
                });

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

    return (
        <View style={style.container}>
            <TouchableOpacity onPress={() => selecionar_atuacao(item_atuacao)}>
                <View style={[style.header, (item_atuacao['metadata']) ? {fontWeight: 'bold'} : {}]}>
                    <View style={{flexDirection: 'row'}}>
                        {
                            (item_atuacao['metadata']) ? (
                                <AppIcon lib="FontAwesome" icon="check" style={{marginEnd: 10}} />
                            ) : (<></>)
                        }
                        <View style={{justifyContent:'flex-start', alignSelf:'flex-start'}}>
                            <Text style={style.title}>{props.title}</Text>
                            {props.item_atuacao.has_obrigatorio==1?(<Text style={style.badge_obrigatorio}>OBRIGATORIO</Text>):(<></>)}
                        </View>
                    </View>
                    <Entypo name="chevron-small-right" style={{alignSelf: 'center'}} size={20} />
                </View>
            </TouchableOpacity>
            {/* {
                item_atuacao['metadata'] ? (
                    <View style={style.container_atuacao}>
                        <View style={style.item_atuacao}>
                            <View>
                                <Text style={style.item_atuacao_descricao}>Descrição da Atuação...</Text>
                                <Text style={style.item_atuacao_horario}>16/03/2021 às 13:13</Text>
                            </View>
                            <AppIcon lib="Feather" icon="trash"/>
                        </View>
                    </View>
                ) : (<></>)
            } */}
        </View>
    )

}

const style = StyleSheet.create({
    container: {
        borderWidth: 0.5,
        borderColor: 'lightgray',
        borderRadius: 5,
        marginBottom: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FAFAFA',
        padding: 15,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    title: {
        color: 'black',
        fontSize: 18,
        // fontWeight: 'bold'
    },
    container_atuacao: {
        marginVertical: 5,
        padding: 10
    },
    item_atuacao: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    item_atuacao_descricao: {

    },
    item_atuacao_horario: {

    },
    item_atuacao_excluir: {

    },
    badge_obrigatorio:{
        width:100,
        padding:3,
        backgroundColor:'#000',
        color:'#fff',
        borderRadius:5,
        textAlign:'center',
        fontSize:12,
    },
});

export default OperacaoGaragemAlertaAtuacao;