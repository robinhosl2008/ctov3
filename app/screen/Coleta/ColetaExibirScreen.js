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
import ColetaService from './../../service/ColetaService';

export default function ColetaExibirScreen(props) {
    
    const state                     = store.getState();
    const navigation                = useNavigation();
    //Variaveis
    const {params}                  = useRoute();
    //Definir o objeto de coleta recebido como parametro
    let coleta                      = params.params.coleta;
    console.log(coleta);
    //Dado do usuário logado
    let user_id                   = useSelector(state=>state.app.user_auth.id);

    async function atualizar_coleta(nxtstatus){

        await ColetaService.atualizar_coleta({
            coleta:                     coleta,
            nxtstatus:                  nxtstatus,
        }).catch((error) => {

            console.error("::: ERRO AO ATUALIZAR COLETA :::");
            console.error("::: ERRO AO ATUALIZAR COLETA :::");
            console.error("::: ERRO AO ATUALIZAR COLETA :::");
            console.error(error);

        });

        navigation.navigate('LoadingSuccessScreen', {
            screen: 'LoadingSuccessScreen',
            params: { 
                popCount: 3,
            },
        });

    }

    

    //Definir coletas ativas e inativas
    //let coletas_filtradas = filtrarColetas(arr_coletas);
    //let coletas_ativas = coletas_filtradas[0];
    //let coletas_inativas = coletas_filtradas[1];

    //console.log("::::\n::::\n::::coletas ativas")
    //console.log(coletas_ativas)
    //console.log("::::\n::::\n::::coletas inativas")
    //console.log(coletas_inativas)

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
       //Verificar se tem metadata
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
            if(status_id == 1){
                return (
                    <View style={[style.status, {backgroundColor:'#e5e5e5'}]}>
                        <Grid>
                            <Row>
                                <Text style={style.textobold}>Status: </Text>
                                <Text style={style.textonormal}>Coletar</Text>
                            </Row>
                        </Grid>
                    </View>
                )
            }
            else if(status_id == 2){
                return (
                    <View style={[style.status, {backgroundColor:'#3A73E3', color:'white'}]}>
                        <Grid>
                            <Row>
                                <Text style={style.textobold}>Status: </Text>
                                <Text style={style.textonormal}>Coletado</Text>
                            </Row>
                        </Grid>
                    </View>
                )
            }
            else if(status_id == 3){
                return (
                    <View style={[style.status, {backgroundColor:'#F2B61A'}]}>
                        <Grid>
                            <Row>
                                <Text style={style.textobold}>Status: </Text>
                                <Text style={style.textonormal}>Entregue</Text>
                            </Row>
                        </Grid>
                    </View>
                 )
            }
            else if(status_id == 4){
                return (
                    <View style={[style.status, {backgroundColor:'#B70000', color:'white'}]}>
                        <Grid>
                            <Row>
                                <Text style={style.textobold}>Status: </Text>
                                <Text style={style.textonormal}>Cancelada</Text>
                            </Row>
                        </Grid>
                    </View>
                )
            }
            if(status_id == 5){
                return (
                    <View style={[style.status, {backgroundColor:'#52DE10'}]}>
                        <Grid>
                            <Row>
                                <Text style={style.textobold}>Status: </Text>
                                <Text style={style.textonormal}>Finalizada</Text>
                            </Row>
                        </Grid>
                    </View>
                )
            }
       }
    }

    //Função que renderiza botões de opção de acordo com o status e a relação do usuário logado com a coleta
    function RenderizaBotao (usuarioid, coleta){
        /*
        STATUS POSSIVEIS:
            1 - Coletar
            2 - Coletado
            3 - Coleta Entregue
            4 - Coleta Cancelada
            5 - Coleta Finalizada
        */
        //Se tem metadata, Nada a exibir
        if(coleta.metadata){
            return(<></>);
        }
        //Se não tem metadata, checar o status para verificar se algum botão será exibido
        else{
            //Se status da coleta for coletar
            if(coleta.id_lib_coleta_status==1){
                //Se for remetente - PODE CANCELAR
                if(usuarioid == coleta.id_remetente){
                    return(
                        <View style={[style.containerButton]}>
                            <Button 
                                style={{backgroundColor: '#CC3100',width: '100%',}}
                                contentStyle={{height:50}}
                                labelStyle={{color:'white'}}
                                onPress={() => atualizar_coleta(4)}
                            >
                                Cancelar Esta Coleta
                            </Button>
                        </View>
                    );
                }
                //se for coletador - PODE COLETAR
                if(usuarioid == coleta.id_coletador){
                    return(
                        <View style={[style.containerButton]}>
                            <Button 
                                style={{backgroundColor: '#19BE3E',width: '100%',}}
                                contentStyle={{height:50}}
                                labelStyle={{color:'white'}}
                                onPress={() => atualizar_coleta(2)}
                            >
                                Coletar
                            </Button>
                        </View>
                    );
                }
                return(<></>)
            }
            //Se status da coleta for coletado
            else if(coleta.id_lib_coleta_status==2){
                //se for coletador - PODE ENTREGAR
                if(usuarioid == coleta.id_coletador){
                    return(
                        <View style={[style.containerButton]}>
                            <Button 
                                style={{backgroundColor: '#19BE3E',width: '100%',}}
                                contentStyle={{height:50}}
                                labelStyle={{color:'white'}}
                                onPress={() => atualizar_coleta(3)}
                            >
                                Finalizar Coleta
                            </Button>
                        </View>
                    );
                }
                return(<></>)
            }
            //Se status da coleta for Entregue
            else if(coleta.id_lib_coleta_status==3){
                //se for coletador - PODE ENTREGAR
                if(usuarioid == coleta.id_destinatario){
                    return(
                        <View style={[style.containerButton]}>
                            <Button 
                                style={{backgroundColor: '#1E8BEF',width: '100%',}}
                                contentStyle={{height:50}}
                                labelStyle={{color:'white'}}
                                onPress={() => atualizar_coleta(5)}
                            >
                                Confirmar Recebimento
                            </Button>
                        </View>
                    );
                }
                return(<></>)
            }
            else{
                return(<></>);
            }
        }
        
    }

    return (
        <ScrollView style={style.container}>
 
            <View showsVerticalScrollIndicator={false} style={style.containeraba}>

            <View style={{alignContent:'center', alignItems:'center'}}>
                {<Octicons size={100} name="package"  />}
                <Text style={{fontSize:40, color: '#000'}}></Text>
            </View>
            
            <View style={{paddingBottom:20}}>
                {statusColeta(coleta)}
                <Grid style={{paddingTop:20,}}>
                    <Row>
                        <Text style={style.labellote}>
                            {"LOTE: "}
                        </Text>
                        <Text style={style.labellote}>
                            {coleta.id}
                        </Text>
                    </Row>
                    <Row>
                        <Text style={style.textobold}>
                            {"Remetente: "}
                        </Text>
                        <Text style={style.textonormal}>
                            {coleta.remetente}
                        </Text>
                    </Row>
                    <Row>
                        <Text style={style.textobold}>
                            {"Destinatário: "}
                        </Text>
                        <Text style={style.textonormal}>
                            {coleta.destinatario}
                        </Text>
                    </Row>
                    <Row>
                        <Text style={style.textobold}>
                            {"Coletador: "}
                        </Text>
                        <Text style={style.textonormal}>
                            {coleta.coletador}
                        </Text>
                    </Row>
                </Grid>
                <View>
                    <View style={style.titulossecao}>
                        <Text style={style.textobold}>Patrimônios: </Text>
                    </View>
                    <View style={{paddingLeft:20,}}>
                        {
                        coleta.arr_item.map(item => (
                            <Text key={item.patrimonio} style={style.textonormal}>{item.patrimonio}</Text>
                        ))    
                        }
                    </View>
                </View>
                <View>
                    <View style={style.titulossecao}>
                        <Text style={style.textobold}>Observação: </Text>
                    </View>
                    <View style={style.observacaobox}>
                        <Text style={style.observacaotexto}>{coleta.observacao}</Text>
                    </View>
                </View>
            </View>
            {RenderizaBotao(user_id, coleta)}

            </View>
        </ScrollView>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom:10,
    },

    containeraba: {
        paddingHorizontal:20,
        paddingTop:60,
        paddingBottom:20,
        backgroundColor: '#ECECEC',
    },

    containerColeta: {
        padding:10,
        backgroundColor: 'white',
        borderRadius: 10,
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
    labellote: {
        fontSize:20,
        fontWeight: 'bold',
    },
    textlote: {
        fontSize:20,
    },

    titulossecao: {
        paddingTop:20,
        paddingBottom:5,
    },

    observacaobox: {
        padding:5,
        backgroundColor:'white',
        minHeight:100,
    },
    observacaotexto: {
        textAlign:'justify',
    },
});