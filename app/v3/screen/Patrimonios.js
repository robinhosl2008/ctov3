import React,{ useState } from 'react';
import { View, Text ,Image,StyleSheet,Button,TouchableOpacity } from 'react-native'; 
import store from '../../state/store';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Infotape from '../components/Infotape';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

export default function Patrimonios({navigation}){
    const [historicoView,setHistoricoView] = useState(true);
     
    const state                     = store.getState();
    //Variaveis
    const {params}                  = useRoute();
    //Recuperar Dados do Status da Central Tecnica
    let cto = useSelector(state => state.cto_status.cto);
    //Recuperar array de patrimônio em posse do usuário
    let arr_filter_items = useSelector(state=> state.patrimonio_recebido.filter_items);
    //recupera array de qtd de itens do props
    //let qtd_patrimonios = (params.params.qtd_patrimonios) ? params.params.qtd_patrimonios : null; 
    let qtd_patrimonios = filtrarPatrimonios(arr_filter_items);
    //Recupera Label de Saida
    let labelsaida = useSelector(state=> state.app.user_auth.label_saida_patrimonio);
    //Recuperar total de itens a enviar


    function filtrarPatrimonios(array){

        let players = 0;
        let modens = 0;
        let telas = 0;
        let roteadores = 0;
        let todos = 0;

        if(array.length>0){
            array.map(function(item){
                //Se o id_lib_equipamento_tipo for 1 então é Player
                if(item.id_lib_equipamento_tipo == '1'){
                    players ++;
                }
                //Se o id_lib_equipamento_tipo for 2 então é Modem
                else if(item.id_lib_equipamento_tipo == '2'){
                    modens ++;
                }
                //Se o id_lib_equipamento_tipo for 3 então é Tela
                else if(item.id_lib_equipamento_tipo == '3'){
                    telas ++;
                }
                //Se o id_lib_equipamento_tipo for 4 então é Roteador
                else if(item.id_lib_equipamento_tipo == '4'){
                    roteadores++;
                }
            });
        }
        todos = players + modens + telas + roteadores; 
        return {'qtdplayers':players,'qtdmodens': modens,'qtdtelas': telas,'qtdroteadores': roteadores, 'qtdtotal': todos};
    }


    return(
        <>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <View style={styles.main}>
                        <FontAwesome5 name="box" size={50} color="darkorange" />
                        <Text style={styles.mainText}>Coleta de Patrimônio</Text> 
                    </View>
                </View>
                <View style={styles.showcase}>
                    <View style={styles.historico}> 
                        <Infotape  touchEvent={true}  targetScreen="HistoricoColeta" icon={<FontAwesome5 name="file-alt" size={25} color="gray"/>} label="Histórico"/> 
                    </View>
                    <Infotape touchEvent={true} targetScreen="ConsultarPatrimonioItens"  route_params={{'filternum': 1, 'qtd_patrimonios': qtd_patrimonios}} icon={<FontAwesome5 name="server" size={25} color="gray" />} label="Players" badge={qtd_patrimonios['qtdplayers']}/>
                    <Infotape touchEvent={true} targetScreen="ConsultarPatrimonioItens"  route_params={{'filternum': 2, 'qtd_patrimonios': qtd_patrimonios}} icon={<FontAwesome5 name="wifi" size={25} color="gray" />} label="Modens" badge={qtd_patrimonios['qtdmodens']}/>
                    <Infotape touchEvent={true} targetScreen="ConsultarPatrimonioItens" route_params={{'filternum': 3, 'qtd_patrimonios': qtd_patrimonios}} icon={<FontAwesome5 name="tv" size={25} color="gray" />} label="Telas" badge={qtd_patrimonios['qtdtelas']} />
                    <Infotape touchEvent={true} targetScreen="ConsultarPatrimonioItens" route_params={{'filternum': 4, 'qtd_patrimonios': qtd_patrimonios}} icon={<MaterialIcons name="router" size={30} color="gray" />} label="Roteadores" badge={qtd_patrimonios['qtdroteadores']} />
                    <View style={styles.tramites}> 
                        <Infotape touchEvent={true} targetScreen="PatrimonioSaidaScreen" icon={<FontAwesome5 name="cloud-upload-alt" color="gray" size={20} />} width="50%" label="Devolver"/>
                        <Infotape touchEvent={true} targetScreen="PatrimonioEntradaScreen" icon={<FontAwesome5 name="cloud-download-alt" color="gray" size={20}/>} width="50%" label="Receber"/>
                    </View>
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    main:{
        display:'flex',
        width:'100%',
        height:150,
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center'
    },
    mainText:{
        fontFamily:'Arial',
        fontSize:22,
        color:'darkorange',
        margin:10
    },
    showcase:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    },
    historico:{
        marginTop:30,
        marginBottom:30,
    },
    tramites:{
        display:'flex',
        width:'90%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:20,
    }
});
