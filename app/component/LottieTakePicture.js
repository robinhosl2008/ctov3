import React from 'react';
import { Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

function LottieTakePicture(props) {
    return (
        <View style={[{height: 120, alignItems: "center", justifyContent: "center"}, props.style]}>
            <LottieView
                autoPlay
                loop={false}
                style={{
                    flex: 1,
                    width: 60,
                    height: 60, 
                    alignSelf: "center"
                }}
                source={require('../assets/lottie/take-picture.json')} 
            />
            <Text style={{position: "absolute", color: "white", fontSize: 20}}>{props.children}</Text>
        </View>
    );
}

export default LottieTakePicture;
