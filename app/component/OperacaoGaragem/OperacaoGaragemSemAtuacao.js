import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import { List, Button } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ServiceMedia                     from '../../service/MediaService';
import OperacaoGaragemService from './../../service/OperacaoGaragemService';
import { useNavigation }                        from '@react-navigation/native';
import { useRoute }                             from '@react-navigation/native';
import store                                    from './../../state/store';

export default function OperacaoGaragemSemAtuacao(props) {

    const navigation        = useNavigation();
    let onibus_em_alerta    = props.onibus_em_alerta;
    let id_onibus_em_alerta = props.id_onibus_em_alerta;
    let alerta              = props.alerta; 

    async function resolvido_sem_atuacao(){

        await ServiceMedia.take_video({navigation: navigation}).then(async (filename) => {

            await OperacaoGaragemService.registrar_resolvido_sem_atuacao({
                onibus_em_alerta:           onibus_em_alerta, 
                alerta:                     alerta,
                filename:                   filename 
            });

            navigation.navigate('LoadingSuccessScreen', {
                screen: 'LoadingSuccessScreen',
                params: { 
                    popCount: 3,
                },
            });

        }).catch((error) => {
            console.error("::: VÍDEO NÃO GRAVADO :::");
            console.info(error);
        });

    }

    function gerar_checklist(tipo){

        console.info("ID ONIBUS EM ALERTA", id_onibus_em_alerta);
        console.info("ONIBUS EM ALERTA", onibus_em_alerta);
        console.info("ALERTA", alerta);

        navigation.navigate('OperacaoGaragemCheckListScreen', {
            screen: 'OperacaoGaragemCheckListScreen',
            params: { 
                onibus_em_alerta:   onibus_em_alerta,  
                alerta:             alerta,
                tipo:               tipo
            },
        });
    }

    function carro_nao_encontrado(){
        navigation.navigate('ConfirmarCarroNaoEncontradoScreen', {
            screen: 'ConfirmarCarroNaoEncontradoScreen',
            params: { 
                onibus_em_alerta:   onibus_em_alerta,
                alerta:             alerta
            },
        });
    }

    return (
        <View style={style.container}>
            <Text style={{fontSize: 18, marginVertical: 8, paddingBottom: 20, fontWeight: 'bold'}}>Selecione uma das opções para registro de Sem Atuação:</Text>
            <View style={{marginBottom: 30}}>
                <TouchableOpacity onPress={() => { resolvido_sem_atuacao() }}>
                    <List.Item
                        title="Resolvido sem atuação"
                        description="Envie um vídeo do carro em funcionamento"
                        left={props => <Entypo name="video-camera" color="black" style={{alignSelf: 'center', marginEnd: 10}} size={20} />}
                        right={props => <Entypo name="chevron-small-right" color="black" style={{alignSelf: 'center'}} size={20} />}
                        style={style.item}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { gerar_checklist("equipamento-furtado") }}>
                    <List.Item
                        title="Equipamento Furtado"
                        description="Faça um checklist dos equipamentos presentes no carro"
                        left={props => <Octicons name="checklist" color="black" style={{alignSelf: 'center', marginEnd: 10}} size={20} />}
                        right={props => <Entypo name="chevron-small-right" color="black" style={{alignSelf: 'center'}} size={20} />}
                        style={style.item}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { carro_nao_encontrado() }}>
                    <List.Item
                        title="Carro não encontrado"
                        description="Informar que o carro não foi encontrado no momento da atuação"
                        left={props => <Octicons name="issue-opened" color="black" style={{alignSelf: 'center', marginEnd: 10}} size={20} />}
                        right={props => <Entypo name="chevron-small-right" color="black" style={{alignSelf: 'center'}} size={20} />}
                        style={style.item}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { gerar_checklist("carro-vendido") }}>
                    <List.Item
                        title="Carro Vendido"
                        description="Faça um checklist dos equipamentos presentes no carro"
                        left={props => <Octicons name="checklist" color="black" style={{alignSelf: 'center', marginEnd: 10}} size={20} />}
                        right={props => <Entypo name="chevron-small-right" color="black" style={{alignSelf: 'center'}} size={20} />}
                        style={style.item}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        paddingHorizontal: 20
    },
    item: {
        padding: 5
    }
});