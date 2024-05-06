import React, {useState} from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator, StatusBar, ScrollView } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Badge, List, Modal, Portal, Button, Provider, Searchbar, ToggleButton, Switch, Title } from 'react-native-paper'
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import util from './../../util/util';
import { useNavigation } from '@react-navigation/native';
import { useRoute }                             from '@react-navigation/native';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import LottieAttentionCircle from '../../component/LottieAttentionCircle';
//import OperacaoGaragemSemAtuacao from './OperacaoGaragemSemAtuacao';
//import { filterParamOnibusEmAlerta } from './../../state/OperacaoGaragem/OnibusEmAlertaAction';
//import store from '../../state/store';
//import AppIcon from '/../AppIcon';
//import RNPickerSelect from "react-native-picker-select";
//import { Value } from 'react-native-reanimated';
//import LabelValue from '../LabelValue';

export function OperacaoOOHListaEstabelecimentoScreen(props) {

    const navigation                                = useNavigation();
    const [pageSize, addPageSize]                   = useState(10);
    const {params}                  = useRoute()
    console.log('::: CARAIO :::');
    console.log('::: CARAIO :::');
    console.log('::: CARAIO :::');
    console.log(params);
    //recuperando dados e parametros
    let id_lib_em_alerta = params.params.id_lib_em_alerta;
    let alerta_selecionado = params.params.alerta;
    let id_av = params.params.id_av;
    let av = params.params.av;
    let av_cliente = params.params.av_cliente;
    let lista_alertas = params.params.lista_alertas;
    
    if(id_av == 0) id_av = null;

    let verifica_duplicacao = [];
    let lista_estabelecimentos = [];
    //let lista_estabelecimentos = [{id_estabelecimento: lista_alertas.id_estabelecimento,estabelecimento:lista_alertas.estabelecimento}];
    lista_alertas.map(function(alerta){
        if(alerta.metadata==undefined){
            if(id_av!=null){
                if(alerta.id_lib_em_alerta == id_lib_em_alerta && alerta.av!=null){
                    if(alerta.av.id == id_av){
                        if(!verifica_duplicacao.includes(alerta.id_estabelecimento)){
                            verifica_duplicacao.push(alerta.id_estabelecimento);
                            lista_estabelecimentos.push({id_estabelecimento:alerta.id_estabelecimento, estabelecimento:alerta.estabelecimento, av: av, id_av: id_av, av_cliente: av_cliente, qtd_alertas: 1, lista_alertas:[alerta]})
                        }
                        else{
                            let indice = lista_estabelecimentos.findIndex(element => element.id_estabelecimento == alerta.id_estabelecimento);
                            /* console.log("INDICE DO ITEM:", indice); */
                            lista_estabelecimentos[indice].lista_alertas.push(alerta);
                            lista_estabelecimentos[indice].qtd_alertas++;
                        }
                    } 
                }
            }
            else{
                if(alerta.id_lib_em_alerta == id_lib_em_alerta && alerta.av==null){
                    if(!verifica_duplicacao.includes(alerta.id_estabelecimento)){
                        verifica_duplicacao.push(alerta.id_estabelecimento);
                        lista_estabelecimentos.push({id_estabelecimento:alerta.id_estabelecimento, estabelecimento:alerta.estabelecimento, av: av, id_av: id_av, av_cliente: av_cliente, qtd_alertas: 1, lista_alertas:[alerta]})
                    }
                    else{
                        let indice = lista_estabelecimentos.findIndex(element => element.id_estabelecimento == alerta.id_estabelecimento);
                        /* console.log("INDICE DO ITEM:", indice); */
                        lista_estabelecimentos[indice].lista_alertas.push(alerta);
                        lista_estabelecimentos[indice].qtd_alertas++;
                    }
                }
            }
        } 
    })

    /* console.log("                           __");
    console.log("  .-----------------------'  |");
    console.log(" /| _ .---. .---. .---. .---.|");
    console.log(" |j||||___| |___| |___| |___||");
    console.log(" |=|||=======THIAGOFSF=======|");
    console.log(" [_|j||(O)___________|(O)____]");
    console.log(id_lib_em_alerta);
    console.log(id_av);
    console.log(lista_estabelecimentos); */

    //Futura implementação de filtros? Seguir como exemplo OPERACAOGARAGEMLISTAONIBUS (COMPONENT)
    
    //Função para contar qtd de alertas em cada estabelecimento
    function conta_alertas(id_estabelecimento, array){
        let resultado = 0;
        if(array.lengh>0){
            array.map(function(item){
                if(item.id_estabelecimento == id_estabelecimento){
                    resultado ++;
                }
            })
        }
        return resultado;
    }
    //Função para selecionar um estabelecimento
    function selecionar_estabelecimento(estabelecimento, id_lib_em_alerta, alerta_selecionado){
        navigation.navigate('OperacaoOOHListaPontosScreen', {
            route_params: { 
                id_estabelecimento: estabelecimento.id_estabelecimento,
                estabelecimento: estabelecimento.estabelecimento,
                id_lib_em_alerta: id_lib_em_alerta,
                alerta: alerta_selecionado,
                id_av: estabelecimento.id_av,
                av: estabelecimento.av,
                av_cliente: estabelecimento.av_cliente,
                lista_alertas: estabelecimento.lista_alertas,
            },
        });
    }
     
    //const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    
    //const onToggleSwitch = () => {setIsSwitchOn(!isSwitchOn)}
    
    return (
        <>
        {   
            <>
            <View style={{  }}>
                <View style={{backgroundColor: 'white', borderRadius: 10, alignItems: 'center', paddingHorizontal: 15, paddingVertical: 30, marginBottom:10}}>
                    <View style={{width:100, height:100, borderRadius:100, borderStyle:'solid', borderColor:'#2e2e2e', borderWidth:2, alignItems:'center', justifyContent:'center'}}>
                        <IconFontisto name="direction-sign" size={60} color={'#2e2e2e'} />
                    </View>   
                    <Text style={{fontSize: 18, color:'#2e2e2e', fontWeight: 'bold', paddingTop:10}}>{alerta_selecionado}</Text>
                    {(id_av!=null)?(
                        <Text style={{fontSize: 18, color:'#2e2e2e'}}>
                            AV: {id_av} | {av} | {av_cliente}
                        </Text>
                    ):(<></>)}
                </View>
                {/* POR HORA NENHUM FILTRO SERÁ FUNCIONAL
                <Searchbar
                style={style.pesquisa_onibus}
                placeholder="Filtrar por Número"
                onChangeText={(str) => filtrar_por_numero(str)}
                keyboardType="number-pad"
                />

                <Text style={{fontSize:14, marginBottom:3}} >Ordenar Por:</Text>
                <View style={style.ordena_onibus}>
                    <RNPickerSelect
                        pickerProps={{style : {width: '100%', height:30,}, inputAndroid: {backgroundColor:'white'} }}
                        style={{backgroundColor:'white'}}
                        placeholder={{
                            label: 'Ordenação Padrão',
                            value: null,
                            color: 'black'
                        }}
                        onValueChange={(value) => ordenar_lista(value)}
                        items={[
                            { label: "Ordenar por n° do Carro", value: "numero" },
                            { label: "Carro em alerta a mais tempo", value: "data-desc" },
                            { label: "Carro em alerta a menos tempo", value: "data-asc" },
                        ]}
                    />
                </View>
                

                {/* Por hora o filtro de prioridade ficará desativado
                <View style={{flexDirection:'row-reverse', alignItems:'center'}}>
                    <Switch style={{justifyContent:'center', width:60, height:50}} value={isSwitchOn} color="orange" onValueChange={(onToggleSwitch) => filtrar_prioridade(onToggleSwitch)} />
                    <Text style={{justifyContent:'center'}}>Exibir apenas Carros com Prioridade:</Text>
                </View>*/
                }

                <View style={{paddingHorizontal: 10}}>
                {/*<Title style={{fontSize: 16}}>Estabelecimento:</Title>*/}
                    <View style={{paddingBottom: 290}}>
                        <ScrollView>
                            {(lista_estabelecimentos!=undefined)?(
                                lista_estabelecimentos.map((item,index) => {
                                    return (
                                        <TouchableOpacity key={index.toString()} onPress={() => { selecionar_estabelecimento(item, id_lib_em_alerta, alerta_selecionado) }}>
                                            <List.Item
                                                title={item.estabelecimento}
                                                style={style.listItem}
                                                right={props => 
                                                    (item.qtd_alertas > 0) ?
                                                        <View style={{flexDirection:'row'}}>
                                                            <LottieAttentionCircle>{item.qtd_alertas}</LottieAttentionCircle>
                                                            <Entypo name="chevron-small-right" color="black" style={{alignSelf: 'center', paddingLeft:20}} size={20} />
                                                        </View> : 
                                                        <View style={{flexDirection:'row'}}>
                                                            <Badge style={{alignSelf: "center", backgroundColor: "black"}}>{item.qtd_alertas}</Badge>
                                                            <Entypo name="chevron-small-right" color="black" style={{alignSelf: 'center', paddingLeft:20}} size={20} />
                                                        </View>
                                                }
                                            />                                
                                        </TouchableOpacity>
                                    )
                                })
                            ):(<Text>Sem alertas a exibir</Text>)}
                        </ScrollView>
                    </View>
                </View>
            </View>
            </>
        }
        </>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 25,
        padding: 15,
    },
    onibus_card: {
        padding: 15,
    },
    header: {
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',//'#fafafa',
        //borderBottomWidth: 0.2,
    },
    headerCol: {
        flexDirection: 'column'
    },
    garagem: {
        color: 'black',
        fontSize: 14,
    },
    numero_onibus: {
        fontSize: 37,
        fontWeight: 'bold',
        paddingVertical: 0,
        marginTop : -5,
    },
    header_status: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    badge_status: {
        borderRadius: 5,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        backgroundColor: 'orangered',
        color: 'white'
    },
    badge_prioridade: {
        borderRadius: 5,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        backgroundColor: '#6b0700',
        color: 'white',
        marginRight:5,
    },
    list_item: {
        paddingVertical: 15,
    },
    pesquisa_onibus: {
        height:45,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom:10,
        padding: 0,
        shadowOpacity: 0,
    },
    ordena_onibus:{
        alignItems: "center",
        backgroundColor: 'white',
        padding: 3,
        borderRadius:10, 
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        marginBottom:10,
    },
    botaofiltro:{
        height:40,
        paddingLeft:10,
        paddingRight:10,
        borderRadius:10,
        marginLeft:5,
        marginRight: 5,
    },
    listItem: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 5
    }
});

export default connect(function mapStateToProps(state){ return {state} })(OperacaoOOHListaEstabelecimentoScreen);
