import React from 'react';
import { Text, StyleSheet } from 'react-native';

function Title(props) {
    return (
        <Text style={style.container}>{props.children}</Text>
    );
}

const style = StyleSheet.create({ 
    container:{
        paddingHorizontal: 5,
        paddingBottom: 10,
        fontSize: 20, 
        textAlign: "left", 
        fontWeight: "800"
    },
});

export default Title;