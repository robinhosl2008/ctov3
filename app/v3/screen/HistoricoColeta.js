import React,{ useEffect, useState } from 'react';
import { View, Text,StyleSheet,Pressable,TouchableOpacity } from 'react-native'; 
import { ScrollView } from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Infotape from '../components/Infotape';
import { DataTable, TextInput } from 'react-native-paper';
import Table from '../components/Table';
import firestore from '@react-native-firebase/firestore';
import store from '../../state/store';

const HistoricoColeta = () => {
    const [active,setActive] = useState({ativas:true,inativas:false});
    const [arr_patrimonios,setArrPatrimonios] = useState([]);
    const [arr_fixed,setArrFixed] = useState([]);
    const [page,setPage] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);
    let user_auth = store.getState().app.user_auth;
    
    function render_datacell(item){
        
        if(item.id_remetente == user_auth.id){
            if(item.data_recebimento == null && item.status == 'ENCAMINHADO'){
                return <DataTable.Cell><Text style={styles.tabelCell}><FontAwesome  name="arrow-circle-right" color="rgb(179, 179, 0)" size={15}/> {item.destinatario}</Text></DataTable.Cell>;
            }else if(item.data_recebimento != null && item.status == 'RECEBIDO'){
                return <DataTable.Cell><Text style={styles.tabelCell}><FontAwesome  name="arrow-circle-up" color="green" size={15}/> {item.destinatario}</Text></DataTable.Cell>;
            }
            
        }else if(item.id_destinatario == user_auth.id){
            if(item.data_envio != null && item.status == 'ENCAMINHADO'){
                return <DataTable.Cell><Text style={styles.tabelCell}><FontAwesome  name="arrow-circle-left" color="rgb(179, 179, 0)" size={15}/> {item.remetente}</Text></DataTable.Cell>;
            }else if(item.data_envio != null && item.status == 'RECEBIDO'){
                return <DataTable.Cell><Text style={styles.tabelCell}><FontAwesome  name="arrow-circle-down" color="green" size={15}/> {item.remetente}</Text></DataTable.Cell>;
            }
        }
           
    }    
    
    function filtrar_patrimonios(value){
        let newArray = [];
        arr_patrimonios.map((item) => {
            if(value != '' && (item.patrimonio.includes(value) || item.coletador.includes(value))){
                newArray.push(item);
            }else if(value == ''){
                newArray = [...arr_fixed];
            }
        });
        setArrPatrimonios(newArray);
    }

    async function importar_dados(){
        let user_auth = store.getState().app.user_auth;
        let arr_temp = [];
        let documents = await firestore().collection('cto-patrimonio-historico').doc(`${user_auth.id}`).get();

       
        Object.values(documents.data()).map((doc) => {
            arr_temp.push(doc);
        })

        setArrPatrimonios(arr_temp);
        setArrFixed(arr_temp);
        setNumberOfPages(Math.floor(arr_temp / 10));
    }



    useEffect(() => {
        importar_dados()
    },[])



    return(
        <ScrollView contentContainerStyle={styles.mainSection}>
            <View style={styles.logoSection}>
                <FontAwesome5 name="file-alt" color="orange" size={60}/>
                <Text style={styles.mainTitle}>Histórico de Coleta</Text>
            </View>
            <View style={styles.middleSection}>
                <TextInput left={<TextInput.Icon name="magnify" size={30} color="gray" />}  onChangeText={(value) => filtrar_patrimonios(value)}  placeholder="Filtrar patrimonio..." style={styles.filtroInput}/>                
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title style={styles.tableTitleContainer}><Text style={styles.tableTitleText}>Técnico</Text></DataTable.Title>
                        <DataTable.Title style={styles.tableTitleContainer}><Text style={styles.tableTitleText}>Patrimônio</Text></DataTable.Title>
                        <DataTable.Title style={styles.tableTitleContainer}><Text style={styles.tableTitleText}>Data</Text></DataTable.Title>
                        <DataTable.Title style={styles.tableTitleContainer}><Text style={styles.tableTitleText}>Recebido ou entregue a:</Text></DataTable.Title>
                    </DataTable.Header>
                    {   
                        (arr_patrimonios.length != 0)
                        ?
                        arr_patrimonios.map((item,index) => {
                            return (
                                <DataTable.Row key={index.toString()}>
                                    <DataTable.Cell><Text style={styles.tabelCell}>{item.coletador}</Text></DataTable.Cell>
                                    <DataTable.Cell><Text style={styles.tabelCell}>{item.patrimonio}</Text></DataTable.Cell>
                                    <DataTable.Cell><Text style={styles.tabelCell}>{item.data_envio}</Text></DataTable.Cell>
                                    {render_datacell(item)}
                                </DataTable.Row>
                            )
                        })
                        : (<Text>Nenhum registro...</Text>)
                    }
                    <DataTable.Pagination
                        style={styles.tablePagination}
                        page={page}
                        numberOfItemsPerPage={10}
                        numberOfPages={numberOfPages}
                        onPageChange={(page) => setPage(page)} 
                        label={`${page+1} de ${Math.ceil(arr_patrimonios.length / 10)}`}
                        showFastPagination
                    />
                </DataTable>
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    mainSection:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    },
    logoSection:{
        display:'flex',
        width:'100%',
        height:160,
        backgroundColor:'white',
        alignItems:'center',
        paddingTop:30,
    },
    mainTitle:{
        fontFamily:'Arial',
        fontSize:20,
        margin:20,
        color:'orange'
    },
    middleSection:{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'flex-start',
        width:'100%',
        height:300,
        backgroundColor:'transparent',
    },
    filtroInput:{
        display:'flex',
        width:'95%',
        height:60,
        backgroundColor:'white',
        fontSize:16,
        borderRadius:5,
        margin:10,
        paddingLeft:20
    },
    tableTitleContainer:{
        paddingLeft:5
    },
    tableTitleText:{
        fontSize:14,
        fontWeight:'bold',
        color:'black',
        paddingLeft:10
    },
    tabelCell:{
        fontSize:11
    },
    tablePagination:{
        marginTop:20,
    }
});

export default HistoricoColeta;