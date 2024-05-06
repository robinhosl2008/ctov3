import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { List, Badge } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import store from './../../state/store';
import { envioPatrimonioAddStatusDestino } from './../../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import PatrimonioSaidaListaDestinatarioScreen from '../../screen/Patrimonio/PatrimonioSaidaListaDestinatarioScreen';

function PatrimonioSaidaListaStatusDestino(props) {

    const navigation                    = useNavigation();
    let user_auth                       = props.state.app.user_auth;
    let arr_equipamento_controle_fluxo  = props.state.equipamento_controle_fluxo.data;

    function selecionar_status_destino(item){

        // Armazena o ID do Status inicial
        store.dispatch(envioPatrimonioAddStatusDestino({id_status_destino: item.id_lib_equipamento_status_transfere, status_destino: item.status_transfere}));

        // Exibe a screen para o usuário selecionar o status de destino
        navigation.navigate('PatrimonioSaidaListaDestinatarioScreen');

    }

    return (
        <View>
            {
                arr_equipamento_controle_fluxo.map((item) => {
                    if (item.id_funcionario == user_auth.id && item.id_lib_equipamento_status_transfere){
                        return (
                            <TouchableOpacity onPress={() => { selecionar_status_destino(item) }} key={item.id_lib_equipamento_status_transfere}> 
                                <List.Item 
                                    style={{backgroundColor: 'white', borderRadius: 10, marginVertical: 5}}  
                                    title={item.status_transfere}
                                    left={props => <List.Icon {...props} icon="folder" color="darkorange" />}
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

const style = StyleSheet.create({
    container: {
        marginBottom: 40
    }
});

export default connect(function mapStateToProps(state){ return {state} })(PatrimonioSaidaListaStatusDestino);