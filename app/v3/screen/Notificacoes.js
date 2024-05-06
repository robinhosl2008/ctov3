import React from 'react';
import { View, Text, StyleSheet,FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Infotape from '../components/Infotape';

const NOTICATION = [
    'Tarefa#1 Adicionada',
    'Tarefa#2 Adicionada',
    'Tarefa#3 Adicionada',
    'Tarefa#4 Adicionada',
    'Tarefa#5 Adicionada',
    'Tarefa#5 Adicionada',
    'Tarefa#5 Adicionada',
    'Tarefa#5 Adicionada',
    'Tarefa#5 Adicionada',
    'Tarefa#5 Adicionada',
    'Tarefa#5 Adicionada',
    'Tarefa#5 Adicionada',
]


export default function Notificacoes(props){

    return(
        <View contentContainerStyle="">
            <FlatList
                data={NOTICATION}
                renderItem={({item}) => { return (<Infotape label={item} />) }}
                keyExtractor={(item,index) => { return index.toString() }}
            />
        </View>
    )
}

