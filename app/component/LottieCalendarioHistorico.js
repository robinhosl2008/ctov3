import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

function LottieCalendarioHistorico(props) {

    let animation;
    useEffect(() => {
        animation.play(0,85);
    }, [animation])

    return (
        <View style={{ alignItems: "center", justifyContent: "center"}}>
            <LottieView
                ref={ref_animation => { animation = ref_animation; }}
                loop={false}
                style={{
                    height: 120,
                }}
                source={require('../assets/lottie/calendario-historico.json')} 
            />
        </View>
    );
}

export default LottieCalendarioHistorico;