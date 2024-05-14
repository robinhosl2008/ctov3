import React from 'react';
import { Text, View } from 'react-native'; 
import Screen from './../../component/Screen';
import PatrimonioSaidaListaStatus from './../../component/PatrimonioSaida/PatrimonioSaidaListaStatus';
// import CardTitle from '../../component/CardTitle';
import { ScrollView } from 'react-native-gesture-handler';
// import PatrimonioSaidaHeader from './../../component/PatrimonioSaida/PatrimonioSaidaHeader';

function PatrimonioSaidaScreen(props) {
    return (
        <Screen>
            <View>
                <Text style={{fontSize: 18, marginBottom: 20}}>Selecione o status de Origem:</Text>
            </View>
            <ScrollView>
                <PatrimonioSaidaListaStatus></PatrimonioSaidaListaStatus> 
            </ScrollView>
        </Screen>
    );
}

export default PatrimonioSaidaScreen;