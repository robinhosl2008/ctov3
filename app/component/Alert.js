import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function Alert(props) {
    return (
        <View style={style.container}>
            <Text style={style.title}>{(props.title !== undefined) ? props.title : 'Atenção'}</Text>
            <Text style={style.content}>{props.children}</Text>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'whitesmoke',
        borderColor: 'lightgray'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    content: {
        fontSize: 16,
        lineHeight: 25
    }
});