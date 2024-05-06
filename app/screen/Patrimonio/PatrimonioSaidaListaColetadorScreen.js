import React from 'react';
import PatrimonioSaidaListaUsuarioDestino from '../../component/PatrimonioSaida/PatrimonioSaidaListaUsuarioDestino';
import CardTitle from '../../component/CardTitle';
import { ScrollView } from 'react-native-gesture-handler';
import PatrimonioSaidaHeader from './../../component/PatrimonioSaida/PatrimonioSaidaHeader';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useSelector}                from 'react-redux';
import { List, Badge } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import store from './../../state/store';
import { envioPatrimonioAddUsuarioDestino } from './../../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import { clearFilterParamPatrimonioRecebido } from './../../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import { envioPatrimonioAddColetador } from './../../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import PatrimonioSaidaListaItensScreen from '../../screen/Patrimonio/PatrimonioSaidaListaItensScreen';

function PatrimonioSaidaListaColetadorScreen(props) {
    
    const navigation            = useNavigation();
    let user_auth               = useSelector(state=>state.app.user_auth);
    //let envio_patrimonio        = props.state.patrimonio_recebido.envio_patrimonio;
    let arr_status_coletador_user = useSelector(state=>state.equipamento_controle_fluxo.arr_status_destino_user);
    //recuperar usuarios
    let usuarios = useSelector(state=>state.users);
    //Recuperar patrimonios listados para envio
    let dados = useSelector(state=> state.patrimonio_recebido.envio_patrimonio);

    function testarUser(user){
        console.log(usuarios);
        if(user!=undefined){
            console.log(user.has_coletador)
        }
    }

    function selecionar_coletador(item){
        
        // Armazena o ID do Status inicial
        store.dispatch(envioPatrimonioAddColetador({id_coletador: item.id, coletador: item.nick }));

        // Exibe a screen de confirmação do processo
        navigation.navigate('PatrimonioConfirmarSaidaScreen',{
            screen: 'PatrimonioConfirmarSaidaScreen',
            params: {'coletador': 1},
        })

    }

    return (
        <View style={{marginTop:10,padding:10}}>
            <View>
                <Text style={{fontSize: 18, marginBottom: 20}}>Selecione o Coletador:</Text>
            </View>
            <View>
                {console.log("Estado: ")}
                {console.log(dados)}
            {   
                //varre lista de usuários e encontra coletadores
                usuarios.map((item) => {
                    // Apenas lista os usuários que possuem has_coletador
                    //if (item.id_lib_equipamento_status_recebe === envio_patrimonio.id_status_destino && item.id_funcionario !== user_auth.id && item.user !== undefined){
                    if (item.has_coletador==1){
                        return (
                            <TouchableOpacity onPress={() => { selecionar_coletador(item) }} key={item.id}> 
                                <List.Item 
                                    style={{backgroundColor: 'white', borderRadius: 10, marginVertical: 5}}  
                                    title={item.nick}
                                    left={props => <Feather name="user" color="black" style={{alignSelf: 'center'}} size={20} />} 
                                    right={ props => 
                                        <View style={{flexDirection: 'row'}}>
                                            <Entypo name="chevron-small-right" color="black" style={{alignSelf: 'center'}} size={20} />
                                        </View>
                                    }
                                />
                            </TouchableOpacity>  
                        );
                    }
                })
            }
        </View>
        </View>
    );
}

export default PatrimonioSaidaListaColetadorScreen;