import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Checking from '../screen/Checking';
import Terminais from '../screen/Terminais';
import Garagens from '../screen/Garagens';
import Home from '../screen/HomeScreen_v3';
import Patrimonios from '../screen/Patrimonios';
import HomeScreen_v3 from "../screen/HomeScreen_v3";
import HeaderApp from "../../component/HeaderApp";

const Tab = createBottomTabNavigator();


function displayIcon(routeName,focused,tintColor,size){
    tintColor = focused ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.6)';
    switch(routeName){
        case 'Checking' : return(<FontAwesome5 name="camera" size={25} color={tintColor}/>); break;
        case 'Terminais' : return(<Ionicons name="location-sharp" size={25} color={tintColor}/>); break;
        case 'HomeScreen_v3' : return(<FontAwesome5 name="home" size={25} color={tintColor}/>); break;
        case 'Garagens' : return(<FontAwesome5 name="bus" size={25} color={tintColor}/>); break;
        case 'Patrimonios' : return(<FontAwesome5 name="box" size={25} color={tintColor}/>); break;
    }
}


export default function TabBottomNavigator(){ 


    return(
        <Tab.Navigator 
            initialRouteName="HomeScreen_v3"
            tabBarOptions={{
                showLabel:false,
                style: styles.tabBarStyle
            }} 
        >   
            <Tab.Screen name="Checking" options={{tabBarIcon:({focused,color,size}) => displayIcon('Checking',focused,color,size)}} component={Checking}/>
            <Tab.Screen name="Terminais"  options={{tabBarIcon:({focused,color,size}) => displayIcon('Terminais',focused,color,size)}} component={Terminais}/>
            <Tab.Screen name="HomeScreen_v3"  options={{tabBarIcon:({focused,color,size}) => displayIcon('HomeScreen_v3',focused,color,size)}} component={HomeScreen_v3} />
            <Tab.Screen name="Garagens"  options={{tabBarIcon:({focused,color,size}) => displayIcon('Garagens',focused,color,size)}} component={Garagens} />
            <Tab.Screen name="Patrimonios"  options={{tabBarIcon:({focused,color,size}) => displayIcon('Patrimonios',focused,color,size)}} component={Patrimonios} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBarStyle:{
        backgroundColor:'darkorange',
    }
});
