import React from 'react';
import { Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

function LottiePulseButton(props) {
    return (
        <View style={{alignItems: "center", justifyContent: "center"}}>
            <LottieView
                autoPlay 
                loop
                speed={2.5}
                style={[{
                    flex: 1,
                    width: 28,
                    height: 28,
                    alignSelf: "center"
                }, props.style]}
                source={require('../assets/lottie/pulse-button.json')} 
            />
        </View>
    );
}

export default LottiePulseButton;