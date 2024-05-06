import React from 'react';
import Screen from './../../component/Screen';
import PatrimonioSaidaListaItens from '../../component/PatrimonioSaida/PatrimonioSaidaListaItens';
import AppBottomSheet from './../../component/AppBottomSheet';
import PatrimonioSaidaHeader from './../../component/PatrimonioSaida/PatrimonioSaidaHeader';
import { ScrollView } from 'react-native-gesture-handler';
import PatrimonioSaidaConfirmar from '../../component/PatrimonioSaida/PatrimonioSaidaConfirmar';

function PatrimonioSaidaListaItensScreen(props) {
    return (
        <>
        <Screen>
            <ScrollView>
                <PatrimonioSaidaHeader />
                <PatrimonioSaidaListaItens></PatrimonioSaidaListaItens>
            </ScrollView>
        </Screen>
        <AppBottomSheet>
            <PatrimonioSaidaConfirmar />
        </AppBottomSheet>
        </>
    );
}

export default PatrimonioSaidaListaItensScreen;