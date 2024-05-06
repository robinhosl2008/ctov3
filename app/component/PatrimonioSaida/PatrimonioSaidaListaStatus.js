import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { List, Badge } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import store from './../../state/store';
import { envioPatrimonioAddStatusInicio } from './../../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import PatrimonioSaidaSelecionarStatusDestinoScreen from './../../screen/Patrimonio/PatrimonioSaidaSelecionarStatusDestinoScreen';

function PatrimonioSaidaListaStatus(props) {

    const navigation        = useNavigation();
    let arr_status_qtd      = props.state.patrimonio_recebido.arr_status_qtd;

    function selecionar_status_inicio(item){

        // Armazena o ID do Status inicial
        store.dispatch(envioPatrimonioAddStatusInicio({id_status_inicio: item.id, status_inicio: item.nome}));

        // Exibe a screen para o usuário selecionar o status de destino
        navigation.navigate('PatrimonioSaidaSelecionarStatusDestinoScreen'); 

    }

    return (
        <View>
            {
                arr_status_qtd.map((item) => {
                    if (item.total_recebido > 0){
                        return (
                            <TouchableOpacity onPress={() => { selecionar_status_inicio(item); }} key={item.id}> 
                                <List.Item 
                                    style={{backgroundColor: 'white', borderRadius: 10, marginVertical: 5}}  
                                    title={item.nome}
                                    left={props => <List.Icon {...props} icon="folder" color="darkorange" />}
                                    right={ props => 
                                        <View style={{flexDirection: 'row'}}>
                                            <Badge size={30} style={{alignSelf: 'center', marginEnd: 15}}>{item.total_recebido}</Badge> 
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

export default connect(function mapStateToProps(state){ return {state} })(PatrimonioSaidaListaStatus);