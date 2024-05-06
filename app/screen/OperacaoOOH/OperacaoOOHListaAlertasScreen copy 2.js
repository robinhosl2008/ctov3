import React, { useEffect } from 'react'
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
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';
import util from '../../util/util';
import Loader from '../../component/Loader';

function OperacaoOOHListaAlertasScreen(props) {

    const [is_loading, setLoading]                              = useState(true);

    const [arr_alertas, setArrAlertas]                          = useState([]);
    const [alerta_loaded, setAlertaLoaded]                      = useState(false);
    const [filtro_atuacao, setFiltroAtuacao]                    = useState([]);
    const [filtro_loaded, setFiltroLoaded]                      = useState(false);
    const [lista_alertas, setListaAlertas]                      = useState([]);
    const [lista_loaded, setListaLoaded]                        = useState(false);
    const [temp_av, setTempAv]                                  = useState(false);
    const [loaded, setLoaded]                                   = useState(false);

    //Função que processa os dados necessarios
    async function processar_dados(){
        try{
            definir_arr_alertas();
            definir_arr_filtro_atuacao();
        }
        catch{}
        finally{
            try{
                //Mapear alertas filtrando-os
                (alerta_loaded && filtro_loaded)?(mapeia_alertas()):(<></>);
            }
            catch{}
            finally{
                console.log("                           __");
                console.log("  .-----------------------'  |");
                console.log(" /| _ .---. .---. .---. .---.|");
                console.log(" |j||||___| |___| |___| |___||");
                console.log(" |=|||=======THIAGOFSF=======|");
                console.log(" [_|j||(O)___________|(O)____]");
                console.log("TODAS AS VARIAVEIS DEFINIDAS?");
                console.log(arr_alertas);
                console.log(filtro_atuacao);
                console.log(lista_alertas);
                if (lista_loaded){
                    setLoaded(true);
                    setLoading(false);
                }
            }
        }
    }

    //Função que define o arr_alertas recuperando do firestore
    async function definir_arr_alertas(){
        let resposta = [];
        const alertas = await firestore().collection('cto-ooh-em-alerta').get()
        alertas._docs.map(function(item){
            resposta.push(item._data);
        });
        setArrAlertas(resposta);
        setAlertaLoaded(true);
    }
    //FUnção que define o arr_filtro_atuacao recuperando do firestore
    async function definir_arr_filtro_atuacao(){
        try{
            const filtro = await firestore().collection('cto-library').doc('funcionario-filtro-atuacao').get();
            const arr_filtro = util.obj_to_array(filtro._data);
            let id = props.state.app.user_auth.id;
            let resposta = mapear_filtro_atuacao(arr_filtro, id);
            setFiltroAtuacao(resposta);
            setFiltroLoaded(true);
        }catch(err){
            console.log('Erro:', err);
        }
        
    }
    //Função aux para mapear resposta do filtro_atuacao
    function mapear_filtro_atuacao(lista, id_funcionario){
        let resposta = []
        lista.map(function(item){ 
            //console.log(item.id_funcionario);
            if(item.id_funcionario == id_funcionario){
                resposta.push(item.id_lib_em_alerta);
            } 
        });
        return resposta;  
    }
    //Função aux que mapeia lista de alertas e filtra, gerando a lista final a exibir
    function mapeia_alertas(){
        //Definir Lista de Alertas
        //variaveis de controle
        let verifica_duplicacao = [];
        let lista_alertas_temp = [];
        //varrer lista de pontos em alertas obtendo alertas
        arr_alertas.map(function(alerta){
                if(alerta.metadata==undefined){
                    //se o funcionario pode atuar
                    if(filtro_atuacao.includes(alerta.id_lib_em_alerta)){
                        //se existe av no alerta, define temp_av como verdadeiro
                        if(alerta.av!=null){
                            setTempAv(true);
                        }
                        //Se o id verificado não estiver na lista de verificar duplicadas, inclui um objeto na  lista de alertas e inclui o id na lista de verificacao
                        if(!verifica_duplicacao.includes(alerta.id_lib_em_alerta)){
                            let temp_alerta = {id_lib_em_alerta: alerta.id_lib_em_alerta, av: temp_av, alerta:  alerta.alerta}
                            lista_alertas_temp.push(temp_alerta);
                            verifica_duplicacao.push(alerta.id_lib_em_alerta);
                        }
                        //mesmo que um alerta esteja na lista de verificação, verifica se o temp av é verdadeiro e o av do alerta na lista é falso, nesse caso altera essa propriedade
                        else if(temp_av && !lista_alertas_temp[verifica_duplicacao.indexOf(alerta.id_lib_em_alerta)].av )    {
                            lista_alertas_temp[verifica_duplicacao.indexOf(alerta.id_lib_em_alerta)].av = temp_av;
                        }
                    }
                }
                else{
                    console.log('ENCONTROU ALERTA COM METADATA');
                }
            })
        //DEFINIR LISTA FINAL NAS CONSTANTES
        setListaAlertas(lista_alertas_temp);
        console.log("ACABOU A FUNÇÃO DEIFNIR LISTA ALERTAS")
        setListaLoaded(true);
    }
    
    //let arr_alertas_ooh = definir_arr_alertas();
    //let filtro_atuacao = definir_arr_filtro_atuacao();
    if(loaded==false){
        console.log("LOADED: "+loaded);
        processar_dados();   
    }

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
            {(is_loading==true)?(
                <Loader is_loading={is_loading}></Loader>
            ):(
                <View>
                
                <View style={{backgroundColor: 'white', borderRadius: 10, alignItems: 'center', paddingBottom: 15}}>
                    <LottieSign />
                    <Text style={{fontSize: 20}}>Operação OOH</Text>
                </View>
                <View style={style.container}>
                    <Title>Selecione o Alerta:</Title>
                    <View style={{paddingBottom: 290}}>
                        <ScrollView>
                        {(lista_alertas!=undefined && !is_loading)?(
                            lista_alertas.map(item => {
                                return (
                                    <TouchableOpacity key={item.id_lib_em_alerta} onPress={() => {  selecionar_alerta(item) }}>
                                        <List.Item
                                            title={item.alerta}
                                            //description={item.observacao}
                                            style={style.listItem}
                                            right={props => <Entypo name="chevron-small-right" color="black"    style={{alignSelf: 'center'}} size={20} />}
                                        />                                
                                    </TouchableOpacity>
                                )
                            })
                        ):(<Text>Sem alertas a exibir</Text>)}
                        </ScrollView>
                    </View>
                </View>
        
                </View>
            )}
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

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              