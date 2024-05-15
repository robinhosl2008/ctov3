import React from 'react';
import { View,Text,TouchableOpacity, StyleSheet, Image} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { Avatar }           from 'react-native-paper'; 


const HeaderProfilePicture = (props) => {
    let urlSourceImage = require(`../assets/profile.png`);
    if (props.app.user_auth.imagem_base64) {
        urlSourceImage = {uri: `data:image/jpg;base64,${props.app.user_auth.imagem_base64}`};
    }

    return( 
        <View style={styles.profile}>
            <Avatar.Image size={120}  source={urlSourceImage}/>
            <Text style={styles.employ}>{props.app.user_auth.nick}</Text>
            <Text style={styles.ocupation}>{props.app.user_auth.funcao}</Text>
        </View>
    )
} 

const styles = StyleSheet.create({
    profile:{
        display:'flex',
        flexDirection:'column',
        width:'100%',
        height:250,
        alignItems:'center',
        justifyContent:'flex-start',
        backgroundColor:'white',
        paddingTop:20
    },
    employ:{
        fontSize:18,
        color:'black',
        margin:20,
    },
    ocupation:{
        fontSize:18,
        color:'gray'
    },
    profileImage:{
        width:120,
        height:120,
    }
});


export default  connect((state) => { return state })(HeaderProfilePicture);