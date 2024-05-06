import React from 'react'
import { View, Text, Alert, StyleSheet } from 'react-native'
import { List } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import Title from '../../component/Title';
import { connect } from 'react-redux';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import OperacaoGaragemSelecionarGaragem from '../../component/OperacaoGaragem/OperacaoGaragemSelecionarGaragem';
import Screen from '../../component/Screen';
import LottieSign from '../../component/LottieSign';
import store from './../../state/store';
import { indexOf } from 'underscore';
function OperacaoOOHListaAlertasScreen(props) {

    

    let arr_alertas_ooh = props.state.ooh_pontos_em_alerta.pontos_em_alerta;
    let lib_em_alerta = props.state.lib.lib_em_alerta;
    let filtro_atuacao = props.state.onibus_em_alerta.arr_filtro_atuacao;
    
    let verifica_duplicacao = [];
    let lista_alertas = [];
    
    //varrer lista de pontos em alertas obtendo alertas
    arr_alertas_ooh.map(function(alerta){
        if(alerta.metadata==undefined){
            //se o funcionario pode atuar
            if(filtro_atuacao.includes(alerta.id_lib_em_alerta)){
                //define av como falso
                let temp_av = false;
                //se existe av no alerta, define como verdadeiro
                if(alerta.av!=null){
                    temp_av = true;
                }
                //Se o id verificado não estiver na lista de verificar duplicadas, inclui um objeto na lista de alertas e inclui o id na lista de verificacao
                if(!verifica_duplicacao.includes(alerta.id_lib_em_alerta)){
                    let temp_alerta = {id_lib_em_alerta: alerta.id_lib_em_alerta, av: temp_av, alerta: alerta.alerta}
                    lista_alertas.push(temp_alerta);
                    verifica_duplicacao.push(alerta.id_lib_em_alerta);
                }
                //mesmo que um alerta esteja na lista de verificação, verifica se o temp av é verdadeiro e o av do alerta na lista é falso, nesse caso altera essa propriedade
                else if(temp_av && !lista_alertas[verifica_duplicacao.indexOf(alerta.id_lib_em_alerta)].av ){
                    lista_alertas[verifica_duplicacao.indexOf(alerta.id_lib_em_alerta)].av = temp_av;
                }
            }
        }
        else{
            console.log('ENCONTROU ALERTA COM METADATA');
        }
    })

    console.log("                           __");
    console.log("  .-----------------------'  |");
    console.log(" /| _ .---. .---. .---. .---.|");
    console.log(" |j||||___| |___| |___| |___||");
    console.log(" |=|||=======THIAGOFSF=======|");
    console.log(" [_|j||(O)___________|(O)____]");
    console.log(props.state.onibus_em_alerta.arr_filtro_atuacao);
    console.log(lista_alertas);

    const navigation = useNavigation();

    function selecionar_alerta(item){

        if(item.av){
            navigation.navigate('OperacaoOOHListaAVScreen',{
                params: {id_lib_em_alerta: item.id_lib_em_alerta, alerta: item.alerta,}
            })
        }
        else{
            navigation.navigate('OperacaoOOHListaEstabelecimentoScreen', {
                params: {id_lib_em_alerta: item.id_lib_em_alerta, alerta: item.alerta, id_av: null, av: null},
            });
        }
        // Limpar possiveis filtros salvos
        //store.dispatch(delFilterParamOnibusEmAlerta())
        // Filtra os onibus pela garagem selecionada
        //store.dispatch(filterParamOnibusEmAlerta({id_empresa_onibus: item.id_empresa_onibus})); 

        // Exibe a tela com os onibus já filtrados
        //navigation.navigate('OperacaoGaragemListaOnibusScreen');
    }

    return (
        <Screen>
            <View style={{backgroundColor: 'white', borderRadius: 10, alignItems: 'center', paddingBottom: 15}}>
                <LottieSign />
                <Text style={{fontSize: 20}}>Operação OOH</Text>
            </View>
            <View style={style.container}>
                <Title>Selecione o Alerta:</Title>
                <View style={{paddingBottom: 290}}>
                    <ScrollView>
                    {(lista_alertas!=undefined)?(
                        lista_alertas.map(item => {
                            return (
                                <TouchableOpacity key={item.id_lib_em_alerta} onPress={() => { selecionar_alerta(item) }}>
                                    <List.Item
                                        title={item.alerta}
                                        //description={item.observacao}
                                        style={style.listItem}
                                        right={props => <Entypo name="chevron-small-right" color="black" style={{alignSelf: 'center'}} size={20} />}
                                    />                                
                                </TouchableOpacity>
                            )
                        })
                    ):(<Text>Sem alertas a exibir</Text>)}
                    </ScrollView>
                </View>
            </View>
        </Screen>   
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

//export default OperacaoOOHListaAlertasScreen;
export default connect(function mapStateToProps(state){ return {state} })(OperacaoOOHListaAlertasScreen);

/*
return (
        <Screen>
            <View style={{backgroundColor: 'white', borderRadius: 10, alignItems: 'center', paddingBottom: 15}}>
                <LottieSign />
                <Text style={{fontSize: 20}}>Operação OOH</Text>
            </View>
            <OperacaoGaragemSelecionarGaragem />
        </Screen>
    )
*/

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              