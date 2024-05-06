import React from 'react'
import { View, Text, StyleSheet }   from 'react-native'
import { Button } from 'react-native-paper';
import { useNavigation, useRoute }                 from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useState } from 'react/cjs/react.development';

function LoadingSuccessScreen(props) {

    const {params}                              = useRoute();
    const navigation                            = useNavigation();
    let popCount                                = params.params.popCount;

    return (
        <View style={style.container}>
            <LottieView 
                autoPlay
                loop={false}  
                style={{
                    width: 320,
                    height: 320,
                }}
                source={require('./../../assets/lottie/loading-success.json')}
                onAnimationFinish={() => { navigation.pop(popCount) }}
            />
            <View style={style.content}>
                <Text style={{fontSize: 20}}>Por favor, aguarde...</Text>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    content: {
        flex: 0.8,
        flexDirection: 'row',
        marginVertical: 50,
        paddingHorizontal: 5
    },
    containerButton:{
        flex: 0.4,
        height: 60, 
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%', 
        bottom: 0
    },
    btnStyle: {
        backgroundColor: 'darkorange',
        width: '100%'
    },
    btnContentStyle: {
        height: 50
    },
    btnLabelStyle: {
        color: 'white',
    },
});

export default LoadingSuccessScreen;
