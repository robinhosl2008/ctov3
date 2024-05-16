import React,{ useEffect, useState } from 'react';
import { View,Text,StyleSheet,TouchableOpacity,FlatList,TouchableWithoutFeedback,Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { ScrollView } from 'react-native-gesture-handler';
// import OperacaoGaragemService from '../../service/OperacaoGaragemService';
// import OperacaoOOHService from '../../service/OperacaoOOHService';
import { TextInput } from 'react-native-paper';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Infotape from '../components/Infotape';
// import firestore from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import { connect } from 'react-redux';
// import EmpresaOnibusService from '../../service/EmpresaOnibusService';
// import util from '../../util/util';
import EmpresaOnibusFuncionarioService from '../../service/EmpresaOnibusFuncionarioService';


const Garagens = (props) => {
    const [garagens,setGaragens] = useState([]);
    const [garagens_fixed,setGaragensFixed] = useState([]);
    const [loading,setLoading] = useState(true);
    const navigation = useNavigation();
    const [onibus,setOnibus] = useState([]);

    function filtrar_resultados(value){
        let newArrGaragens;
        if(value != ''){
            newArrGaragens = garagens.filter((item) => item.nomeFantasia.includes(value));
        }else if(value == ''){
            newArrGaragens = garagens_fixed;
        }
        setGaragens(newArrGaragens);
    }

    function importar_garagens(){
        EmpresaOnibusFuncionarioService.listar_empresa_onibus_funcionario()
        .then(response => {
            setGaragens(response);
            setGaragensFixed(response);
            setLoading(false);            
        }).catch(err => {
            console.log('Deu ruim...');
            console.log(err);
        })
    }


    useEffect(() => {
        importar_garagens();
    },[])


    return(
        <>      
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
                <View style={styles.garagensContainer}>
                    {/* <Ionicons name="bus" size={60} color="gray" /> */}
                    <FontAwesome5 name={"bus"} solid size={60} color="gray" />
                    <Text style={styles.title}>Selecione a Garagem</Text>
                </View>
                <View style={styles.filtroContainer}>
                    <TextInput left={<TextInput.Icon icon="magnify" size={30} color="gray" />} onChangeText={(value) => filtrar_resultados(value)}  placeholder="Filtrar terminais..." style={styles.filtroInput}/>  
                </View>
            </View>
            </TouchableWithoutFeedback>
            {
                (loading) 
                    ? <Loader/>
                    : <FlatList
                        data={garagens}
                        renderItem={({item}) => {
                            let _route_params = {id_garagem: item.id_empresa_onibus};
                            
                            return (<Infotape touchEvent={true} targetScreen="OperacaoGaragemListaOnibusScreen" route_params={_route_params} label={item.nomeFantasia} />) 
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
    garagem: state.empresa_onibus.obj_id_item
})

export default connect(mapStateToProps)(Garagens);