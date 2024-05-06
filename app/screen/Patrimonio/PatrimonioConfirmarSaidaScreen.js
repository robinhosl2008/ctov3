import React from 'react'
import { View, StyleSheet, Text, ActivityIndicator, Image, TextInput } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Badge, Button, Card, List, Paragraph, Title,  } from 'react-native-paper';
import LottieAttentionCircle from '../../component/LottieAttentionCircle';
import HeaderBlank from '../../component/HeaderBlank';
import store  from '../../state/store';
import { useRoute }         from '@react-navigation/native';
import { useNavigation }    from '@react-navigation/native';
import { useSelector } from 'react-redux'
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import EquipamentoFuncionarioControleService from './../../service/EquipamentoFuncionarioControleService';
import util from '../../util/util';
import AppIcon from '../../component/AppIcon';
import { envioPatrimonioAddObservacao } from './../../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import { Col, Row, Grid } from "react-native-easy-grid";

export default function PatrimonioConfirmarSaidaScreen(props) {
    
    const state                     = store.getState();
    const navigation                = useNavigation();  
    const {params}                  = useRoute()
    const arr_patrimonios           = useSelector(state=>state.patrimonio_recebido.data);
    const arr_id_patrimonio_enviar  = useSelector(state=>state.patrimonio_recebido.envio_patrimonio.arr_id_patrimonio_enviar);

    //Recuperar patrimonios listados para envio
    let dados = useSelector(state=> state.patrimonio_recebido.envio_patrimonio);
    //Recuperar array de patrimônio em posse do usuário
    //let arr_patrimonios = useSelector(state=> state.patrimonio_recebido.filter_items);
    
    //Funcao que renderiza o icone de acordo com o tipo de patrimonio
    function render_icon(num_icone) {
        switch(num_icone){
            case 1: return <Octicons style={style.icon} name="server" size={25} />;
            case 2: return <Fontisto style={style.icon} name="wifi" size={25} />;
            case 3: return <SimpleLineIcons style={style.icon} name="screen-desktop" size={25} />;
            case 4: return <MaterialCommunityIcons style={style.icon} name="router-wireless" size={25} />;
            case 0: return <MaterialCommunityIcons style={style.icon} name="all-inclusive" size={25} />;
            default: {
                return <></>
            }
        }
    }
    //Funcao que renderiza o texto a ser exibido de acordo com o tipo de patrimonio
    function render_text(num_icone) {
        switch(num_icone){
            case 1: return (<Text style={style.botaotext}>Players</Text>);
            case 2: return (<Text style={style.botaotext}>Modens</Text>);
            case 3: return (<Text style={style.botaotext}>Telas</Text>);
            case 4: return (<Text style={style.botaotext}>Roteadores</Text>);
            case 0: return (<Text style={style.botaotext}>Todos</Text>);
            default: {
                return <></>
            }
        }
    }
    //Função que renderiza os badges com quantidades de patrimonios no canto do botao
    function render_badge(numero){
        switch(numero){
            case 0: return(<View style={style.badgecontainer}><Badge size={30} style={style.badge}>{qtd_patrimonios['qtdtotal']}</Badge></View>);
            case 1: return(<View style={style.badgecontainer}><Badge size={30} style={style.badge}>{qtd_patrimonios['qtdplayers']}</Badge></View>);
            case 2: return(<View style={style.badgecontainer}><Badge size={30} style={style.badge}>{qtd_patrimonios['qtdmodens']}</Badge></View>);
            case 3: return(<View style={style.badgecontainer}><Badge size={30} style={style.badge}>{qtd_patrimonios['qtdtelas']}</Badge></View>);
            case 4: return(<View style={style.badgecontainer}><Badge size={30} style={style.badge}>{qtd_patrimonios['qtdroteadores']}</Badge></View>); 
        }
    }

    //Filtra lista de Patrimonios recuperando IDS selecionados para envio
    function arr_patrimonios_selecionados(){
        return arr_patrimonios.filter(item => {
            return arr_id_patrimonio_enviar.indexOf(item.id_equipamento) > -1
        })
    }

    function addObservacao(str){
        // Armazenar Observacao
        store.dispatch(envioPatrimonioAddObservacao({observacao: str }));
        //console.log(dados.observacao);
    }

    function confirmar_envio(){
        //Ativar função de envio do service
        EquipamentoFuncionarioControleService.confirmar_envio_patrimonio()
        //Navegar pra home após envio
        navigation.navigate("HomeScreen");
    }

    return (
        <>
        <View style={style.container}>

            <HeaderBlank>
                Fechar
            </HeaderBlank>
 
            <ScrollView showsVerticalScrollIndicator={false}>
                
                <View style={{alignContent:'center', alignItems:'center'}}>
                    {<AppIcon lib="Ionicons" icon="checkbox-outline" size={100} style={{paddingHorizontal: 18, alignSelf: 'center'}}></AppIcon>}
                    <Text style={{fontSize:25, color: '#000'}}>Transferir Patrimônios</Text>
                </View>
                
                <View style={style.container_dados}>
                    <Text style={{marginVertical:20, fontSize:16, textAlign:'center'}}>Confira os dados antes de confirmar a transferência:</Text>
                    <View style={style.container_info}>
                        <Text style={style.texto_titulo}>Destinatário: </Text>
                        <Text style={style.texto_normal}>{dados.destinatario}</Text>
                    </View>
                    <View style={style.container_info}>
                        <Text style={style.texto_titulo}>Tipo: </Text>
                        {(dados.id_coletador!=null)?(<Text style={style.texto_normal}>Com Coleta</Text>):(<Text style={style.texto_normal}>Em mãos</Text>)}
                    </View>
                    <View style={style.container_info}>
                        {(dados.id_coletador!=null)?(<Text style={style.texto_titulo}>Coletador: </Text>):(<></>)}
                        {(dados.id_coletador!=null)?(<Text style={style.texto_normal}>{dados.coletador}</Text>):(<></>)}
                    </View>
                    <View style={{paddingHorizontal:5, paddingVertical:5,}}>
                        <View style={{paddingBottom:10}}>
                            <Text style={style.texto_titulo}>Patrimônios: </Text>
                        </View>
                        {
                            arr_patrimonios_selecionados().map(item => (
                                <View style={{paddingLeft:20,}} key={item.id_equipamento}>
                                    <Text style={style.texto_normal}>{item.patrimonio}</Text>
                                </View>
                            ))
                        }
                    </View>
                    {(dados.id_coletador!=null)?(
                        <View>
                            <Text style={{marginTop:20}}>Adicionar uma Observação:</Text>
                            <TextInput
                                style={style.campo_observacao}
                                multiline={true}
                                numberOfLines={5}
                                onChangeText={(str) => addObservacao(str)}
                            />
                        </View>
                    ):(<></>)}
                </View>

            </ScrollView>
            <View style={[style.containerButton]}>
                <Button mode="outlined" style={style.btnStyle} contentStyle={style.btnContentStyle} labelStyle={style.btnLabelStyle} onPress={() => confirmar_envio()}>Confirmar</Button>
            </View>
        </View>
        </>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20
    },
    container_header_onibus_alerta: {
        paddingHorizontal: 20,
        backgroundColor: 'white'
    },
    container_patrimonio: {
        marginVertical: 40
    },
    container_status: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    botaocategoria: {
        borderRadius:10,
        backgroundColor:'#F2F2F2',
        padding:10,
        flexDirection:'row',
        justifyContent:'space-around',
        marginBottom: 10,
        alignItems: 'center',
    },
    icon: {
        alignSelf: 'flex-start',
        width:'20%',
    },
    botaotext: {
        width:'60%',
    },
    badgecontainer: {
        width: '20%',
    },
    badge: {
        backgroundColor: '#000',
        fontSize:16,
    },
    container_dados: {
        padding:10,
    },
    container_info: {
        paddingHorizontal: 5,
        paddingVertical: 5,
        flexDirection:'row',
    },
    texto_normal: {
        fontSize:16,
    },
    texto_titulo: {
        fontSize:16,
        fontWeight:'bold',
    },
    containerButton:{
        height: 60, 
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%', 
        bottom: 0
    },
    btnStyle: {
        backgroundColor: 'darkorange',
        width: '100%',
    },
    btnContentStyle: {
        height: 50,
    },
    btnLabelStyle: {
        color: 'white',
    },
    campo_observacao: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom:10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        shadowOpacity: 0,
        borderWidth: 1,
        borderColor:'#ccc',
    },
});