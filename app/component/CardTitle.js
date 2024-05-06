import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function CardTitle(props) {
    return (
        <View style={[style.container, props.style]}>
            <Text style={style.title}>{props.title}</Text>
            {
                (props.subTitle) ? (
                    <Text style={style.subTitle}>{props.subTitle}</Text>
                ) : (
                    <></>
                )
            }
            {props.children}
        </View>
    );
}

const style = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        width: '100%'
    },
    title:{ 
        marginBottom: 10, 
        fontWeight: 'bold', 
        fontSize: 15
    },
    subTitle:{
        paddingBottom:15
    }
});

export default CardTitle;