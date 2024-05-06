import React from 'react'
import { View, Text, StyleSheet }   from 'react-native'
import { Button } from 'react-native-paper';
import { useNavigation, useRoute }                 from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { useState } from 'react/cjs/react.development';

function VideoProcessingScreen(props) {

    const {params}                              = useRoute();
    const navigation                            = useNavigation();

    return (
        <View style={style.container}>
            <LottieView 
                autoPlay
                loop={true}
                style={{
                    width: 360,
                    height: 360,
                }}
                source={require('../../assets/lottie/video-processing.json')}
            />
            <View style={style.content}>
                <Text style={{fontSize: 20}}>O vídeo está em processamento.</Text>
                <Text style={{fontSize: 20}}>Por favor aguarde...</Text>
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
        alignItems: 'center',
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

export default VideoProcessingScreen;
