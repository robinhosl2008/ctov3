import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

function LottieEmptyBox(props) {
    return (
        <View style={{ alignItems: "center", justifyContent: "center"}}>
            <LottieView
                autoPlay
                loop={false}  
                style={{
                    opacity: 0.6,
                    width: 240,
                    height: 240,
                }}
                source={require('./../assets/lottie/empty-box.json')} 
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
        color: 'lightgray'
    }
});

export default LottieEmptyBox;