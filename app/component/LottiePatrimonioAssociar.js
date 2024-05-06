import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

function LottiePatrimonioAssociar(props) {
    return (
        <View style={{ alignItems: "center", justifyContent: "center"}}>
            <LottieView
                autoPlay
                speed={2}
                loop={true}  
                style={{
                    width: 64,
                    height: 64,
                }}
                source={require('./../assets/lottie/patrimonio-associar.json')} 
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

export default LottiePatrimonioAssociar;
