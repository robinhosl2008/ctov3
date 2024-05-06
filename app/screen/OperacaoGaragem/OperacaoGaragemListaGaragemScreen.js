import React from 'react'
import { View, Text } from 'react-native'
import OperacaoGaragemSelecionarGaragem from '../../component/OperacaoGaragem/OperacaoGaragemSelecionarGaragem';
import Screen from '../../component/Screen';
import LottieBus from './../../component/LottieBus';

function OperacaoGaragemListaGaragemScreen() {
    return (
        <Screen>
            <View style={{backgroundColor: 'white', borderRadius: 10, alignItems: 'center', paddingBottom: 15}}>
                <LottieBus />
                <Text style={{fontSize: 20}}>Operação Garagem</Text>
            </View>
            <OperacaoGaragemSelecionarGaragem />
        </Screen>
    )
}

export default OperacaoGaragemListaGaragemScreen;