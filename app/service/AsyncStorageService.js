import AsyncStorage from '@react-native-community/async-storage';
import CryptoJS from "react-native-crypto-js";
const PRIVATE_KEY = "ONBUSDIGITAL2021";

export default {
    async set_user_login(user, password){
        try{

            let user_encrypt        = CryptoJS.AES.encrypt(user, PRIVATE_KEY).toString();
            let password_encrypt    = CryptoJS.AES.encrypt(password, PRIVATE_KEY).toString();

            await AsyncStorage.setItem('user', user_encrypt);
            await AsyncStorage.setItem('password', password_encrypt);
            console.log("::: DADOS DE LOGIN ARMAZENADOS COM SUCESSO!");

        } catch(e){
            console.error("::: ERRO AO SALVAR OS DADOS DE LOGIN", e);
            throw e;
        }
    },

    async get_user_login(){
        
        let user_encrypted        = await AsyncStorage.getItem('user');
        let password_encrypted    = await AsyncStorage.getItem('password');

        if (user_encrypted && password_encrypted){

            let user      = CryptoJS.AES.decrypt(user_encrypted, PRIVATE_KEY).toString(CryptoJS.enc.Utf8);
            let password  = CryptoJS.AES.decrypt(password_encrypted, PRIVATE_KEY).toString(CryptoJS.enc.Utf8);

            return {user: user, password: password};

        } else {
            return {user: null, password: null};
        }
    }
}