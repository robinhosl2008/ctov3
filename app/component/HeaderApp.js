import React from "react";
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Appbar, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import util from './../util/util';

const HeaderApp = ({ scene, previous, navigation }) => {

    const { options } = scene.descriptor;
    const routeName   = scene.route.name;
    const title =
      options.headerTitle !== undefined
        ? options.headerTitle
        : options.title !== undefined
        ? options.title
        : routeName;


    function obterParametro(){
      let parametros = scene;
      let arrparametros = parametros;
    }
    return (
      <Appbar.Header style={routeName=='HomeScreen'?({elevation:0,color:'darkorange'}):({})}>
        {previous ? (
          <Appbar.BackAction color="white" onPress={navigation.goBack} />
        ) : (
          <></>
        )}
        <Appbar.Content
          style={routeName=='HomeScreen'?({alignContent:'center', alignItems:'center'}):(<></>)}     
          color='white'
          title={
            previous ? title : "Onbus Digital"
          }
        >
        {
          routeName == 'PatrimonioSaidaListaItensScreen' ? (
            <TouchableOpacity>
              <Appbar.Action icon="basket" color="white" /> 
            </TouchableOpacity>
          ) : (null)
        }
        </Appbar.Content>
        
        {
          routeName == 'HomeScreen' ? (
            <View style={{flexDirection: 'row', marginRight: 10, alignItems: 'center'}}></View>
          ) : (null)
        }

        {
          routeName == 'PatrimonioEntradaScreen' ? (
            <TouchableOpacity>
              <Appbar.Action icon="basket" color="white" /> 
            </TouchableOpacity>
          ) : (null)
        }

      </Appbar.Header>

    );
};

const style = StyleSheet.create({
  icon: {
    color: 'white'
  },
  containerMenuIcon:{
    paddingLeft: 10
  }
});

export default HeaderApp; 