import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Animated, { Extrapolate, interpolate, Value } from 'react-native-reanimated';

function AppBottomSheet(props) {

    const animatedPosition  = React.useRef(new Value(0));
    let arr_snap_points     = (props.arr_snap_points !== undefined) ? props.arr_snap_points : ['8%', '45%', '90%'];

    const opacity = interpolate(animatedPosition.current, {
      inputRange: [0, 0.7],
      outputRange: [0, 0.4],
      extrapolate: Extrapolate.CLAMP,
    }); 

    return (
        <>  
            <Animated.View pointerEvents="box-none"
                style={[
                StyleSheet.absoluteFillObject,
                { backgroundColor: 'black', opacity },
                ]}
            />
            <BottomSheet
                initialSnapIndex={1}
                snapPoints={arr_snap_points}
                animatedIndex={animatedPosition.current}
                onChange={(index) => {}}
            >
                <View style={[props.style, style.container]}> 
                    {props.children}
                </View>
            </BottomSheet>
        </>
    )
}

const style = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'flex-start',
        padding: 10,
        paddingHorizontal: 20
    }
});

export default AppBottomSheet;