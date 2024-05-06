import React from 'react';
import { Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

function LottieBus(props) {
    return (
        <View style={{ alignItems: "center", justifyContent: "center"}}>
            <LottieView
                autoPlay
                loop={true}  
                style={{
                    height: 180,
                }}
                source={require('./../assets/lottie/bus.json')} 
            />
        </View>
    );
}

export default LottieBus;