import React,{ useState,useEffect } from 'react';
import { View ,Text,StyleSheet,TouchableWithoutFeedback,TouchableOpacity,FlatList, Keyboard  } from 'react-native'; 
import { TextInput } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import axios from 'axios';
import { connect } from 'react-redux';
// import { useDispatch, useSelector } from 'react-redux';
// import { createStackNavigator } from '@react-navigation/stack';
// import Notificacoes from './Notificacoes';
import Infotape from '../components/Infotape';
// import {getDocs} from '../firebase/firebase';
// import  firestore  from "@react-native-firebase/firestore";
import Loader from '../components/Loader';
import CheckingService from '../../service/CheckingService';

const Checking = ({arr_checking_data}) => {
    const [checkings,setCheckings] = useState({av:true, ponto:false});
    const [AVs,setAVs] = useState([]);
    const [pontos,setPontos] = useState([]);
    const [loading,setLoading] = useState(true);

    //Função para mudar o filtro
    function mudarAba(option){
        setCheckings((prevState) => {
            if(option == 'av'){
                return { av: true, ponto: false} 
            }else if(option == 'ponto'){
                return { av: false, ponto: true}
            }
        })
    } 

    //Função para filtrar as opções
    function filtrar_resultados(value){
        let newArrayAVs = [];
            arr_checking_data.map((av) => { 
                if(av.nome_campanha.includes(value) || av.id.toString().includes(value)){
                 let i_av = newArrayAVs.findIndex(item => item.id_av == av.id);
                     if(i_av >= 0){
                         newArrayAVs[i_av]['arr_alerta'].push(av);
                     } else {
                        newArrayAVs.push({
                            id_av: av.id,
                            cliente: av.cliente, 
                            campanha: av.nome_campanha,
                            termino: av.termino,
                            checking_calendario:[av.checking_calendario],
                            arr_alerta: [av]
                        })
                    }
                }
             }); 
            if(newArrayAVs.length != 0 && value != ''){
                setAVs(newArrayAVs);
            }else if(value == ''){
                CheckingService.agrupar_avs_por_numero().then(arr_av => {setAVs(arr_av);}).catch(error => {console.log(error)});
            }
    }

    useEffect(() => { 
        CheckingService.agrupar_avs_por_numero().then(arr_av => {setAVs(arr_av);}).catch(error => {console.log(error)});
        CheckingService.agrupar_avs_por_estabelecimento().then(arr_av => {setPontos(arr_av);}).catch(error => {console.log(error)});
        setLoading(false);
    },[])
  
    return( 
        <>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View>
                        <View  style={styles.checkingContainer}>
                            <FontAwesome5 name="camera" size={60} color="gray" />
                            <Text style={styles.title}>Selecione a AV</Text>
                        </View>
                        <View style={styles.filtroContainer}>
                            <TextInput 
                                left={<TextInput.Icon icon="magnify" size={30} color="gray"/>}
                                onChangeText={(value) => filtrar_resultados(value)}  
                                placeholder="Filtrar AVs..." 
                                style={styles.filtroInput}
                            />                
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                    {   
                    (loading) 
                        ? <Loader/>  
                        : <FlatList
                            data={AVs}
                            renderItem={({item}) => {  
                                let _late = false;
                                let current_date = new Date().getTime(); 
                                let checking_date = new Date(item.termino).getTime();
                               
                                return (<Infotape touchEvent={true} targetScreen="CheckingListaRotaScreen" route_params={item.arr_alerta} label={'AV - ' + item.id_av} sublabel={item.campanha}  /* badge={item.arr_alerta.length} */ />) 
                            }}
                            keyExtractor={(item,index) => { return index.toString() }}
                            />           
                    }
            {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={styles.checkingContainer}>
                        <Text style={styles.filtroTitle}>Filtrar por:</Text>
                        <View style={styles.filtroOptions}>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => mudarAba('av')} style={styles.option}>
                                <FontAwesome name="file" size={30} color={checkings.av ? 'gray' : 'lightgray' } />
                                <Text style={{color: checkings.av ? 'gray' : 'lightgray'}}>AV</Text>     
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => mudarAba('ponto')} style={styles.option}>
                                <Ionicons name="location-sharp" size={30} color={checkings.ponto ? 'gray' : 'lightgray'}/>
                                <Text style={{color: checkings.ponto ? 'gray' : 'lightgray'}}>Ponto</Text>
                            </TouchableOpacity>
                        </View> 
                        <TextInput left={<TextInput.Icon name="magnify" size={30} color="gray" />} onChangeText={(value) => filtrar_resultados('pontos',value)}  placeholder="Filtrar Pontos..." style={styles.filtroInput}/>
                       
                    </View>
              </TouchableWithoutFeedback>
              {
                (loading)
                    ? <Loader/>
                    : <FlatList 
                        data={pontos}
                        renderItem={({item}) => { 
                            let _route_params = {
                                ...item,
                                vetor:'garagens' 
                            }
                            return (<Infotape touchEvent={true} targetScreen="CheckingListarAVScreen"  route_params={_route_params} label={item.estabelecimento} badge={item.arr_pontos.length}/>) 
                    }}
                        keyExtractor={(item,index) => { return index.toString() }}
                      />
              } */}
       </> 
    )
}

const styles = StyleSheet.create({
    checkingContainer:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#E9E9E9',
        paddingTop:10,
        backgroundColor:'white',
        height:150,
        width:'100%',
        paddingTop:20,
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
        color:'#000000',
        padding:10
    },
    filtroInput:{
        width:'100%',
        height:60,
        backgroundColor:'white',
        color:'#000000',
        fontSize:16,
        borderRadius:5,
        paddingLeft:20
    },
    
});

const mapStateToProps = (state) => ({
    cto: state.cto_status,
    arr_checking_data: state.checking.data,
})

export default  connect(mapStateToProps)(Checking);