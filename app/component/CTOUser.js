import React                        from 'react';
import { View, StyleSheet, Text, ImageBackground, Image }   from 'react-native';
import Title                        from './Title';
import {connect}                    from 'react-redux';
import { Avatar, Button }           from 'react-native-paper'; 
import { TouchableOpacity }         from 'react-native-gesture-handler';
import AppService                   from './../service/AppService';

function CTOUser(props) {

    function logout(){
        AppService.do_logout();
    }

    return (
        <>
        <View style={style.container}>
            <ImageBackground source={require('./../assets/image/bg_home.png')} style={{width:'100%', height:250, flexDirection:'row', alignItems:'flex-end', justifyContent:'center',}}
            imageStyle={{
                resizeMode: 'stretch',
                alignSelf: 'flex-end',
                position:'absolute',
                bottom:0,
            }}>
                <View style={{justifyContent:'center', alignItems:'center', alignSelf:'flex-end'}}>
                    <Image source={require('./../assets/image/logo_cto_home.png')} style={{width:100, height:100}} imageStyle={{width:100, height:100,}}></Image>
                    <Avatar.Image size={100} style={style.avatar} source={{uri: `data:image/jpg;base64,${props.app.user_auth.imagem_base64}`}}/>
                </View>
                
            </ImageBackground>
            
            <Text style={style.Nome}>{props.app.user_auth.nick}</Text>
            <Text style={style.funcao}>{props.app.user_auth.funcao}</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'center',}}>
            <TouchableOpacity onPress={() => logout()} style={{marginTop:-30}}>
                <Button style={style.btnLogout} mode='outlined' icon="logout" contentStyle={{backgroundColor: 'red', height: 40, paddingHorizontal: 15,}} labelStyle={{color: 'white'}}>SAIR</Button>
            </TouchableOpacity>
        </View>
        </>
    );
}

const style = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        paddingBottom: 35,
    },
    avatar: {
        marginBottom: 10
    },
    Nome:{
        fontWeight:'bold',
        fontSize:24,
    },
    funcao: {
        textTransform: 'uppercase',
        marginTop: 0,
    },
    btnLogout: {
        marginTop: 10,
    }
});

function mapStateToProps(state) {
    return state;
}
export default connect(mapStateToProps)(CTOUser);