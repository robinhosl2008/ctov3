import React, { useEffect, useState } from 'react';
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



export const Template = ({arr_ooh_em_alerta}) => {
    const [aba_av,setAbaAvs] = useState({ av: true, ponto: false });
    const [aba_produtos,setAbaProdutos] = useState({ produto: true, ponto: false });
    const [AVs,setAVs] = useState([]);
    const [produtos,setProdutos] = useState([]);
    const [pontos,setPontos] = useState([]);
    const [loading,setLoading] = useState(false);
    const navigation = useNavigation();
    const [r_params,setRouteParams] = useState([]);
    const { params } = useRoute();

    let av = params.route_params.av;
    let id_produto = params.route_params.id_produto;
    let id_ooh_ponto_em_alerta = params.route_params.id_ooh_ponto_em_alerta;
    let id_estabelecimento = params.route_params.id_estabelecimento;
    let id_lib_em_alerta = params.route_params.id_lib_em_alerta;
    let title = (params.route_params.title) ? params.route_params.title : null;
    let has_av  = (av != null) ? true : false;
    
    
    
    //Função para muda a aba
   function mudarAba(option){
            if(has_av){
                setAbaAvs((prevState) => {
                    if(option == 'av'){
                        return { av: true, ponto: false} 
                    } else {
                        return { av: false , ponto: true }
                    }
                })
            } else {
                setAbaProdutos((prevState) => {
                    if(option == 'produto'){
                        return { produto: true, ponto: false} 
                    } else {
                        return { produto: false , ponto: true }
                    }
                })
            }    
    }

     //Função para filtrar as opções
     function filtrar_resultados(aba,value){
        if(aba == 'av'){
            let newArrayAVs = AVs.filter((elm) => elm.alerta.includes(value));
            setAlertas(newArrayAVs);
        }else if(aba == 'pontos'){
            let newArrayPontos = pontos.filter((elm) => elm.includes(value));
            setPontos(newArrayPontos);
        }
    }
    
    //Funções de ajuste
    let _arr_pontos = [];
    let _arr_produtos = [];
    let _arr_avs = [];
        //Ajusta os pontos
        function organizar_pontos(response){
            response.forEach((data) => {
                let i_ponto = _arr_pontos.findIndex(obj => obj.id_estabelecimento == data.id_estabelecimento);
        
                if(i_ponto >= 0){
                    _arr_pontos[i_ponto]['arr_pontos'].push(data);
                } else {
                    _arr_pontos.push({
                        produto: data.produto,
                        id_produto: data.id_produto,
                        alerta: data.alerta,
                        id_lib_em_alerta: data.id_lib_em_alerta,
                        id_estabelecimento: data.id_estabelecimento,
                        estabelecimento: data.estabelecimento,
                        id_ooh_estabelecimento_ponto: data.id_ooh_estabelecimento_ponto,
                        id_ooh_ponto_em_alerta: data.id_ooh_ponto_em_alerta,
                        id_av: (data.av != null) ? data.av.id : null,
                        av: (data.av != null) ? data.av : null,
                        arr_pontos:[data]
                    })
                }
            });
            setPontos(_arr_pontos);
            


        }
        //Ajusta os produtos
        function organizar_produtos(response){
            let _r_params = []; 
            response.forEach((data) => {
                let i_produto = _arr_produtos.findIndex(obj => obj.produto == data.produto);
        
                if(i_produto >= 0){
                    _arr_produtos[i_produto]['arr_produtos'].push(data);
                } else {
                    _arr_produtos.push({
                        produto: data.produto,
                        id_produto: data.id_produto,
                        alerta: data.alerta,
                        id_lib_em_alerta: data.id_lib_em_alerta,
                        id_estabelecimento: data.id_estabelecimento,
                        estabelecimento: data.estabelecimento,
                        id_ooh_estabelecimento_ponto: data.id_ooh_estabelecimento_ponto,
                        id_ooh_ponto_em_alerta: data.id_ooh_ponto_em_alerta,
                        id_av: (data.av != null) ? data.av.id : null,
                        av: (data.av != null) ? data.av : null,
                        arr_produtos:[data]
                    })
                }
            });
            _arr_produtos.forEach((elm) => {
                _r_params.push(elm['arr_produtos']);
            })

            setRouteParams(_r_params);
            setProdutos(_arr_produtos);
        }
         //Ajusta as AVs
         function organizar_avs(response){
            response.forEach((data) => {
                if(data.av){
                    let i_av = _arr_avs.findIndex(obj => obj.id_av == data.av.id);
            
                    if(i_av >= 0){
                        _arr_avs[i_av]['arr_avs'].push(data);
                    } else {
                        _arr_avs.push({
                            id_av: data.av.id,
                            nome_campanha: data.av.nome_campanha, 
                            alerta: data.alerta,
                            id_lib_em_alerta: data.id_lib_em_alerta,
                            id_estabelecimento: data.id_estabelecimento,
                            estabelecimento: data.estabelecimento,
                            id_ooh_estabelecimento_ponto: data.id_ooh_estabelecimento_ponto,
                            id_ooh_ponto_em_alerta: data.id_ooh_ponto_em_alerta,
                            av: data.av,
                            arr_avs: [data]
                        })
                    }
                    setAVs(_arr_avs);
                }
            });
        }

    useEffect(() => {
        OperacaoOOHService.listar_alerta_para_atuacao({ "id_lib_em_alerta": id_lib_em_alerta})
        .then(response => {

            organizar_pontos(response);
            organizar_produtos(response);
            organizar_avs(response);
            
        }).catch(err => {
            console.log('Houve um erro na importação');
            console.log(err);
        })
    },[])


    return(
        <>
            {
                (has_av) 
                ?
                (aba_av.av) 
                    ? 
                    <> 
                    <View style={{display:'flex',flexDirection:'column',height:150,width:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'white'}}>
                            <FontAwesome5 name="tools" size={50} color="gray"/> 
                            <Text style={styles.alertaTitle}>{title}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View style={styles.alertaContainer}>
                            <View style={styles.filtroOptions}>
                                <TouchableOpacity activeOpacity={0.6} onPress={() => mudarAba('av')} style={styles.option}>
                                    <FontAwesome name="file" size={30} color={ aba_av.av ? 'gray' : 'lightgray' } />
                                    <Text style={{color: aba_av.av ? 'gray' : 'lightgray'}}>AVs</Text>     
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.6} onPress={() => mudarAba('pontos')} style={styles.option}>
                                    <Ionicons name="location-sharp" size={30} color={aba_av.ponto ? 'gray' : 'lightgray'}/>
                                    <Text style={{color: aba_av.ponto ? 'gray' : 'lightgray'}}>Ponto</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput left={<TextInput.Icon name="magnify" size={30} color="gray" />} onChangeText={(value) => filtrar_resultados('alertas',value)}  placeholder="Filtrar avs..." style={styles.filtroInput}/>

                        </View>
                    </TouchableWithoutFeedback>
                    {
                    (loading) 
                        ? <Loader/>
                        : <FlatList
                            data={AVs}
                            renderItem={({item}) => { 
                                let _route_params = {
                                    alerta: item.alerta,
                                    id_lib_em_alerta: item.id_lib_em_alerta,
                                    arr_avs: item.arr_avs
                                }

                                return (<Infotape touchEvent={true} targetScreen="OperacaoOOHListaAVScreen" route_params={_route_params} label={item.id_av} sublabel={item.nome_campanha} badge={item.arr_avs.length} />) 
                            }}
                            keyExtractor={(item,index) => { return index.toString() }} 
                        />
                    }
                    </>
                    : 
                    <>
                    <View style={{display:'flex',flexDirection:'column',height:150,width:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'white'}}>
                            <FontAwesome5 name="tools" size={50} color="gray"/> 
                            <Text style={styles.alertaTitle}>{title}</Text>
                        </View>
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={styles.alertaContainer}>
                        <Text style={styles.filtroTitle}>Filtrar por:</Text> 
                        <View style={styles.filtroOptions}>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => mudarAba('av')} style={styles.option}>
                                <FontAwesome name="file" size={30} color={ aba_av.av ? 'gray' : 'lightgray' } />
                                <Text style={{color: aba_av.av ? 'gray' : 'lightgray'}}>AVs</Text>     
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => mudarAba('pontos')} style={styles.option}>
                                <Ionicons name="location-sharp" size={30} color={aba_av.ponto ? 'gray' : 'lightgray'}/>
                                <Text style={{color: aba_av.ponto ? 'gray' : 'lightgray'}}>Ponto</Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput left={<TextInput.Icon name="magnify" size={30} color="gray" />} onChangeText={(value) => filtrar_resultados('alertas',value)}  placeholder="Filtrar pontos..." style={styles.filtroInput}/>
                    </View>
                </TouchableWithoutFeedback>
                {
                    (loading) 
                        ? <Loader/>
                        : <FlatList
                            data={pontos}
                            renderItem={({item}) => { 
                                let _route_params = {
                                    alerta: item.alerta, 
                                    id_lib_em_alerta: item.id_lib_em_alerta,
                                    estabelecimento: item.estabelecimento,  
                                    id_ooh_estabelecimento_ponto: item.id_ooh_estabelecimento_ponto,
                                    id_ooh_ponto_em_alerta: item.id_ooh_ponto_em_alerta,            
                                    vetor: 'avs'  
                                }

                                return (<Infotape  touchEvent={true}  targetScreen="OperacaoOOHListaPontosScreen" route_params={_route_params} label={item.estabelecimento} badge={item.arr_pontos.length} />) 
                            }}
                            keyExtractor={(item,index) => { return index.toString() }} 
                        />
                    } 
                </>
                :   
                    
                    (aba_produtos.produto)
                        ? 
                        <>
                        <View style={styles.titleContainer}>
                            <FontAwesome5 name="tools" size={50} color="gray"/> 
                            <Text style={styles.alertaTitle}>{title}</Text>
                        </View>
                        {
                        (   loading) 
                                ? <Loader/>
                                : <FlatList
                                    data={produtos}
                                    renderItem={({item}) => {
                                        let _route_params = {
                                            id_ooh_ponto_em_alerta: item.id_ooh_ponto_em_alerta,
                                            id_lib_em_alerta: item.id_lib_em_alerta,
                                            alerta: item.alerta,
                                            id_ooh_estabelecimento_ponto: item.id_ooh_estabelecimento_ponto,
                                            estabelecimento: item.estabelecimento,
                                            id_produto: item.id_produto,
                                            produto: item.produto,
                                            vetor: 'produtos'
                                        }
                                        return (<Infotape touchEvent={true} targetScreen="OperacaoOOHListaPontosScreen" route_params={_route_params} label={item.produto} badge={item.arr_produtos.length} />) 
                                    }}
                                    keyExtractor={(item,index) => { return index.toString() }}  
                                />
                        }
                        </>
                        : 
                        <> 
                        <View style={{display:'flex',flexDirection:'column',height:150,width:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'white'}}>
                            <FontAwesome5 name="tools" size={50} color="gray"/> 
                            <Text style={styles.alertaTitle}>{title}</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                            <View style={styles.alertaContainer}>
                                <Text style={styles.filtroTitle}>Filtrar por:</Text>
                                <View style={styles.filtroOptions}>
                                    <TouchableOpacity activeOpacity={0.6} onPress={() => mudarAba('produto')} style={styles.option}>
                                        <MaterialIcons name="monitor" size={30} color={aba_produtos.produto ? 'gray' : 'lightgray'}/>
                                        <Text style={{color: aba_produtos.produto ? 'gray' : 'lightgray'}}>Produtos</Text>     
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.6} onPress={() => mudarAba('pontos')} style={styles.option}>
                                        <Ionicons name="location-sharp" size={30} color={aba_produtos.ponto ? 'gray' : 'lightgray'}/>
                                        <Text style={{color: aba_produtos.ponto ? 'gray' : 'lightgray'}}>Ponto</Text>
                                    </TouchableOpacity>
                                </View> 
                            </View>
                        </TouchableWithoutFeedback>
                        {
                    (loading) 
                        ? <Loader/>
                        : <FlatList
                            data={pontos}
                            renderItem={({item}) => {
                                let _route_params = {
                                            id_ooh_ponto_em_alerta: item.id_ooh_ponto_em_alerta,
                                            id_lib_em_alerta: item.id_lib_em_alerta,
                                            alerta: item.alerta,
                                            id_produto: item.id_produto,
                                            produto: item.produto,
                                            id_ooh_estabelecimento_ponto: item.id_ooh_estabelecimento_ponto,
                                            id_estabelecimento: item.id_estabelecimento,
                                            estabelecimento: item.estabelecimento,
                                            id_av: item.id_av,
                                            title: item.estabelecimento, 
                                            av: item.av,
                                            vetor: 'lugares' 
                                        }
                                return (<Infotape touchEvent={true} targetScreen="OperacaoOOHListaPontosScreen" route_params={_route_params} label={item.estabelecimento} badge={item.arr_pontos.length} />) 
                            }}
                            keyExtractor={(item,index) => { return index.toString() }} 
                        /> 
                    }
                        </>
            }
                
        </>
    )
}


