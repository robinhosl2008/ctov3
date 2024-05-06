import React from 'react'
import { View, StyleSheet, Text, ActivityIndicator, Image, Dimensions } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Badge, Button, Card, List, Paragraph, Title } from 'react-native-paper';
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
import util from '../../util/util';
import AppIcon from '../../component/AppIcon';
import { Col, Row, Grid } from "react-native-easy-grid";
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import { useSafeArea } from 'react-native-safe-area-context';

export default function ColetaInfoScreen(props) {
    
    const state                     = store.getState();
    const navigation                = useNavigation();
    //Variaveis
    //const {params}                = useRoute()
    let coletas_data                    =  useSelector(state=>state.coleta.data);
    //Dado do usuário logado
    let user_id                     = useSelector(state=>state.app.user_auth.id);
    //recuperar coletas nas quais o usuario esta logado:
    let coletas_user                = useSelector(state=>state.coleta.arr_coleta);


    //Definir coletas ativas e inativas
    let coletas_filtradas = filtrarColetas(coletas_user);
    let coletas_ativas = coletas_filtradas[0];
    let coletas_inativas = coletas_filtradas[1];

    // console.log("::::\n::::\n::::coletas ativas")
    // console.log(coletas_ativas)
    // console.log("::::\n::::\n::::coletas inativas")
    // console.log(coletas_inativas)

    //Filtrar coletas (ativas e inativas)
    function filtrarColetas (listacoletas){
        let ativas = [];
        let inativas = [];
        let retorno = [];
        listacoletas.map(function(item){
            if(item.id_lib_coleta_status == 1 || item.id_lib_coleta_status == 2 || item.id_lib_coleta_status == 3){
                ativas.push(item);
            }
            else{
                inativas.push(item);
            }
        });
        retorno.push(ativas);
        retorno.push(inativas);
        return retorno;
    };

    //Função que renderiza a coleta SE o funcionário logado está relacionado a ela de alguma forma
    function renderizarColetas2(coletas){
        let retorno = [];
        let temp = null;
        //varrer lista
        coletas.map(function(item){
            //Se o id coletador, id destinatario ou id remetente foi igual ao id do usuario logado, exibir esta coleta
            if(item.id_coletador == user_id || item.id_destinatario == user_id || item.id_remetente == user_id){
                temp = (
                    <TouchableOpacity key={item.id} onPress={()=>selecionar_coleta(item)}>
                        {/* console.log("item") */}
                        {/* console.log(item) */}
                        <View style={style.containerColeta}>
                            <Grid>
                                <Row>
                                    <Text style={style.textobold}>Lote: </Text>
                                    <Text style={style.textonormal}>{item.id}</Text>
                                </Row>
                                <Row key={(item.id + "Remetente")}>
                                    <Text style={style.textobold}>Remetente: </Text>
                                    <Text style={style.textonormal}>{item.remetente}</Text>
                                </Row>
                                <Row key={(item.id + "Destinatario")}>
                                    <Text style={style.textobold}>Destinatário: </Text>
                                    <Text style={style.textonormal}>{item.destinatario}</Text>
                                </Row>
                                <Row key={(item.id + "Coletador")}>
                                    <Text style={style.textobold}>Coletador: </Text>
                                    <Text style={style.textonormal}>{item.coletador}</Text>
                                </Row>
                            </Grid>
                            {statusColeta(item)}
                        </View>
                    </TouchableOpacity>
                );
                retorno.push(temp)
            }
        })
        if(retorno.length>0){
            return retorno;
        }
        else{
            return (<><View style={{alignItems:"center"}}><Text>Sem Coletas para Exibir</Text></View></>);
        }
    }

    //Função que renderiza as coletas sem necessitar filtrar os usuários (pois os dados ja vem filtrados do state)
    function renderizarColetas(coletas){
        let retorno = [];
        let temp = null;
        //varrer lista
        coletas.map(function(item){
            temp = (
                <TouchableOpacity key={item.id} onPress={()=>selecionar_coleta(item)}>
                    {/* console.log("item") */}
                    {console.log(item)}
                    <View style={style.containerColeta}>
                        <Grid>
                            <Row>
                                <Text style={style.textobold}>Lote: </Text>
                                <Text style={style.textonormal}>{item.id}</Text>
                            </Row>
                            <Row key={(item.id + "Remetente")}>
                                <Text style={style.textobold}>Remetente: </Text>
                                <Text style={style.textonormal}>{item.remetente}</Text>
                            </Row>
                            <Row key={(item.id + "Destinatario")}>
                                <Text style={style.textobold}>Destinatário: </Text>
                                <Text style={style.textonormal}>{item.destinatario}</Text>
                            </Row>
                            <Row key={(item.id + "Coletador")}>
                                <Text style={style.textobold}>Coletador: </Text>
                                <Text style={style.textonormal}>{item.coletador}</Text>
                            </Row>
                        </Grid>
                        {statusColeta(item)}
                    </View>
                </TouchableOpacity>
            );
            retorno.push(temp)
        })
        if(retorno.length>0){
            return retorno;
        }
        else{
            return (<><View style={{alignItems:"center"}}><Text>Sem Coletas para Exibir</Text></View></>);
        }
    }

    //Função que verifica o status da coleta e retorna a informação de acordo:
    function statusColeta(coleta){
        //Definir variavel
        let status_id = coleta.id_lib_coleta_status;
        let nxtstatus = null;
        //Se tem metadata, pegar estado pretendido
        if(coleta.metadata){
            nxtstatus = coleta.metadata.status_destino;
        }
        /*
        STATUS POSSIVEIS:
            1 - Coletar
            2 - Coletado
            3 - Coleta Entregue
            4 - Coleta Cancelada
            5 - Coleta Finalizada
            -SE TEM METADATA
            Aguardando alteração de status para:
        */

        //Verificar se esta em transição de status
        if(nxtstatus){
            switch(nxtstatus){
                case 2:
                    return(
                        <View style={[style.status, {backgroundColor:'#F2B61A'}]}><Grid><Row>
                            <Text style={style.textobold}>Aguardando mudança de status para: </Text>
                            <Text style={style.textonormal}>Coletado</Text>
                        </Row></Grid></View>);
                case 3:
                    return(
                        <View style={[style.status, {backgroundColor:'#F2B61A'}]}><Grid><Row>
                            <Text style={style.textobold}>Aguardando mudança de status para: </Text>
                            <Text style={style.textonormal}>Entregue</Text>
                        </Row></Grid></View>);
                case 4:
                    return(
                        <View style={[style.status, {backgroundColor:'#F2B61A'}]}><Grid><Row>
                            <Text style={style.textobold}>Aguardando mudança de status para: </Text>
                            <Text style={style.textonormal}>Finalizada</Text>
                        </Row></Grid></View>
                    );
                case 5:
                    return(
                        <View style={[style.status, {backgroundColor:'#F2B61A'}]}><Grid><Row>
                            <Text style={style.textobold}>Aguardando mudança de status para: </Text>
                            <Text style={style.textonormal}>Cancelado</Text>
                        </Row></Grid></View>
                    );
                default:
                    return(
                        <View style={[style.status, {backgroundColor:'#B70000', color:'white'}]}><Grid><Row>
                            <Text style={style.textobold}>Erro na interpretação de status: </Text>
                            <Text style={style.textonormal}>Notifique a central</Text>
                        </Row></Grid></View>
                    );
            }
        }
        else{
            switch(status_id){
                case 1:
                    return (
                        <View style={[style.status, {backgroundColor:'#e5e5e5'}]}><Grid><Row>
                            <Text style={style.textobold}>Status: </Text>
                            <Text style={style.textonormal}>Coletar</Text>
                        </Row></Grid></View>
                    );
                case 2:
                    return (
                        <View style={[style.status, {backgroundColor:'#3A73E3', color:'white'}]}><Grid><Row>
                            <Text style={style.textobold}>Status: </Text>
                            <Text style={style.textonormal}>Coletado</Text>
                        </Row></Grid></View>
                    );
                case 3:
                    return (
                        <View style={[style.status, {backgroundColor:'#F2B61A'}]}><Grid><Row>
                            <Text style={style.textobold}>Status: </Text>
                            <Text style={style.textonormal}>Entregue</Text>
                        </Row></Grid></View>
                    );
                case 4:
                    return (
                        <View style={[style.status, {backgroundColor:'#B70000'}]}><Grid><Row>
                            <Text style={{fontSize:14,fontWeight:'bold',color:'white'}}>Status: </Text>
                            <Text style={{fontSize:14,color:'white'}}>Cancelada</Text>
                        </Row></Grid></View>
                    );
                case 5:
                    return (
                        <View style={[style.status, {backgroundColor:'#52DE10'}]}><Grid><Row>
                            <Text style={style.textobold}>Status: </Text>
                            <Text style={style.textonormal}>Finalizada</Text>
                        </Row></Grid></View>
                    )
                default:
                    return(
                        <View style={[style.status, {backgroundColor:'#B70000', color:'white'}]}><Grid><Row>
                            <Text style={style.textobold}>Erro na interpretação de status: </Text>
                            <Text style={style.textonormal}>Notifique a central</Text>
                        </Row></Grid></View>
                    );
           }
       }
    }

    //FUNÇÃO QUE NAVEGA P TELA EXIBIRCOLETA AO CLICAR EM UMA COLETA
    function selecionar_coleta(objeto){
        navigation.navigate('ColetaExibirScreen', {
            screen: 'ColetaExibirScreen',
            params: { coleta: objeto },
        });
    }

    //ROTAS -> ABAS
    const FirstRoute = () => (
        <View style={style.container}>
 
            <ScrollView showsVerticalScrollIndicator={false} style={style.containeraba}>

            <View style={{alignContent:'center', alignItems:'center'}}>
                {<Octicons size={100} name="package"  />}
                <Text style={{fontSize:40, color: '#000'}}></Text>
            </View>
            
            <View style={style.containerlista}>
            {
                renderizarColetas(coletas_ativas)
            }
            </View>

            </ScrollView>
        </View>
    );
      
    const SecondRoute = () => (
        <View style={style.container}>
 
            <ScrollView showsVerticalScrollIndicator={false} style={style.containeraba}>

            <View style={{alignContent:'center', alignItems:'center'}}>
                {<Octicons size={100} name="package"  />}
                <Text style={{fontSize:40, color: '#000'}}></Text>
            </View>
            
            <View style={style.containerlista}>
            {
                renderizarColetas(coletas_inativas)
            }
            </View>

            </ScrollView>
        </View>
    );
      
    const initialLayout = { width: Dimensions.get('window').width };
      
    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'first', title: 'Ativas' },
      { key: 'second', title: 'Histórico' },
    ]);

    const renderTabBar = props => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: 'red' }}
          style={{ backgroundColor: 'darkorange' }}
        />
      );

    return (
        <TabView
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            style={style.container}
        />
      );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    containeraba: {
        paddingHorizontal:20,
        paddingTop:60,
        backgroundColor: '#ECECEC',
    },
    containerlista:{
        marginTop:15, 
        paddingBottom:70,
    },

    containerColeta: {
        padding:10,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
    }, 

    textobold: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    textonormal: {
        fontSize: 14,
    },

    status: {
        padding:5,
        marginTop:10,
        alignItems: 'center',
        alignContent: 'center',
        textAlign: 'center',
    },
    scene: {
        flex: 1,
      },
});