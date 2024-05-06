import React from 'react'
import { View, StyleSheet, Text, ActivityIndicator, Image } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Badge, Button, Card, List, Paragraph, Title } from 'react-native-paper';
import LottieAttentionCircle from '../../component/LottieAttentionCircle';
import HeaderBlank from '../../component/HeaderBlank';
import store  from '../../state/store';
import { useRoute }         from '@react-navigation/native';
import { useNavigation }    from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import util from '../../util/util';
import AppIcon from '../../component/AppIcon';
import { Col, Row, Grid } from "react-native-easy-grid";
import { filter } from 'underscore';

export default function ConsultarPatrimonioItens(props) {

    const state                     = store.getState();
    const navigation                = useNavigation();
    //Variaveis
    const {params}                  = useRoute()
    //Recuperar Dados do Status da Central Tecnica
    let cto = useSelector(state => state.cto_status.cto);
    //Recuperar array de patrimônio em posse do usuário
    let arr_filter_items = useSelector(state=> state.patrimonio_recebido.filter_items);
    //recupera array de qtd de itens do props
    let qtd_patrimonios = params.route_params.qtd_patrimonios;
    //recupera numero de filtro
    let filternum = params.route_params.filternum;
    //Recupera Label de Saida
    let labelsaida = useSelector(state=> state.app.user_auth.label_saida_patrimonio);
    //Recuperar total de itens a enviar
    let total_enviar    = useSelector(state=> state.equipamento_funcionario_controle.total_patrimonio_enviar);

    //Funcao que renderiza o icone de acordo com o tipo de patrimonio
    function render_icon(num_icone) {
        switch(num_icone){
            case 0: return <MaterialCommunityIcons style={style.icon} name="all-inclusive" size={25} />;
            case 1: return <Octicons style={style.icon} name="server" size={25} />;
            case 2: return <Fontisto style={style.icon} name="wifi" size={25} />;
            case 3: return <SimpleLineIcons style={style.icon} name="screen-desktop" size={25} />;
            case 4: return <MaterialCommunityIcons style={style.icon} name="router-wireless" size={25} />;
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

    function renderizaItem(item){
        return(
        <View style={style.botaocategoria}>
            {render_icon(item.id_lib_equipamento_tipo)}
            {<Text style={style.botaotext}>{item.patrimonio}</Text>}
            {}
        </View>
        );
    }

    function renderizaItens(filter_num){
        let contador = 0;
        let retorno = [];
        if(arr_filter_items.length == 0){
            return(<Text style={{marginTop:20, alignSelf:'center'}}>Sem Patrimônios para listar</Text>)
        }
        if(filter_num!=0){
            arr_filter_items.map(function(item){
                if(item.id_lib_equipamento_tipo == filter_num){
                    retorno[contador] = renderizaItem(item);
                    contador ++;
                }
            });
        }
        else{
            arr_filter_items.map(function(item){
                retorno[contador] = renderizaItem(item);
                contador ++;
            });
        }
        if(contador == 0){
            return(<Text style={{marginTop:20, alignSelf:'center'}}>Sem Patrimônios para listar</Text>)
        }
        return retorno;
    }
    //
    //Função que renderiza o icone do cabeçalho
    function render_icon_big(num_icone) {
        switch(num_icone){
            case 0: return <Octicons size={50} style={{margin:20}} name="package"  />;
            case 1: return <Octicons size={50} style={{margin:20}} name="server"  />;
            case 2: return <Fontisto size={50} style={{margin:20}} name="wifi"  />;
            case 3: return <SimpleLineIcons size={50} style={{margin:20}} name="screen-desktop"  />;
            case 4: return <MaterialCommunityIcons size={50} style={{margin:20}} name="router-wireless"  />;   
            default: {
                return <></>
            }
        }
    }
    //Função que renderiza o texto do cabeçalho
    function render_text_header(num_icone) {
        switch(num_icone){
            case 0: return <Text style={{fontSize:30, color: '#000'}}>Patrimônios</Text>;
            case 1: return <Text style={{fontSize:30, color: '#000'}}>Players</Text>;
            case 2: return <Text style={{fontSize:30, color: '#000'}}>Modens</Text>;
            case 3: return <Text style={{fontSize:30, color: '#000'}}>Telas</Text>;
            case 4: return <Text style={{fontSize:30, color: '#000'}}>Roteadores</Text>;  
            default: {
                return <></>
            }
        }
    }

    return (
        <>
        <View style={style.container}>

           {/* <HeaderBlank>
                Fechar
            </HeaderBlank> */}
 
            <ScrollView showsVerticalScrollIndicator={false}>

            <View style={{alignContent:'center', alignItems:'center',margin:30}}>
                {render_icon_big(filternum)}
                {/*<Image style={{width:200, height:200}} source={require('../../assets/image/patrimonio-icon.png')} />*/}
                {/*<AppIcon lib="Fontisto" icon="bus" size={50} style={{marginEnd: 5}}></AppIcon>*/}
                {render_text_header(filternum)}
            </View>
            
            <View style={{marginTop:15}}>
            {
                renderizaItens(filternum)
            }
            </View>

            </ScrollView>
            <TouchableOpacity style={{marginTop:20,}} onPress={() => {navigation.navigate('PatrimonioSaidaScreen')}}>
                <List.Item 
                    style={{backgroundColor: '#F2F2F2', borderRadius: 10, marginBottom: 20}} 
                    title={labelsaida}
                    description="Clique para enviar Patrimônios para outro colaborador"
                    left={props => <List.Icon {...props} icon="cloud-upload" color="darkorange" />}
                    right={props => 
                        (total_enviar > 0) ?
                        <LottieAttentionCircle>{total_enviar}</LottieAttentionCircle> : 
                        <Badge size={35} style={{alignSelf: "center", backgroundColor: "black"}}>{total_enviar}</Badge> 
                    }
                />
            </TouchableOpacity>
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
        marginBottom: 10,
        alignItems: 'center',
    },
    icon: {
        alignSelf: 'flex-start',
    },
    botaotext: {
        paddingLeft:10,
    },
    badgecontainer: {
        width: '20%',
    },
    badge: {
        backgroundColor: '#000',
        fontSize:16,
    }
});