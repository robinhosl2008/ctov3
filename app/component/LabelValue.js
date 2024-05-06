import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CardStat from './CardStat';
import Title from './Title';

function LabelValue(props) {
    return (
        <View style={style.container}>
            <Text style={style.column}>{props.label}:</Text>
            <Text style={style.value}>{props.value}</Text>
        </View> 
    );
}

const style = StyleSheet.create({
    container: {
        flexDirection: "row", 
        paddingVertical: 2
    },
    column: {
        fontWeight: 'bold',
        fontSize: 18,
        marginEnd: 5
    },
    value: {
        fontSize: 18,
    }
});

export default LabelValue;