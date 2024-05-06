import React from 'react';
import { Button, Text} from 'react-native-paper';
import CTOStats from '../component/CTOStats';
import PatrimonioStats from '../component/PatrimonioStats';
import Screen   from './../component/Screen';
import HistoricoAtuacao from './../component/HistoricoAtuacao';
import { ScrollView, View } from 'react-native-gesture-handler';
import CTOUser from '../component/CTOUser';
import PTRView from 'react-native-pull-to-refresh';
import ApiService from '../service/ApiService';

function HomeScreen(props) {

    const _atualizar_dados = function(){
        return new Promise((resolve) => {
            setTimeout(()=>{resolve()}, 2000)
        });
    }

    return (
        <>
            <PTRView onRefresh={() => ApiService.atualizar_firestore()}>
                <ScrollView  showsVerticalScrollIndicator={false}>
                    {/* DADOS DO USUÁRIO */}
                    <CTOUser />
                    
                    <Screen style={{marginBottom: 20}}>

                    {/* CENTRAL DE TECNICOS ONBUS */}
                    <CTOStats total_carros="00" total_alertas_pendentes="00" total_atuacoes_pendentes="00" total_atuacoes_validar="00" />

                    {/* HISTÓRICO DE ATUAÇÃO */}
                    <HistoricoAtuacao /> 

                    {/* TRANSFERÊNCIA DE PATRIMÔNIO */} 
                    <PatrimonioStats total_receber="0" total_enviar="0" />
                    
                    </Screen>
                    
                </ScrollView>
            </PTRView>
        </>
    );
}

export default HomeScreen;
