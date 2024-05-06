import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

function LottieCalendarioHistorico(props) {

    return (
        <View style={{ alignItems: "center", justifyContent: "center"}}>
            <LottieView
                autoPlay={true}
                duration={2000}
                loop={false}
                style={{
                    height: 120,
                }}
                source={require('../assets/lottie/alerta.json')} 
            />
        </View>
    );
}

export default LottieCalendarioHistorico;