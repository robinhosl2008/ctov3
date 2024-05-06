import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator, StatusBar, ScrollView } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Badge, List, Modal, Portal, Button, Provider, Searchbar, ToggleButton, Switch, Title, Card, Avatar, Paragraph } from 'react-native-paper'
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect, useSelector } from 'react-redux';
import util from './../../util/util';
import { useNavigation } from '@react-navigation/native';
import { useRoute, useIsFocused }                             from '@react-navigation/native';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import ApiService from '../../service/ApiService'; 
import OperacaoOOHService from '../../service/OperacaoOOHService';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
//import OperacaoGaragemSemAtuacao from './OperacaoGaragemSemAtuacao';
//import { filterParamOnibusEmAlerta } from './../../state/OperacaoGaragem/OnibusEmAlertaAction';
//import store from '../../state/store';
//import AppIcon from '/../AppIcon';
//import RNPickerSelect from "react-native-picker-select"; 
//import { Value } from 'react-native-reanimated';
//import LabelValue from '../LabelValue'; 
 
export function OperacaoOOHListaPontosScreen(props) { 

    const isFocused                                 = useIsFocused(); 
    const navigation                                = useNavigation();
    const [pageSize, addPageSize]                   = useState(10); 
    //const [arr_alertas_ooh,setArrAlertas]           = useState([]);
    const arr_alertas_ooh = useSelector(state => state.ooh_pontos_em_alerta.pontos_em_alerta);
    //recuperando parametros 
    const {params}                  = useRoute();
    //let arr_alertas_ooh = params.params.lista_alertas; 
    let alerta_selecionado = (params.route_params.alerta) ? params.route_params.alerta : null; 
    //let filtro_atuacao = props.state.onibus_em_alerta.arr_filtro_atuacao;
    let estabelecimento = params.route_params.estabelecimento;
    let id_estabelecimento = params.route_params.id_estabelecimento;
    let id_av = params.route_params.id_av;
    let av = params.route_params.av;
    let av_cliente = params.route_params.av_cliente;
    let id_produto = params.route_params.id_produto;
    let produto = params.route_params.produto;
    let id_lib_em_alerta = params.route_params.id_lib_em_alerta;
    //let vetor = params.route_params.vetor;
    const [img_ponto, setImgPonto]                          = useState(null);

    
    // //Checa se o alerta selecionado faz parte da lista de atuações
    // // let id_lib_alerta_check = 0;
    // // if(filtro_atuacao.includes(id_lib_em_alerta)){
    // //     id_lib_alerta_check = id_lib_em_alerta; 
    // // }
     
    //Filtrar array por lib_alerta e estabelecimento  
    const [img_array, setImgArray]                          = useState([]);  
    const [lista_alertas_filtrados,setAlertasFiltrados]     = useState([]);
      
    
    function configurar() {
        let alertas_filtrados_temp = [];
        if(id_av!=null){
            arr_alertas_ooh.map(function(alerta){
                //if(alerta.metadata==undefined){
                    if(alerta.av!=null){
                        if(alerta.id_lib_em_alerta == id_lib_em_alerta && alerta.id_estabelecimento == id_estabelecimento){
                            alertas_filtrados_temp.push(alerta); 
                        }
                    }
                //}
            })
        } else {
                arr_alertas_ooh.map((alerta) => {
                    //if(alerta.metadata == undefined){
                        if(alerta.id_lib_em_alerta == id_lib_em_alerta && alerta.id_estabelecimento == id_estabelecimento){
                            alertas_filtrados_temp.push(alerta);
                        }
                    //} 
                }) 

        }

        
        let img_array_temp = [];
        alertas_filtrados_temp.forEach(function(item){ 
            
            ApiService.get("cto/render-s3-image", {id_ooh_estabelecimento_ponto: item.id_ooh_estabelecimento_ponto})
            .then(response => { 
                         
                 //let index = img_array_temp.findIndex(elm => elm.id == item.id_ooh_ponto_em_alerta);
                 //if(index < 0){
                     img_array_temp.push({id: item.id_ooh_ponto_em_alerta, img: response.data.dados.img_url});
                //  } else { 
                //      img_array_temp[index]['img'] = response.data.dados.img_url;    
                //  }

                 if(img_array_temp.length == alertas_filtrados_temp.length){
                     setImgArray(img_array_temp)
                 }


            }).catch(err => {  
                console.log(err)  
            }); 

        });

        alertas_filtrados_temp.forEach((e) => {
            // console.log(':: EXIBIR ::');
            // console.log(':: EXIBIR ::');
            // console.log(':: EXIBIR ::');
            console.log(e);
        })

        setAlertasFiltrados(alertas_filtrados_temp); 
        
    }

    useEffect(() => {  
        //Função para carregar as imagens
        configurar();
    },[])

    // // console.log("                           __");
    // // console.log("  .-----------------------'  |"); 
    // // console.log(" /| _ .---. .---. .---. .---.|"); 
    // // console.log(" |j||||___| |___| |___| |___||");
    // // console.log(" |=|||====== LEANDRO ========|");
    // // console.log(" [_|j||(O)___________|(O)____]");
    // // console.log(arr_alertas_ooh);

    // // console.log("                           __");
    // // console.log("  .-----------------------'  |");
    // // console.log(" /| _ .---. .---. .---. .---.|");
    // // console.log(" |j||||___| |___| |___| |___||"); 
    // // console.log(" |=|||====== LEANDRO ========|");
    // // console.log(" [_|j||(O)___________|(O)____]");
    // // console.log("ARRAY DE IMAGENS DEVERIA ESTAR DEFINIDO AQUI:",img_array);
    // //console.log("id_lib_alerta:",id_lib_em_alerta);
    // //console.log("Alerta Selecionado:",alerta_selecionado);
    // //console.log(id_lib_alerta_check);
    // /* console.log("LISTA DE ALERTAS FILTRADOS: " + lista_alertas_filtrados); */

    // //Futura implementação de filtros? Seguir como exemplo OPERACAOGARAGEMLISTAONIBUS (COMPONENT)
    
    // //Função para selecionar um ponto para atuacao
    function selecionar_ponto(item, id_lib_em_alerta, alerta_selecionado){
        navigation.navigate('OperacaoOOHAlertaAtuacaoScreen', {
            params: { 
                id_ooh_ponto_em_alerta: item.id_ooh_ponto_em_alerta,
                id_estabelecimento: item.id_estabelecimento,
                estabelecimento: item.estabelecimento,
                id_lib_em_alerta: id_lib_em_alerta,
                alerta: alerta_selecionado,
                id_av: item.id_av,
                av: item.av,
            },
        });
    }
     
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    
    const onToggleSwitch = () => {setIsSwitchOn(!isSwitchOn)}
    
    // let imgglobal = []; 

    // //Função que recupera a resposta da API e retorna apenas a imagem
    // function getImg(_id_ooh_estabelecimento_ponto) {
    //     return ApiService.get("cto/render-s3-image", {id_ooh_estabelecimento_ponto: _id_ooh_estabelecimento_ponto}) .then(function(res){
    //         // console.info(JSON.stringify(res, null, 4));
    //         // console.info(`BUSCANDO IMAGEM DO PONTO OOH ID: ${id_ooh_estabelecimento_ponto}`);
    //         // console.info(`URL IMAGEM: ${res.data.dados.img_url}`);
    //         return res.data.dados.img_url;
    //     }).catch(function(e){
    //         console.log("Promessa Rejeitada: " + e); 
    //     }); 
    // }
    // //função que lista as imagens (no componente useEffect)
    // function lista_img(item){ 
    //     try{
    //         getImg(item.id_ooh_estabelecimento_ponto).then(function(img){    
    //             const arr = [...img_array];
    //             let index = arr.findIndex(x => x.id === item.id_ooh_ponto_em_alerta);
    //             if(index < 0){
    //                 arr.push({ id: item.id_ooh_ponto_em_alerta, img: null});
    //             } else { 
    //                 arr[index].img = img; 
    //             }
    //             setImgArray(arr); 
    //             //console.log(JSON.stringify(imgglobal));       
    //         }).catch(function(e){
    //             console.log("Promessa Rejeitada: " + e);
    //         }); 
    //     }catch(e){ 
    //         console.log("DEU ERRO: " + e);  
    //     }
    // } 
    
    // //carregar item lista ponto   
    function render_item_ponto(item,_index){ 
        //definir index do item atual na lista de imagens
        let index = img_array.findIndex(x => x.id === item.id_ooh_ponto_em_alerta);
        //retornar item
        return( 
            <TouchableOpacity style={{marginTop:20, backgroundColor:'#fff', borderWidth: 2, borderColor:'#E1D1D1', borderRadius:5,}} key={_index} onPress={() => { selecionar_ponto(item, id_lib_em_alerta, alerta_selecionado) }}>
                <Card>
                    <Card.Content>
                        <Paragraph>{item.id_ooh_estabelecimento_ponto} | {item.produto}</Paragraph>
                        <View style={style.header}>
                            <View style={style.headerCol}>
                                    <Text style={style.garagem}>{item.estabelecimento}</Text>
                                    {/* <Text style={style.numero_onibus}>{item.id_ooh_estabelecimento_ponto} | {item.nome_campanha}</Text> */}
                                    {item.prioridade == '1' ? <><Badge style={[style.badge_prioridade]}>PRIORIDADE</Badge></> : <></> }
                            </View>
                            <View style={style.headerCol}>
                                <View style={style.header_status}>
                                    <Badge style={[style.badge_status]}>EM ALERTA</Badge>
                                    <Text style={{paddingHorizontal: 5}}>|</Text>
                                    <Text style={{fontSize: 12, fontWeight: 'bold'}}>{(item.em_alerta_at) ? util.diff_in_days(item.em_alerta_at) + " dia(s)" : "Tempo Indefinido"}</Text>
                                </View>  
                            </View>
                        </View>
                    </Card.Content>
                    <Card.Cover style={{borderRadius:5}} source={(img_array[index] != undefined && img_array[index].img != null)?({uri: `${img_array[index].img }`}):(require('./../../assets/image/foto-img-sem-conexao.png'))} />
                </Card>                   
            </TouchableOpacity>
        );
    }

    return (
        <>
        {     
            <>
            <ScrollView style={{ }}>
                <View style={{backgroundColor: 'white', borderRadius: 10, alignItems: 'center', paddingHorizontal: 15, paddingVertical: 30, marginBottom:10}}>
                    <View>
                        {/* <IconFontisto name="direction-sign" size={60} color={'#2e2e2e'} /> */}
                        <FontAwesome5 name="tools" size={60} color="gray"/> 
                    </View>  
                    <Text style={{fontSize: 20, color:'gray', fontWeight: 'bold',fontWeight:'bold', paddingTop:10}}>{alerta_selecionado}</Text> 
                    {
                    (id_av!=null)?( 
                        <Text style={{fontSize: 16, color:'#2e2e2e'}}>
                            AV: {id_av} | {av} 
                        </Text>
                    ):(<></>)
                    }
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

                <View style={{paddingTop:15, paddingHorizontal: 10}}>
                    {/*<Title style={{fontSize: 16}}>Pontos:</Title>*/}
                    <View style={{paddingBottom: 290}}>
                            {(lista_alertas_filtrados!=undefined)?(
                                lista_alertas_filtrados.map((item,index) => {
                                    return render_item_ponto(item,index) 
                                })
                            ):(<Text>Sem alertas a exibir</Text>)} 
                    </View>   
                </View>
            </ScrollView>  
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
        paddingBottom:10,
        //borderBottomWidth: 0.2,
    },
    headerCol: {
        flexDirection: 'column'
    },
    garagem: {
        color: 'black',
        fontSize: 16,
        fontWeight:'bold',
        marginBottom:5, 
    },
    numero_onibus: {
        fontSize: 16,
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

export default connect(function mapStateToProps(state){ return {state} })(OperacaoOOHListaPontosScreen);
