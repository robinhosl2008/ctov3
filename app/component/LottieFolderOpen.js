import React from 'react';
import { Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

function LottieFolderOpen(props) {
    return (
        <View style={{ alignItems: "center", justifyContent: "center"}}>
            <LottieView
                autoPlay
                loop={false}  
                style={{
                    width: 80,
                    height: 80,
                }}
                source={require('./../assets/lottie/folder-open.json')} 
            />
        </View>
    );
}

export default LottieFolderOpen;