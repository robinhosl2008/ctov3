import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen_v3 from '../v3/screen/HomeScreen_v3';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import OperacaoGaragemListaGaragemScreen from '../screen/OperacaoGaragem/OperacaoGaragemListaGaragemScreen';
import OperacaoOOHListaAlertasScreen from '../screen/OperacaoOOH/OperacaoOOHListaAlertasScreen';
import CheckingListarAVScreen from '../screen/Checking/CheckingListarAVScreen';
import DrawerNavigator from './DrawerNavigator';

const Tab = createBottomTabNavigator();
function TabBottomNavigator() {
  return (
    <Tab.Navigator
	screenOptions={() => ({})}
		tabBarOptions={{
		activeTintColor: 'darkorange',
		inactiveTintColor: 'black',
	}}
    >
      <Tab.Screen name="HomeScreen" options={{tabBarLabel: "Home", tabBarIcon: ({color, size}) => (<IconAntDesign name="home" size={size} color={color} />)} } component={HomeScreen_v3} />
      <Tab.Screen name="OperacaoGaragemListaGaragemScreen" options={{tabBarLabel: "Op Garagem", tabBarIcon: ({color, size}) => (<IconFontisto name="bus" size={size} color={color} />)}} component={OperacaoGaragemListaGaragemScreen} />
      <Tab.Screen name="OperacaoOOHListaAlertasScreen" options={{tabBarLabel: "OOH", tabBarIcon: ({color, size}) => (<IconFontisto name="direction-sign" size={size} color={color} />)}} component={OperacaoOOHListaAlertasScreen} />
      <Tab.Screen name="CheckingListarAVScreen" options={{tabBarLabel: "Checking", tabBarIcon: ({color, size}) => (<IconEvilIcons name="camera" size={size} color={color} />)}} component={CheckingListarAVScreen} />
    </Tab.Navigator>
  );
}

export default TabBottomNavigator;