import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Fontisto from 'react-native-vector-icons/Fontisto';
import AppIcon from '../AppIcon';

export default function OperacaoGaragemAtuacaoBusInfo(props) {
    return (
        <View style={style.container}>
            <View style={style.container_observacao}>
                <AppIcon lib="Octicons" icon="comment-discussion" color="gray" size={30} style={style.observacao_icon} />
                <Text style={style.observacao_text}>{ (props.alerta.observacao) ? props.alerta.observacao : "Sem observação..." }</Text>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {

    },
    container_observacao: {
        flexDirection: 'row',
        padding: 20,
        paddingEnd: 40,
        backgroundColor: '#fcfcfc',
        borderRadius: 5
    },
    observacao_icon: {
        marginEnd: 15
    },
    observacao_text: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        lineHeight: 20
    }
});
