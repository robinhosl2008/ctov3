import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';

function AppIcon(props) {

    let lib   = (props.lib)     ? props.lib     : 'Feather';
    let icon  = (props.icon)    ? props.icon    : 'bell';
    let size  = (props.size)    ? props.size    : 20;
    let color = (props.color)   ? props.color   : 'black';
    let style = (props.style)   ? props.style   : {alignSelf: 'center'};

    function renderIcon(lib, icon){
      switch(lib){
        case "AntDesign":               return <AntDesign name={icon} style={style} size={size} color={color} />; break;
        case "Entypo":                  return <Entypo name={icon} style={style} size={size} color={color} />; break;
        case "EvilIcons":               return <EvilIcons name={icon} style={style} size={size} color={color} />; break;
        case "Feather":                 return <Feather name={icon} style={style} size={size} color={color} />; break;
        case "FontAwesome":             return <FontAwesome name={icon} style={style} size={size} color={color} />; break;
        case "FontAwesome5":            return <FontAwesome5 name={icon} style={style} size={size} color={color} />; break;
        case "Fontisto":                return <Fontisto name={icon} style={style} size={size} color={color} />; break;
        case "Foundation":              return <Foundation name={icon} style={style} size={size} color={color} />; break;
        case "Ionicons":                return <Ionicons name={icon} style={style} size={size} color={color} />; break;
        case "MaterialCommunityIcons":  return <MaterialCommunityIcons name={icon} style={style} size={size} color={color} />; break;
        case "MaterialIcons":           return <MaterialIcons name={icon} style={style} size={size} color={color} />; break;
        case "Octicons":                return <Octicons name={icon} style={style} size={size} color={color} />; break;
        case "SimpleLineIcons":         return <SimpleLineIcons name={icon} style={style} size={size} color={color} />; break;
        case "Zocial":                  return <Zocial name={icon} style={style} size={size} color={color} />; break;
      }
    }

    return renderIcon(lib, icon);
}

const style = StyleSheet.create({
  container: {
    backgroundColor: 'orangered',
    borderRadius: 5,
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  styleText: {
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 12
  }
});

export default AppIcon;
