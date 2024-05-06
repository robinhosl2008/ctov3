import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import Title from './../Title';
import { connect } from 'react-redux';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { delFilterParamOnibusEmAlerta, filterParamOnibusEmAlerta } from './../../state/OperacaoGaragem/OnibusEmAlertaAction';
import OperacaoGaragemListaOnibusScreen from '../../screen/OperacaoGaragem/OperacaoGaragemListaOnibusScreen';
import store from './../../state/store';
import EmpresaOnibusFuncionarioService from '../../service/EmpresaOnibusFuncionarioService';
import Loader from '../Loader';
import { useState } from 'react';

function OperacaoGaragemSelecionarGaragem(props) {
    
    //constantes de controle
    const [load_data, setLoadData]                              = useState(false);
    const [arr_empresa_onibus_funcionario, setArrEmpresa]       = useState([]);

    const navigation = useNavigation();
    
    //Função Assíncrona que carrega os dados
    async function listar_empresa_onibus_funcionario(){
        //aguardar carregamento do service
        let arr_empresa_onibus_funcionario = await EmpresaOnibusFuncionarioService.listar_empresa_onibus_funcionario();
        //definir a constante
        setArrEmpresa(arr_empresa_onibus_funcionario);
        //setar load_data para true (evitando loops de carregamento desnecessários)
        setLoadData(true);
    }

    //Se load_data não estiver definido, realizar carregamento
    if(!load_data){
        listar_empresa_onibus_funcionario();
    }

    //Função que seleciona a garagem
    function selecionar_garagem(item){
        //navegar passando nome da garagem como parâmetro
        navigation.navigate('OperacaoGaragemListaOnibusScreen', {
            screen: 'OperacaoGaragemListaOnibusScreen',
            params: { 
                id_empresa_onibus: item.id_empresa_onibus,
            },
        });

        //FUNÇÕES QUE USAM O REDUX
        /*
        // Limpar possiveis filtros salvos
        store.dispatch(delFilterParamOnibusEmAlerta())
        // Filtra os onibus pela garagem selecionada
        store.dispatch(filterParamOnibusEmAlerta({id_empresa_onibus: item.id_empresa_onibus})); 

        // Exibe a tela com os onibus já filtrados
        navigation.navigate('OperacaoGaragemListaOnibusScreen');
        */

    }

    //Retorno, se load_data carrega a tela, se não, exibir componente de loading
    return (
        <View style={style.container}>
            {(load_data)?(
                <View>
                    <Title>Selecione a Garagem de atuação:</Title>
                    <View style={{paddingBottom: 290}}>
                        <ScrollView>
                        {
                            (arr_empresa_onibus_funcionario.length>0)?(
                                arr_empresa_onibus_funcionario.map(item => {
                                    return (
                                        <TouchableOpacity key={item.id_empresa_onibus} onPress={() => { selecionar_garagem(item) }}>
                                            <List.Item
                                                title={item.nomeFantasia}
                                                description={item.razaoSocial}
                                                style={style.listItem}
                                                right={props => <Entypo name="chevron-small-right" color="black" style={{alignSelf: 'center'}} size={20} />}
                                            />                                
                                        </TouchableOpacity>
                                    )
                                })
                            ):(
                                <Text>Nenhuma Garagem Disponível</Text>
                            )
                            
                        }
                        </ScrollView>
                    </View>
                </View>
            ):(
                <Loader></Loader>
            )}
            
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        marginTop: 30,
    },
    listItem: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 5
    }
});

export default connect(function mapStateToProps(state){ return {state} })(OperacaoGaragemSelecionarGaragem);