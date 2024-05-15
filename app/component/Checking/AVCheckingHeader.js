import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import LabelValue from '../LabelValue';
import LottieAttentionCircle from '../LottieAttentionCircle';
import LottieTakePicture from '../LottieTakePicture';
import Entypo from 'react-native-vector-icons/Entypo';
import { List } from 'react-native-paper';
import AppBadge from '../AppBadge';
import { ScrollView } from 'react-native-gesture-handler';

function AVCheckingHeader(props) { 

    let av_checking_calendario = props.av_checking_calendario;
    const [expanded, setExpanded] = React.useState(true);
    const handlePress = () => setExpanded(!expanded);

    return (
        <View style={style.container}>
            <LottieTakePicture />
            <Text style={style.title}>Checking Fotográfico</Text> 
            <View style={{width: '85%', alignItems: 'center'}}>
                <Text style={{fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: "#000000"}}>{`AV ${props.av_checking.id} - ${props.av_checking.nome_campanha}`}</Text>
                <Text style={{fontSize: 14, textAlign: 'center', marginTop:-8, marginBottom:14, color: "#000000"}}>{`${props.av_checking.cliente}`}</Text>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    title: {
        marginBottom: 10,
        fontSize: 24,
        color: "#000000"
    }
});

export default AVCheckingHeader;
