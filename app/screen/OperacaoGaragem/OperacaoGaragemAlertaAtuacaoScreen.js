import React from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import OperacaoGaragemAlertaAtuacao from '../../component/OperacaoGaragem/OperacaoGaragemAlertaAtuacao';
import Screen from '../../component/Screen';
import OperacaoGaragemOnibus from './../../component/OperacaoGaragem/OperacaoGaragemOnibus';

export default function OperacaoGaragemAlertaAtuacaoScreen(props) {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <OperacaoGaragemAlertaAtuacao></OperacaoGaragemAlertaAtuacao>
        </ScrollView>
    )
}
