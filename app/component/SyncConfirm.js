import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieQuestion from './LottieQuestion';

function SyncConfirm(props) {
    return (
        <View style={style.container}>
            <LottieQuestion />
            <Text style={style.title}>{props.title}</Text>
        </View>
    );
}

const style = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        alignContent: 'center',
        alignItems: 'center'
    },
    title:{
        fontSize: 20
    }
});

export default SyncConfirm;