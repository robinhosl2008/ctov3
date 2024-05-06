import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Fontisto from 'react-native-vector-icons/Fontisto';
import AppBadge from './../../component/AppBadge';
import AppIcon from './../../component/AppIcon';

export default function OperacaoGaragemRightBusInfo(props) {
    return (
        <View style={style.container}>
            <View style={style.container_titulo}>
                <AppIcon lib="Fontisto" icon="bus" size={25} style={{marginEnd: 5}}></AppIcon>
                <Text style={style.titulo}>{props.numero_onibus}</Text>
            </View>
            <Text style={style.subtitulo}>{(props.alerta) ? props.alerta : props.onibus_em_alerta.garagem}</Text>
            <View style={style.container_atuacoes_status}>
                {
                    (props.total_atuacoes_feitas !== undefined && props.total_atuacoes !== undefined) ?
                    (
                        <>
                            <Text style={{fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 10, marginEnd: 10}}>Atuações:</Text> 
                            <AppBadge style={{backgroundColor: (props.atuacoes_concluidas) ? '#00bd0b' : 'black'}}>{props.total_atuacoes_feitas} / {props.total_atuacoes}</AppBadge>
                        </>
                    )
                    :
                    (<></>)
                }
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        alignItems: 'flex-end'
    },
    container_titulo: {
        flexDirection: 'row',
        marginBottom: 5
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    subtitulo: {
        fontSize: 16,
        textAlign: 'right'
    },
    container_atuacoes_status: {
        flexDirection: 'row'
    }
});
