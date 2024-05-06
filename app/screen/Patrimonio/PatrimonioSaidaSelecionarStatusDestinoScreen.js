import React from 'react';
import Screen from '../../component/Screen';
import CardTitle from '../../component/CardTitle';
import { ScrollView } from 'react-native-gesture-handler';
import PatrimonioSaidaListaStatusDestino from '../../component/PatrimonioSaida/PatrimonioSaidaListaStatusDestino'; 
import PatrimonioSaidaHeader from './../../component/PatrimonioSaida/PatrimonioSaidaHeader';
import { Text, View } from 'react-native';

function PatrimonioSaidaSelecionarStatusDestinoScreen(props) {
    return (
        <Screen>
            <View>
                <Text style={{fontSize: 18, marginBottom: 20}}>Selecione o status de Destino:</Text>
            </View>
            <ScrollView>
                <PatrimonioSaidaListaStatusDestino></PatrimonioSaidaListaStatusDestino>
            </ScrollView>
        </Screen>
    );
}

export default PatrimonioSaidaSelecionarStatusDestinoScreen;