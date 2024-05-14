import React, { useEffect, useState } from 'react';
import { View,Text,Button,StyleSheet, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {TextInput, Snackbar} from 'react-native-paper';
import AnimateLoadingButton from 'react-native-animate-loading-button';
// import HideWithKeyboard from 'react-native-hide-with-keyboard';
import AsyncStorageService from '../../service/AsyncStorageService';
import AppService from '../../service/AppService';
import { useNavigation } from '@react-navigation/native';
// import Feather from 'react-native-vector-icons/Feather';
import packageJson from '../../../package.json';
import { connect } from 'react-redux';


function LoginScreen_v3(props){
    //let loadingButton                           = React.createRef();

    // function autenticar(){
    //     loadingButton.showLoading(true);

    //     setTimeout(() => {
    //         loadingButton.showLoading(false)
    //     },3000)
    // }

    const navigation                        = useNavigation();

    const [usuario, setUsuario]             = useState(null);
    const [senha, setSenha]                 = useState(null);
    var loadingButton                       = React.createRef();

    // Handle Error
    const [loading, setLoading]             = useState(false);
    const [error, setError]                 = useState(null);
    const [hasError, setHasError]           = useState(false);
    const onDismissSnackBar                 = () => {
        setError(null);
        setHasError(false);
    };
    
    useEffect(() => {

        const setData = async () => {
            let login = await AsyncStorageService.get_user_login();

            if (login.user && login.password){ 
                setUsuario(login.user);
                setSenha(login.password);
            }
        }
 
        setData();

    });

    async function autenticar(){
        try{

            loadingButton.showLoading(true);
            setLoading(true);

            // Realiza o Login
            let response = await AppService.do_login(usuario, senha);

            console.info("::: AUTENTICAÇÃO :::");
            console.info(JSON.stringify(response, null, 4));

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
            loadingButton.showLoading(0);
            setLoading(false);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
           <View style={styles.showcase}>
                <Image style={styles.imageLogo} resizeMode="stretch" source={require('../../assets/image/ctobranca.png')}/>
           </View>
           <View style={styles.form}>
                <TextInput 
                    placeholder="Usuário"
                    //mode='outlined' 
                    //editable={!loading}
                    editable={true}
                    value={usuario} 
                    onChangeText={txtUser => setUsuario(txtUser)} 
                    style={styles.forminput} 
                />
                <TextInput 
                    placeholder="Senha"
                    //mode='outlined' 
                    //editable={!loading}
                    editable={true}
                    // backgroundColor={(loading) ? 'whitesmoke' : 'white'}
                    value={senha} 
                    onChangeText={txtSenha => setSenha(txtSenha)} 
                    secureTextEntry={true}
                    style={styles.forminput} 
                />
                <View style={styles.actions}>
                    <AnimateLoadingButton
                        ref={c => (loadingButton = c)}
                        width={200}
                        height={40}
                        title="ENTRAR"
                        titleFontSize={16}
                        titleColor="rgb(255,255,255)"
                        backgroundColor="orange"
                        borderRadius={4}
                        onPress={() => autenticar()}
                    />
                </View>
            </View>
           <View style={styles.landing}>
                <Text style={styles.textinfo} >Central Técnica Onbus</Text>
                <Text style={styles.textinfo}>{packageJson.version}</Text>
           </View>
        </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
 
    },
    showcase:{
        width:'150%',
        height:'55%',
        backgroundColor:'darkorange',
        borderBottomRightRadius:300,
        borderBottomLeftRadius:300,   
        display:'flex',
        alignItems:'center',
        justifyContent:'flex-start',
        paddingTop:50
    },
    maintitle:{
        fontFamily:'Arial',
        fontSize:32,
        fontWeight:'bold',
        color:'white'
    },
    imageLogo: {
        width:200,
        height:200,
    },
    landing:{
        width:'100%',
        height:'45%',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'flex-end',
        paddingBottom:30,
    },
    textinfo:{
        color:'white',
        fontFamily:'Arial',
        color:'black',
        fontSize:16
    },
    form:{
        position:'absolute',
        margin:'auto',
        top:'35%',
        width:300,
        height:300, 
        borderRadius:15,
        backgroundColor:'white',
        shadowColor: 'black',
        elevation:5,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
    },
    actions:{
        margin:10,
    },
    forminput:{
        width:'90%',
        height:60,
        fontSize:18,
        borderRadius:5,
        borderColor:'black',
        borderBottomWidth:0.5,
        margin:20,
        paddingLeft:10,
    }
    
});


export default connect(state => { return state })(LoginScreen_v3);