const styles = StyleSheet.create({
    alertaContainer:{
        backgroundColor:'#E9E9E9'
    },
    titleContainer:{
        display:'flex',
        flexDirection:'column',
        height:150,width:'100%',
        alignItems:'center',justifyContent:'center',
        backgroundColor:'white'
    },
    alertaTitle:{
        fontSize:20,
        marginTop:15,
        fontWeight:'bold',
        color:'gray',
    },
    filtroContainer:{
       display:'flex',
       flexDirection:'column',
       alignItems:'center',
       justifyContent:'flex-start'
    },
    filtroTitle:{
        fontFamily:'Arial',
        fontSize:20,
        color:'black',
        margin:10
    },
    filtroOptions:{
        display:'flex',
        flexDirection:'row',
        backgroundColor:'#E9E9E9',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    option:{
        width:100,
        height:100,
        borderRadius:5,
        display:'flex',
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        margin:10
    },
    filtroInput:{
        width:'95%',
        height:60,
        backgroundColor:'white',
        fontSize:16,
        borderRadius:5,
        margin:10,
        paddingLeft:20
    }
});

const mapStateToProps = (state) => ({
    arr_ooh_em_alerta: state.ooh_pontos_em_alerta.pontos_em_alerta, 
})

export default connect(mapStateToProps)(Template);