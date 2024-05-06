import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Button, Platform, SafeAreaView, StatusBar } from 'react-native';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import {TextInput, Snackbar} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import AppService from './../../service/AppService';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import { useNavigation } from '@react-navigation/native';
import AsyncStorageService from './../../service/AsyncStorageService';
import packageJson from './../../../package.json';

function LoginScreen(props) {

    const navigation                        = useNavigation();

    const [usuario, setUsuario]             = useState(null);
    const [senha, setSenha]                 = useState(null);
    loadingButton                           = React.createRef();

    // Handle Error
    const [loading, setLoading]             = useState(false);
    const [error, setError]                 = useState(null);
    const [hasError, setHasError]           = useState(false);
    const onDismissSnackBar                 = () => {
        setError(null);
        setHasError(false);
    };
    
    React.useEffect(async () => {

        let login = await AsyncStorageService.get_user_login();

        if (login.user && login.password){
            setUsuario(login.user);
            setSenha(login.password);
        }

    });

    async function autenticar(){
        try{

            loadingButton.showLoading(true);
            setLoading(true);

            // Realiza o Login
            let response = await AppService.do_login(usuario, senha);

            // Direciona o usuário para página Home
            if (response.result == true){
                navigation.navigate('HomeScreen_v3', {screen: 'HomeScreen_v3' });
            } else {

                switch(response.error){
                    case "version-deprecated":{

                        // Desabilita o Loading do Botão
                        setLoading(false);
                        
                        navigation.navigate('UpgradeScreen', {screen: 'UpgradeScreen', app_current_version: response.app_current_version, app_link_download: response.app_link_download });

                    }break;
                }

            }
            
        } catch(e){

            // Desabilita o Loading do Botão
            loadingButton.showLoading(false);
            setLoading(false);
            
            // Exibe o Snackbar com erro
            console.error(e);
            setError(e);
            setHasError(true);

        } finally {
            // Desabilita o Loading do Botão
            loadingButton.showLoading(false);
            setLoading(false);
        }
    }

    return (
        <>
        <View style={style.container}>
            <StatusBar style="auto" />
            <View style={style.container_logo}>
                <Image style={style.imageLogo} fadeDuration={500} resizeMode="stretch" source={require('./../../assets/image/logo_cto.png')}/>
            </View>
            <View style={style.container_fields}>
                <TextInput 
                    label="Usuário" 
                    mode='outlined' 
                    editable={!loading}
                    // backgroundColor={(loading) ? 'whitesmoke' : 'white'}
                    value={usuario} 
                    onChangeText={txtUser => setUsuario(txtUser)} 
                    style={{marginVertical: 5}} 
                    left={<TextInput.Icon name={() => <Feather name="user" size={20} />}/>}
                />
                <TextInput 
                    label="Senha" 
                    mode='outlined' 
                    editable={!loading}
                    // backgroundColor={(loading) ? 'whitesmoke' : 'white'}
                    value={senha} 
                    onChangeText={txtSenha => 
                    setSenha(txtSenha)} 
                    secureTextEntry={true}
                    style={{marginVertical: 5}} 
                    left={<TextInput.Icon name={() => <Feather name="lock" size={20} />}/>}
                />
            </View>
            <View style={style.container_actions}>
                <HideWithKeyboard>
                <AnimateLoadingButton
                    ref={c => (loadingButton = c)}
                    width={350}
                    height={50}
                    title="ENTRAR"
                    titleFontSize={16}
                    titleColor="rgb(255,255,255)"
                    backgroundColor="orange"
                    borderRadius={4}
                    onPress={() => autenticar()}
                />
                <View style={style.container_version}>
                    <Text style={{fontWeight: 'bold', textTransform: 'uppercase'}}>Versão: {packageJson.version}</Text>
                </View>
                </HideWithKeyboard>
            </View>
        </View>
        <Snackbar
            visible={hasError}
            onDismiss={onDismissSnackBar}
            action={{
                label: 'OK',
                onPress: () => {
                    // Do something
                },
            }}>
            {error}
        </Snackbar>
        </>
    );
}

const style = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 20,
        flex: 1
    },
    container_logo: {
        flex: 1.5,
        alignItems: 'center',
        paddingTop: 50
    },
    container_fields: {
        flex: 1,
        paddingTop: 50
    },
    container_actions: {
        flex: 0.8
    },
    container_version: {
        alignSelf: 'center',
        marginTop: 50
    },
    imageLogo: {
        maxHeight: 200,
        maxWidth: 200
    },
    txtInputDisaled: {
        backgroundColor: 'red'
    }
});

export default LoginScreen;
