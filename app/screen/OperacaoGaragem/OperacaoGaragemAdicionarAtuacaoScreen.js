import React from 'react'
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Button, List } from 'react-native-paper';
import HeaderBlank from '../../component/HeaderBlank';
import store  from './../../state/store';
import Feather from 'react-native-vector-icons/Feather';
import { useRoute }         from '@react-navigation/native';
import { useNavigation }    from '@react-navigation/native';
import OperacaoGaragemService from './../../service/OperacaoGaragemService';
import { RadioButton } from 'react-native-paper';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Loader from "react-native-modal-loader";
import { useState } from 'react/cjs/react.development';
import AppButton from './../../component/AppButton';

export default function OperacaoGaragemAdicionarAtuacaoScreen() {

    const state                             = store.getState();
    const lib_em_alerta_atuacao             = state.lib.lib_em_alerta_atuacao;
    const {params}                          = useRoute()
    const navigation                        = useNavigation();
    let onibus_em_alerta                    = params.params.onibus_em_alerta;
    let alerta                              = params.params.alerta;
    const [modalVisible, setModalVisible]   = useState(false);
    const [item_atuacao, setItemAtuacao]    = useState(null);

    async function adicionar_atuacao(){
        
        setModalVisible(true);

        // Adiciona o item de atuação
        await OperacaoGaragemService.adicionar_atuacao({
            onibus_em_alerta:       onibus_em_alerta,
            alerta:                 alerta,
            lib_em_alerta_atuacao:  item_atuacao
        });

        // Retorna para a página anterior
        navigation.pop(1);
        setModalVisible(false);
    } 

    return (
        <>
        <View style={style.container}>
            <Loader loading={modalVisible} color="darkorange" />
            <HeaderBlank>Cancelar</HeaderBlank>
            <Text style={{fontSize:18, marginBottom: 30}}>Selecione a atuação a ser realizada</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
            {
                lib_em_alerta_atuacao.map((item) => {
                    return (
                        <TouchableOpacity key={item.id} onPress={() => { setItemAtuacao(item) }}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 4}}>
                                <RadioButton    
                                    value={item.id}
                                    status={ item_atuacao && item_atuacao.id === item.id ? 'checked' : 'unchecked' }
                                    color='black'
                                >
                                </RadioButton>
                                <Text style={{fontSize: 18}}>{item.nome}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })
            }
            </ScrollView>
        </View>
        <View style={{padding: 20, backgroundColor: 'white'}}>
            <AppButton disabled={!item_atuacao ? true : false } onPress={() => { adicionar_atuacao() }}>Adicionar</AppButton>
        </View>
        </>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingBottom: 20
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }
});