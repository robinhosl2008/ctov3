import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import TabBottomNavigator from './TabBottomNavigator';
import { Button, Text, View } from 'react-native';

const Drawer = createDrawerNavigator();

function HistoricoScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button onPress={() => navigation.goBack()} title="Go back home" />
      </View>
    );
}

function DrawerNavigator() {
    return (
        <Drawer.Navigator initialRouteName="HomeScreen">
            <Drawer.Screen name="Home" component={TabBottomNavigator} options={{
                drawerLabel: () => <Text>Home</Text>
            }}/>
            <Drawer.Screen name="Historico" component={HistoricoScreen} options={{
                drawerLabel: () => <Text>Histórico de Atuação</Text>
            }}/>
        </Drawer.Navigator>
    );
}

export default DrawerNavigator;