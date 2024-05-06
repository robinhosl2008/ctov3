import React from 'react';
import { View } from 'react-native';
import Screen from './../../component/Screen';
import SelecionarAvatarUsuario from '../../component/SelecionarAvatarUsuario';
import PatrimonioEntradaListaItens from '../../component/PatrimonioEntrada/PatrimonioEntradaListaItens';
import AppBottomSheet from './../../component/AppBottomSheet';
import PatrimonioEntradaConfirmarScreen from './PatrimonioEntradaConfirmarScreen';

function PatrimonioEntradaScreen(props) {

    return (
        <>
        <Screen>
            <View style={{flex: 1, flexDirection: 'column', alignContent: 'space-between', justifyContent: 'space-between'}}>

                <View style={{flex:1}}>
                    <SelecionarAvatarUsuario />
                </View>
                
                <View style={{flex: 3}}>
                    <PatrimonioEntradaListaItens></PatrimonioEntradaListaItens>
                </View>

            </View>

        </Screen>

        <AppBottomSheet>
            <PatrimonioEntradaConfirmarScreen></PatrimonioEntradaConfirmarScreen>
        </AppBottomSheet>
        </>
    );
}

export default PatrimonioEntradaScreen;