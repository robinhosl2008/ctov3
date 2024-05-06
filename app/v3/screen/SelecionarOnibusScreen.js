import React,{ useEffect, useState } from 'react';
import { View,Text,StyleSheet,TouchableOpacity,FlatList,TouchableWithoutFeedback,Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import OperacaoGaragemService from '../../service/OperacaoGaragemService';
import OperacaoOOHService from '../../service/OperacaoOOHService';
import { TextInput } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Infotape from '../components/Infotape';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import { connect, useSelector } from 'react-redux';
import EmpresaOnibusService from '../../service/EmpresaOnibusService';

const SelecionarOnibusScreen = (props) => { 
    const [garagem,setGaragem] = useState('');
    const [onibus,setOnibus] = useState([]);
    const [loading,setLoading] = useState(true);
    const navigation = useNavigation();

    const { params } = useRoute();
    
    let id_garagem = params.route_params.id_garagem;

    useEffect(() => {
        OperacaoGaragemService
        .listar_onibus({id_garagem: 13})
        .then((response) => {
            setGaragem(response[0].garagem);
            setOnibus(response);
            setLoading(false);
        }).catch((error) => {
            console.log('Houve um erro na requisição');
            console.log(error);
        })
    },[])


    return(
        <>      
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
                <View style={styles.garagensContainer}>
                    <Text style={styles.garagem}>{garagem}</Text>
                    <Text style={styles.title}>Selecione o Ônibus para Atuação</Text>
                </View>
                <View style={styles.filtroContainer}>
                    <TextInput left={<TextInput.Icon name="magnify" size={30} color="gray" />} onChangeText={(value) => filtrar_resultados('pontos',value)}  placeholder="Filtrar terminais..." style={styles.filtroInput}/>  
                </View>
            </View>
            </TouchableWithoutFeedback>
            {
                (loading) 
                    ? <Loader/>
                    : <FlatList
                        data={onibus}
                        renderItem={({item}) => { 
                            let _route_params = {
                                id_onibus: item.id_onibus,
                                 
                            }
                            return (<Infotape touchEvent={true}  route_params={_route_params} targetScreen="v2OperacaoGaragemOnibus" label={'Ônibus - '+item.numero_onibus} />) 
                        }}
                        keyExtractor={(item,index) => { return index.toString() }} 
                    />
            }
        </>
    )
}

const styles = StyleSheet.create({
    garagensContainer:{
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
    garagem:{
        fontFamily:'Arial',
        fontSize:24,
        color:'gray',
        fontWeight:'bold',
        margin:20
    },
    title:{
        fontFamily:'Arial',
        fontSize:20,
        color:'gray',
        fontWeight:'bold',
        marginBottom:20
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

export default SelecionarOnibusScreen;