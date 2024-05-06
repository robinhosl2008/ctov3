import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { List, Badge } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import store from './../../state/store';
import { envioPatrimonioAddUsuarioDestino } from './../../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import { clearFilterParamPatrimonioRecebido } from './../../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import PatrimonioSaidaListaItensScreen from '../../screen/Patrimonio/PatrimonioSaidaListaItensScreen';


function PatrimonioSaidaListaUsuarioDestino(props) {

    const navigation            = useNavigation();
    let user_auth               = props.state.app.user_auth;
    let envio_patrimonio        = props.state.patrimonio_recebido.envio_patrimonio;
    let arr_status_destino_user = props.state.equipamento_controle_fluxo.arr_status_destino_user;

    function selecionar_usuario_destino(item){

        // Armazena o ID do Status inicial
        store.dispatch(envioPatrimonioAddUsuarioDestino({id_destinatario: item.user.id, destinatario: item.user.nick }));

        //Limpa todos os filtros que possam estar aplicados na tela de patrimonios
        store.dispatch(clearFilterParamPatrimonioRecebido());

        // Exibe a screen para o usuário selecionar o status de destino
        navigation.navigate('PatrimonioSaidaListaItensScreen'); 

    }

    return (
        <View>
            {
                arr_status_destino_user.map((item) => {

                    // Apenas lista os usuários que tem permissão de receber o status de destino
                    if (item.id_lib_equipamento_status_recebe === envio_patrimonio.id_status_destino && item.id_funcionario !== user_auth.id && item.user !== undefined){ 
                        return (
                            <TouchableOpacity onPress={() => { selecionar_usuario_destino(item) }} key={item.user.id}> 
                                <List.Item 
                                    style={{backgroundColor: 'white', borderRadius: 10, marginVertical: 5}}  
                                    title={item.user.nick}
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
    );

}

export default connect(function mapStateToProps(state){ return {state} })(PatrimonioSaidaListaUsuarioDestino);