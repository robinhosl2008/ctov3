import React from 'react';
import Screen from '../../component/Screen';
import PatrimonioSaidaListaUsuarioDestino from '../../component/PatrimonioSaida/PatrimonioSaidaListaUsuarioDestino';
import CardTitle from '../../component/CardTitle';
import { ScrollView } from 'react-native-gesture-handler';
import PatrimonioSaidaHeader from './../../component/PatrimonioSaida/PatrimonioSaidaHeader';
import { Text, View } from 'react-native';

function PatrimonioSaidaListaDestinatarioScreen(props) {
    return (
        <Screen>
            <View>
                <Text style={{fontSize: 18, marginBottom: 20}}>Selecione o Destinatário</Text>
            </View>
            <ScrollView>
                <PatrimonioSaidaListaUsuarioDestino></PatrimonioSaidaListaUsuarioDestino> 
            </ScrollView>
        </Screen>
    );
}

export default PatrimonioSaidaListaDestinatarioScreen;