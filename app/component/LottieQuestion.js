import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

function LottieQuestion(props) {
    return (
        <View style={{ alignItems: "center", justifyContent: "center"}}>
            <LottieView
                autoPlay
                loop={false}  
                style={{
                    width: 120,
                    height: 120,
                }}
                source={require('./../assets/lottie/question.json')} 
            />
            <Text style={style.titulo}>{props.titulo}</Text>
            <Text style={style.descricao}>{props.descricao}</Text>
        </View>
    );
}

const style = StyleSheet.create({
    titulo: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    descricao: {
        color: 'gray',
        marginVertical: 10
    }
});

export default LottieQuestion;
