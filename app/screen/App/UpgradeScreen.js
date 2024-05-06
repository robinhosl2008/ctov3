import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, Linking } from 'react-native';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {TextInput, Snackbar} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import AppService from '../../service/AppService';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import { useNavigation } from '@react-navigation/native';
import AsyncStorageService from '../../service/AsyncStorageService';
import packageJson from '../../../package.json';
import { Button } from 'react-native-paper';


function UpgradeScreen(props) {

    return (
        <>
        <View style={style.container}>
            <StatusBar style="auto" />
            <View style={style.container_body}>
                <Text style={style.aviso}>Sua versão do aplicativo Onbus Mobile está desatualizada.</Text>
                <Text style={style.texto}>Por favor, baixe e instale a nova versão ({props.route.params.app_current_version})</Text>
                
                <Button 
                    icon="download" 
                    mode="contained" 
                    style={{backgroundColor: '#000000', padding: 5, marginTop: 50, width: '100%', borderRadius: 5}}
                    labelStyle={{color: '#ffffff'}}
                    onPress={() => Linking.openURL(props.route.params.app_link_download) }> 
                    Baixar nova versão
                </Button>

            </View>
        </View>
        </>
    );
}

const style = StyleSheet.create({
    container: {
        backgroundColor: '#f28500',
        padding: 30,
        flex: 1
    },
    container_body: {
        flex: 1.5,
        alignItems: 'center',
        paddingTop: '40%'
    },
    aviso: {
        fontSize: 24,
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 40,
        fontWeight: 'bold'
    },
    texto: {
        fontSize: 20,
        color: '#ffffff',
        textAlign: 'center',
        marginTop: 30
    }
});

export default UpgradeScreen;
