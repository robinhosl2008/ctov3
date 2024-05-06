import React from 'react'
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { RadioButton, TextInput, Button } from 'react-native-paper';
import HeaderBlank from '../../component/HeaderBlank';
import store  from '../../state/store';
import Feather from 'react-native-vector-icons/Feather';
import Entypo                           from 'react-native-vector-icons/Entypo';
import { useRoute }         from '@react-navigation/native';
import { useNavigation }    from '@react-navigation/native';
import OperacaoGaragemService from '../../service/OperacaoGaragemService';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Loader from "react-native-modal-loader";
import { useState } from 'react/cjs/react.development';
import OperacaoGaragemOnibusHeader from '../../component/OperacaoGaragem/OperacaoGaragemOnibusHeader';

function OperacaoGaragemMotivoRetiradaScreen(props) {

    const state           = store.getState();
 
    // Lista os motivos de retirada, com base no equipamento selecionado
    let arr_motivo_retirada = state.lib.lib_equipamento_motivo_retirada.filter((item) => {
        if (item.id_lib_equipamento_tipo == props.equipamento.id_lib_equipamento_tipo){
            return item;
        }
    });

    return (
        <>
        <View style={[style.container, props.style]}>
            <ScrollView style={style.container_list} showsVerticalScrollIndicator={false}>
            <View style={[style.container_observacao, {marginBottom: 30}]}>
                <Text style={{fontWeight: 'bold', fontSize: 15, marginBottom: 10}}>Observação</Text>
                <TextInput
                    placeholder="Digite a observação"
                    mode="outlined"
                    multiline={true}
                    numberOfLines={5}
                    onChangeText={text => props.setObservacao(text)}
                    style={{backgroundColor: 'white'}}
                />
            </View>
            <View>
                <Text style={{fontWeight: 'bold', fontSize: 15, marginBottom: 10}}>Selecione o motivo de retirada</Text>
                {
                    arr_motivo_retirada.map((item) => {
                        return (
                        <TouchableOpacity key={item.id} onPress={() => props.setLibMotivoRetirada(item)}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 2}}>
                                <RadioButton    
                                    value={item.id}
                                    status={ props.lib_equipamento_motivo_retirada !== null && props.lib_equipamento_motivo_retirada.id === item.id ? 'checked' : 'unchecked' }
                                    color='black'
                                >
                                </RadioButton>
                                <Text style={{fontSize: 18}}>{item.motivo}</Text>
                            </View>
                        </TouchableOpacity>                        
                        )
                    })
                }
            </View>
            </ScrollView>
        </View>
        </>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    container_list: {
        paddingHorizontal: 20,
    }
});

export default OperacaoGaragemMotivoRetiradaScreen;