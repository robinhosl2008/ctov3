import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import store from './../state/store';
import { appModalLoading } from './../state/App/AppAction';

function LottieLoadingSuccess(props) {
    return (
        <View style={{ alignItems: "center", justifyContent: "center"}}>
            <LottieView
                autoPlay
                loop={false}  
                style={{
                    width: 320,
                    height: 320,
                }}
                source={require('./../assets/lottie/loading-success.json')}
                onAnimationFinish={() => { store.dispatch(appModalLoading({modal_loading:{ visible: false }})) }}
            />
        </View>
    );
}

export default LottieLoadingSuccess;