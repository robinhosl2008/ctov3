import React from 'react';
import { Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

function LottieAttentionCircle(props) {
    return (
        <View style={{flex: 0.17, alignItems: "center", justifyContent: "center"}}>
            <LottieView
                autoPlay 
                loop
                style={{
                    flex: 1,
                    width: 35,
                    height: 35,
                    alignSelf: "center"
                }}
                source={require('./../assets/lottie/circle-attention.json')} 
            />
            <Text style={{position: "absolute", color: "white", fontSize: 20}}>{props.children}</Text>
        </View>
    );
}

export default LottieAttentionCircle;