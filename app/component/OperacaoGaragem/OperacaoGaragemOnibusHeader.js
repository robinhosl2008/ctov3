import React from 'react'
import { View, Text } from 'react-native'
import Fontisto from 'react-native-vector-icons/Fontisto';

export default function OperacaoGaragemOnibusHeader(props) {

    let onibus_em_alerta    = props.onibus_em_alerta;
    let alerta              = props.alerta;
    let patrimonio          = props.patrimonio;

    return (
        <View style={[{marginBottom: 10}, props.style]}>
        <View style={{flexDirection: 'row', marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderColor: 'lightgray'}}>
            <Fontisto name="bus" color="black" style={{alignSelf: 'center', marginEnd: 10}} size={48} />
            <View>
                <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 5}}>{onibus_em_alerta.numero_onibus}</Text>
                <Text>{onibus_em_alerta.garagem}</Text>
            </View>
        </View>
        {/* <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>Alerta:</Text>
            <Text style={{fontSize: 16}}>Vamos ver...</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>Atuação:</Text>
            <Text>Vamos ver...</Text>
        </View> */}
        </View>
    )
}
