import React,{ useState,useEffect } from 'react';
import { View,Text,StyleSheet,Button,TouchableOpacity,FlatList,TouchableWithoutFeedback,Keyboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import OperacaoOOHService  from '../../service/OperacaoOOHService';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Infotape from '../components/Infotape';
import  firestore  from "@react-native-firebase/firestore";
import Loader from '../components/Loader';
import store from '../../state/store'; 
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';


export const Terminais = ({arr_ooh_em_alerta,arr_filtro_atuacao}) => {
    const [aba_terminais,setAbaTerminais] = useState({alerta:false, ponto:true});
    const [alertas,setAlertas] = useState([]);
    const [loading,setLoading] = useState(true);
    const [pontos,setPontos] = useState([]);
    const navigation = useNavigation();


    //Função para filtrar as opções
    function filtrar_resultados(value){
        let newArrayPontos = [];   
        arr_ooh_em_alerta.map((ponto) => {
            if(ponto.estabelecimento.includes(value)){
                let i_ponto = newArrayPontos.findIndex(item => item.id_estabelecimento == ponto.id_estabelecimento);
                    if(i_ponto >= 0){
                        newArrayPontos[i_ponto]['arr_pontos'].push(ponto);
                    } else { 
                    newArrayPontos.push({
                        id_lib_em_alerta: ponto.id_lib_em_alerta,
                        id_ooh_ponto_em_alerta: ponto.id_ooh_ponto_em_alerta,
                        id_estabelecimento: ponto.id_estabelecimento,
                        estabelecimento: ponto.estabelecimento,
                        id_ooh_estabelecimento_ponto: ponto.id_ooh_estabelecimento_ponto,
                        alerta: ponto.alerta,
                        arr_pontos: [ponto]
                    })
                }
            }
            }); 

        if(newArrayPontos.length != 0 && value != ''){
            setPontos(newArrayPontos);
        }else if(value == ''){
            OperacaoOOHService.listar_alerta_agrupado_por_estabelecimento().then((response) => {organizar_pontos(response);}).catch(err => {console.log(err);})
        }
    }    

    
    let arr_alerta_por_estabelecimento = [];
    function organizar_pontos(response){
        response.forEach((data) => {
            let i_ponto = arr_alerta_por_estabelecimento.findIndex( ponto => ponto.id_estabelecimento == data.id_estabelecimento );

            if (i_ponto >= 0){ 
                arr_alerta_por_estabelecimento[i_ponto]['arr_pontos'].push(data);
            } else {
                arr_alerta_por_estabelecimento.push({
                    id_lib_em_alerta: data.id_lib_em_alerta,
                    id_ooh_ponto_em_alerta: data.id_ooh_ponto_em_alerta,
                    id_estabelecimento: data.id_estabelecimento,
                    id_ooh_estabelecimento_ponto: data.id_ooh_estabelecimento_ponto,
                    estabelecimento: data.estabelecimento,
                    title: data.alerta,
                    arr_pontos: [data]
                })
            }
        })
        setPontos(arr_alerta_por_estabelecimento)
        setLoading(false);
        
    }


    useEffect(() => {
        // OperacaoOOHService.listar_ooh_pontos_em_alerta({})
        // .then(response => {
        //     console.log(response)
        //     setAlertas(response)
        //     setLoading(false); 

        // }).catch(err => {
        //     console.log(err);
        // })
        // OperacaoOOHService.listar_alerta_agrupado_por_tipo()
        // .then((response) => {
        //     setAlertas(response);
        // }).catch(err => {
        //     console.log(err);
        // })
        OperacaoOOHService.listar_alerta_agrupado_por_estabelecimento()
        .then((response) => {
            organizar_pontos(response);
            setLoading(false); 
        }).catch(err => {
            console.log(err);
        })
        //setAlertas(arr_ooh_em_alerta);
    },[])

    //Parte dos tipos de alertas
    // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    //     <View style={styles.terminaisContainer}>
    //         <View style={styles.filtroOptions}>
    //             <TouchableOpacity activeOpacity={0.6} onPress={() => mudarAba('terminais')} style={styles.option}>
    //                 <FontAwesome name="file" size={30} color={aba_terminais.alerta ? 'gray' : 'lightgray' } />
    //                 <Text style={{color: aba_terminais.alerta ? 'gray' : 'lightgray'}}>Alertas</Text>     
    //             </TouchableOpacity>
    //             <TouchableOpacity activeOpacity={0.6} onPress={() => mudarAba('ponto')} style={styles.option}>
    //                 <Ionicons name="location-sharp" size={30} color={aba_terminais.ponto ? 'gray' : 'lightgray'}/>
    //                 <Text style={{color: aba_terminais.ponto ? 'gray' : 'lightgray'}}>Ponto</Text>
    //             </TouchableOpacity>
    //         </View>
    //         <Text>Selecione o Terminal para atuação</Text> 
    //         <TextInput left={<TextInput.Icon name="magnify" size={30} color="gray" />} onChangeText={(value) => filtrar_resultados('alertas',value)}  placeholder="Filtrar alertas..." style={styles.filtroInput}/>
    //     </View>
    // </TouchableWithoutFeedback> 
    // {
    //     (loading) 
    //         ? <Loader/>
    //         : <FlatList 
    //             data={alertas}
    //             renderItem={({item}) => {
    //                 let _route_params = {
    //                     av: (item.av) ? item.av : null,
    //                     id_lib_em_alerta: item.id_lib_em_alerta,
    //                     id_ooh_ponto_em_alerta: item.id_ooh_ponto_em_alerta,
    //                     id_estabelecimento: item.id_estabelecimento,
    //                     title: item.alerta,
    //                     vetor: 'produtos'
    //                 }
    //                 return (<Infotape  touchEvent={true} targetScreen="Template" route_params={_route_params} label={item.alerta} badge={item.arr_alerta.length} />) 
    //             }}
    //             keyExtractor={(item,index) => { return index.toString() }}
    //         />
    // }

    return(
        <>      
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
                <View style={styles.terminaisContainer}>
                    <Ionicons name="location-sharp" size={60} color="gray" />
                    <Text style={styles.title}>Selecione o Terminal</Text>
                </View>
                {/* <View style={styles.filtroContainer}>
                    <TextInput left={<TextInput.Icon name="magnify" size={30} color="gray" />} onChangeText={(value) => filtrar_resultados(value)}  placeholder="Filtrar terminais..." style={styles.filtroInput}/>  
                </View> */}
            </View>
            </TouchableWithoutFeedback>
            {
                (loading) 
                    ? <Loader/>
                    : <FlatList
                        data={pontos}
                        renderItem={({item}) => { 
                            console.log(':: ITEM ::');
                            console.log(item);
                            let _route_params = {
                                id_lib_em_alerta: item.id_lib_em_alerta,
                                id_ooh_ponto_em_alerta: item.id_ooh_ponto_em_alerta,
                                id_estabelecimento: item.id_estabelecimento,
                                estabelecimento: item.estabelecimento,
                                id_ooh_estabelecimento_ponto: item.id_ooh_estabelecimento_ponto,
                                alerta: item.alerta,
                                title: item.estabelecimento,
                                vetor: 'lugares'
                            }
                            
                            return (<Infotape touchEvent={true} targetScreen="SelecionarAtuacaoScreen" route_params={_route_params} label={item.estabelecimento} badge={item.arr_pontos.length} />) 
                        }}
                        keyExtractor={(item,index) => { return index.toString() }} 
                    />
            }
        </>
    )
}

const styles = StyleSheet.create({
    headersection:{
        marginBottom:20,
    },
    terminaisContainer:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#E9E9E9',
        paddingTop:10,
        backgroundColor:'white',
        height:150,
        width:'100%',
    },
    title:{
        fontFamily:'Arial',
        fontSize:20,
        color:'gray',
        fontWeight:'bold',
        margin:20
    },
    filtroContainer:{
        backgroundColor:'#dadada',
        padding:10
    },
    filtroInput:{
        width:'100%',
        height:60,
        backgroundColor:'white',
        fontSize:16,
        borderRadius:5,
        paddingLeft:20
    }
});

const mapStateToProps = (state) => ({
    cto: state.cto_status,
    arr_filtro_atuacao: state.ooh_pontos_em_alerta.arr_filtro_atuacao,
    arr_ooh_em_alerta: state.ooh_pontos_em_alerta.pontos_em_alerta,
})

export default connect(mapStateToProps)(Terminais);