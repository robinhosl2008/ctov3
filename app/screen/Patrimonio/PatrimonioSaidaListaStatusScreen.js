import React from 'react';
import Screen from '../../component/Screen';
import PatrimonioSaidaListaStatus from '../../component/PatrimonioSaida/PatrimonioSaidaListaStatus';
import CardTitle from '../../component/CardTitle';
import { ScrollView } from 'react-native-gesture-handler';
import PatrimonioSaidaHeader from '../../component/PatrimonioSaida/PatrimonioSaidaHeader';

function PatrimonioSaidaListaItensScreen(props) {
    return (
        <Screen>
            <ScrollView>
                <PatrimonioSaidaListaStatus></PatrimonioSaidaListaStatus> 
            </ScrollView>
        </Screen>
    );
}

export default PatrimonioSaidaListaItensScreen;