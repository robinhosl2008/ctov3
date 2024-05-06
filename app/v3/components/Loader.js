import React from 'react';
import { View,Text,TouchableOpacity, StyleSheet} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default function Loader(){

    return(
        <View style={styles.loader}>
            <ActivityIndicator animating={true} size="large" color="darkorange" />
        </View>
    )
}


const styles = StyleSheet.create({
    loader:{
        display:'flex',
        width:'100%',
        height:'50%',
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
    }
});