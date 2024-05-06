import React, { useEffect } from 'react';
import CTOStats from '../../component/CTOStats';
import PatrimonioStats from '../../component/PatrimonioStats';
import Screen   from '../../component/Screen';
import HistoricoAtuacao from '../../component/HistoricoAtuacao';
import CTOUser from '../../component/CTOUser';
import PTRView from 'react-native-pull-to-refresh';
import ApiService from '../../service/ApiService';
import { Text,StyleSheet,View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import HeaderProfilePicture from '../components/HeaderProfilePicture';
import { Badge } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Infotape from '../components/Infotape';
import { connect, useSelector } from 'react-redux';
import OperacaoOOHService from '../../service/OperacaoOOHService';
import CheckingService from '../../service/CheckingService';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

 
export function HomeScreen_v3({navigation,cto}) {
    let total_enviar    = useSelector(state=> state.equipamento_funcionario_controle.total_patrimonio_enviar);
    let total_alerta_pendente = parseInt(cto.total_ooh_a_fazer) + parseInt(cto.total_checking_a_fazer) + parseInt(cto.total_garagem_a_fazer);
     
    const _atualizar_dados = function(){
        return new Promise((resolve) => {
            setTimeout(()=>{resolve()}, 2000)  
        });
    }

    useEffect(() => {
        
    },[]) 

    return (
        <>
           <PTRView onRefresh={() => ApiService.atualizar_firestore()}> 
                <ScrollView>
                    <HeaderProfilePicture/> 
                    <View style={styles.actionsContainer}> 
                        <View style={styles.actionsTitle}>
                            <Text style={styles.title}>Resumo das atuações</Text> 
                        </View>
                    <Infotape icon={<FontAwesome5 name="camera" size={25} color="gray" />} touchEvent={true} label="Checking"  badge={cto.total_checking_a_fazer}/>
                    <Infotape icon={<Ionicons name="location-sharp" size={25} color="gray" />} touchEvent={true} label="Terminais" badge={cto.total_ooh_a_fazer} />
                    <Infotape icon={<FontAwesome5 name="bus" size={25} color="gray" />} touchEvent={true} label="Garagens" badge={cto.total_garagem_a_fazer}/>
                    <Infotape icon={<FontAwesome5 name="box" size={25} color="gray" />} touchEvent={true} label="Patrimonios" badge={total_enviar} />
                    </View>
                </ScrollView>
            </PTRView>
        </>
    );
}

const styles = StyleSheet.create({
    actionsContainer:{
        display:'flex',
        width:'100%',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },
    actionsTitle:{
        display:'flex',
        flexDirection:'row',
        width:'100%',
        alignItems:'center',
        justifyContent:'flex-start'
    },
    title:{
        fontSize:18,
        fontFamily:'Arial',
        margin:10,
    },
   
});


export default connect((state) => ({ cto: state.cto_status }))(HomeScreen_v3);