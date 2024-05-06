import React,{  useEffect } from 'react';
import { View,Text,StyleSheet,Button,TouchableOpacity,FlatList,TouchableWithoutFeedback,Keyboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import OperacaoOOHService  from '../../service/OperacaoOOHService';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Infotape from '../components/Infotape';
import  firestore  from "@react-native-firebase/firestore";
import Loader from '../components/Loader';
import store from '../../state/store';  
import { connect } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import util from '../../util/util';


const SelecionarAtuacaoScreen = () => {
    const terminal = 'Alvorada';
    const [alertas,setArrAlertas] = useState([]);
    const {params} = useRoute();
    const [loading,setLoading] = useState(true);
    let id_estabelecimento = params.route_params.id_estabelecimento;
    let estabelecimento = params.route_params.estabelecimento;

    function organizar_alertas(response){
        let arr_temp = [];
        response.forEach((item) => {

            let i_alerta = arr_temp.findIndex( alerta => alerta.id_lib_em_alerta == item.id_lib_em_alerta );
            if (i_alerta >= 0){ 
                arr_temp[i_alerta]['arr_alerta'].push(item);
            } else {
                arr_temp.push({ 
                    id_lib_em_alerta: item.id_lib_em_alerta,
                    id_ooh_ponto_em_alerta: item.id_ooh_ponto_em_alerta,
                    id_produto: item.id_produto,
                    produto: item.produto,
                    estabelecimento: item.estabelecimento,
                    id_estabelecimento: item.id_estabelecimento,
                    alerta: item.alerta,
                    id_ooh_ponto_em_alerta: item.id_ooh_ponto_em_alerta,
                    id_ooh_estabelecimento_ponto: item.id_ooh_estabelecimento_ponto,
                    av: (item.av) ? item.av : null,
                    arr_alerta: [item]
                });
            }
        })

        console.log('::: ANALISANDO METADATA :::');
        console.log('::: ANALISANDO METADATA :::');
        console.log('::: ANALISANDO METADATA :::');
        console.log('::: ANALISANDO METADATA :::');
        console.log(JSON.stringify(arr_temp, null, 2));

        setArrAlertas(arr_temp);
        setLoading(false);
    }

    useEffect(() => { 
        OperacaoOOHService  
            .listar_alerta_para_atuacao({'id_estabelecimento': id_estabelecimento}) 
            .then(response => {
                organizar_alertas(response);
            }).catch(err => { 
                console.log('Deu erro');   
                console.log(err) 
            });
    },[])

    return(
        <View>
            <View style={styles.header}>
                <Text style={styles.terminal}>Terminal {estabelecimento}</Text>
                <Text style={styles.indicator}>Selecione o Alerta para Atuação</Text>
            </View>
            <View style={styles.actions}>
                {
                     (loading) 
                        ? <Loader/>
                        : <FlatList 
                            data={alertas}
                            renderItem={({item}) => { 
                                let _id_av = (item.av != null) ? item.av.id : null; 
                                let _av = (item.av != null) ? util.obj_to_array(item.av) : null
                                let _route_params = {
                                    id_ooh_ponto_em_alerta: item.id_ooh_ponto_em_alerta,
                                    id_lib_em_alerta: item.id_lib_em_alerta, 
                                    alerta: item.alerta,
                                    id_ooh_estabelecimento_ponto: item.id_ooh_estabelecimento_ponto,
                                    id_estabelecimento: item.id_estabelecimento,
                                    estabelecimento: item.estabelecimento,
                                    id_av: _id_av,
                                    av: _av,
                                    title: item.estabelecimento, 
                                }
                                return (<Infotape  touchEvent={true} targetScreen="OperacaoOOHListaPontosScreen" route_params={_route_params} label={item.alerta} badge={item.arr_alerta.length}/>) 
                            }} 
                            keyExtractor={(item,index) => { return index.toString() }}
                        />
                }
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    header:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#E9E9E9',
        paddingTop:10,
        backgroundColor:'white',
        height:150,
        width:'100%',
    },
    terminal:{
        fontFamily:'Arial',
        fontSize:24,
        color:'gray',
        fontWeight:'bold',
        margin:20
    },
    indicator:{
        fontFamily:'Arial',
        fontSize:18,
        color:'gray',
        fontWeight:'bold',
        marginBottom:15
    }
})

export default SelecionarAtuacaoScreen;