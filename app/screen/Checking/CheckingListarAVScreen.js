import React from 'react';
import { View, Text } from 'react-native'
import AVCheckingListar from '../../component/Checking/AVCheckingListar';
import Screen from '../../component/Screen';
import AppIcon from '../../component/AppIcon';
import { useRoute } from '@react-navigation/native';

function CheckingListarAVScreen() {
    const {params} = useRoute();

    return (
        <Screen>
            <AVCheckingListar route_params={params.route_params}/>
            {/* <View style={{backgroundColor: 'white', borderRadius: 10, marginHorizontal: 10, padding: 20}}>
                <AppIcon lib="MaterialCommunityIcons" icon="bus-alert" size={60} style={{marginVertical: 20, alignSelf: 'center' }}></AppIcon>
                <Text style={{fontSize: 20, color: 'red', textAlign: 'center'}}>O Checking Fotográfico será lançado em breve nesta versão do aplicativo.</Text>
                <Text style={{fontSize: 20, color: 'red', marginTop: 20, textAlign: 'center'}}>Caso precise fazer um Checking, por favor, utilize a versão anterior do Aplicativo.</Text> 
            </View> */}
        </Screen>
    )
}

export default CheckingListarAVScreen; 