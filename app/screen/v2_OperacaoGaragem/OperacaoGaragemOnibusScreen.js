import React from 'react'
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Badge, Button, Card, List, Paragraph, Title } from 'react-native-paper';
import HeaderBlank from '../../component/HeaderBlank';
import store  from '../../state/store';
import { useRoute }         from '@react-navigation/native';
import { useNavigation }    from '@react-navigation/native';
import AppButton from '../../component/AppButton';
import { useSelector } from 'react-redux'
import OperacaoGaragemRightBusInfo from '../../component/v2OperacaoGaragem/OperacaoGaragemRightBusInfo';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import util from '../../util/util';
import AppIcon from './../../component/AppIcon';
import { Col, Row, Grid } from "react-native-easy-grid";

export default function OperacaoGaragemOnibusScreen(props) {

    const state                     = store.getState();
    const lib_em_alerta_atuacao     = state.lib.lib_em_alerta_atuacao;
    const {params}                  = useRoute()
    const navigation                = useNavigation(); 
    let id_onibus                   = params.params.id_onibus;
    //let alertas                     = util.obj_to_array(params.params.arr_alerta);
    let arrayatuacao                = [];
    //let id_onibus_em_alerta         = params.params.id_onibus_em_alerta;

    // Obtém apenas os dados do Ônibus em Alerta
    let onibus_em_alerta = useSelector(state => state.onibus_em_alerta.filter_items.filter((item) => {
        if (item.id_onibus == id_onibus){
            return item;
        }
    }))[0];
    
    let arr_equipamento = null;
    if(onibus_em_alerta!=undefined){
        arr_equipamento = (onibus_em_alerta['arr_equipamento'] !== undefined) ? util.obj_to_array(onibus_em_alerta.arr_equipamento).sort(util.order_by("id_lib_equipamento_tipo")) : [];
    }
    
    //let alerta          = onibus_em_alerta['arr_alerta'][id_onibus_em_alerta];
    let alertas = null;
    if(onibus_em_alerta!=undefined){
        alertas = (onibus_em_alerta['arr_alerta'] != undefined) ? util.obj_to_array(onibus_em_alerta.arr_alerta): [];
    }
    let contagemalertas = [];

    function selecionar_atuacao(){
        navigation.navigate('v2OperacaoGaragemListarAtuacaoScreen', {
            screen: 'v2OperacaoGaragemListarAtuacaoScreen',
            params: { id_onibus: id_onibus, id_onibus_em_alerta: id_onibus_em_alerta },
        });
    }
 
    function abrir_atuacao(idonibus, idonibusemalerta){ 
        navigation.navigate('v2OperacaoGaragemListarAtuacaoScreen', {
            screen: 'v2OperacaoGaragemListarAtuacaoScreen',
            params: { id_onibus: idonibus, id_onibus_em_alerta: idonibusemalerta },
        });
    }

    function selecionar_onibus_sem_atuacao(){
        navigation.navigate('OperacaoGaragemSemAtuacaoScreen', {
            screen: 'OperacaoGaragemSemAtuacaoScreen',
            params: { 
                onibus_em_alerta:       onibus_em_alerta,
                id_onibus_em_alerta:    id_onibus_em_alerta,
                popCount: 2,
            },
        });
    }

    function abrir_onibus_sem_atuacao(alerta){
        navigation.navigate('OperacaoGaragemSemAtuacaoScreen', {
            screen: 'OperacaoGaragemSemAtuacaoScreen',
            params: { 
                onibus_em_alerta:       onibus_em_alerta,
                alerta:                 alerta,
                popCount: 2,
            },
        });
    }

    function render_icon(item) {
        switch(item.id_lib_equipamento_tipo){
            case 1: return <Octicons style={{color: 'black', marginStart: 8}} name="server" size={25} />;
            case 2: return <Fontisto style={{color: 'black'}} name="wifi" size={20} />;
            case 3: return <SimpleLineIcons style={{color: 'black'}} name="screen-desktop" size={25} />;
            case 4: return <MaterialCommunityIcons style={{color: 'black'}} name="router-wireless" size={25} />;
            default: {
                return <></>
            }
        }
    }

    function contarAlertas(alerta){
        let total_obrigatorias = 0;
        let total_optativas = 0;
        let concluidas_obrigatorias = 0;
        let concluidas_optativas = 0;
        let total = 0;
        let concluidas = 0;
        let arrayatuacao = []

        //console.log(alerta.arr_atuacao);

        if(alerta.arr_atuacao != undefined){
            arrayatuacao = util.obj_to_array(alerta.arr_atuacao);
        }
        for(let atuacao of arrayatuacao){
            if(atuacao.has_obrigatorio==1){
                total_obrigatorias ++;
                if(atuacao.metadata!=undefined || atuacao.id_lib_em_alerta_atuacao_status == 2 || atuacao.id_lib_em_alerta_atuacao_status == 4){
                    concluidas_obrigatorias ++;
                }
            }
            else{
                total_optativas ++;
                if(atuacao.metadata!=undefined || atuacao.id_lib_em_alerta_atuacao_status == 2 || atuacao.id_lib_em_alerta_atuacao_status == 4){
                    concluidas_optativas ++;
                }
            }
        }

        total = total_obrigatorias + total_optativas;
        concluidas = concluidas_obrigatorias + concluidas_optativas;

        return (
            <View>
                {(total_obrigatorias==0)?<Text style={{fontSize:14,color:'#ff3d00', fontWeight:'bold'}}>Sem atuações obrigatórias</Text>:<Text style={{fontSize:14,color:'#ff3d00', fontWeight:'bold'}}>{concluidas_obrigatorias} de {total_obrigatorias} obrigatórias</Text>}
                {(total_optativas==0)?<Text style={{fontSize:12, color:'#808080'}}>Sem atuações opcionais</Text>:<Text style={{fontSize:12, color:'#808080'}}>{concluidas_optativas} de {total_optativas} opcionais</Text>}
            </View>
        );
    }

    return (
        <>
        <View style={style.container}>

        { //<HeaderBlank content={<OperacaoGaragemRightBusInfo numero_onibus={onibus_em_alerta.numero_onibus} alerta={alerta.alerta} />}> 
        }
            <HeaderBlank>
                Fechar
            </HeaderBlank>
 
            <ScrollView showsVerticalScrollIndicator={false}>

            <View style={{alignContent:'center', alignItems:'center'}}>
                <AppIcon lib="Fontisto" icon="bus" size={50} style={{marginEnd: 5}}></AppIcon>
                <Text style={style.numero_onibus}>{(onibus_em_alerta!=undefined)?(onibus_em_alerta.numero_onibus):""}</Text>
                <Text style={style.garagem}>{(onibus_em_alerta!=undefined)?(onibus_em_alerta.garagem):""}</Text>
                <View style={style.status}>
                    {
                        (onibus_em_alerta!=undefined)?(
                            onibus_em_alerta.has_alerta ? (
                                <>
                                { onibus_em_alerta.prioridade == '1' ? <><View style={[style.badge_prioridade]}><Text style={{color: '#fff', fontSize: 14,}}>PRIORIDADE</Text></View></> : <></> }
                                <View style={[style.badge_status]}><Text style={{color:'#fff', fontSize:14,}}>EM ALERTA</Text></View>
                                <Text style={{paddingHorizontal: 5}}>|</Text>
                                <Text style={{fontSize: 14, fontWeight: 'bold'}}>{(onibus_em_alerta.em_alerta_at) ? util.diff_in_days(onibus_em_alerta.em_alerta_at) + " dia(s)" : "Tempo Indefinido"}</Text>
                                </>
                            ) : (
                                <>
                                <Text>...</Text>
                                </>)
                        ):(<></>)
                    }
                </View>
            </View>
            
            <View style={{marginTop:15}}>
            {
                (alertas!=null)?(
                alertas.map((alerta)=> {
                    if( !alerta.metadata && alerta.id_lib_em_alerta_status == 1){
                        return(
                            <>
                            <View key={alerta.id_onibus_em_alerta} style={{marginBottom:10, borderRadius:10, backgroundColor:'#f1f1f1', paddingVertical:10, paddingHorizontal:20,}}>
                                <Text style={{color:'#000000', fontSize:20, fontWeight:'bold'}}>{alerta.alerta}</Text>
                                {contarAlertas(alerta)}
                                {/*console.log("onibus" + onibus_em_alerta)*/}
                                <Grid style={{marginTop:5}}>
                                    <Col style={{paddingHorizontal:5,}}>
                                        <AppButton style={{width:'100%'}} onPress={() => abrir_atuacao(onibus_em_alerta.id_onibus, alerta.id_onibus_em_alerta)}><Text>Atuar</Text></AppButton>
                                    </Col>
                                    <Col style={{paddingHorizontal:5,}}>
                                        <AppButton style={{flexGrow: 1, backgroundColor: 'black',}} onPress={() => abrir_onibus_sem_atuacao(alerta)}>Sem Atuação</AppButton>
                                    </Col>
                                </Grid>
                            </View>
                            </>
                        )
                    }
                    else{
                        return(<></>);
                    }
                })
                ):(<></>)
            }
            </View>

            </ScrollView>
            <View style={{marginVertical:10,}}>
                <Text style={{fontWeight:'bold', marginBottom:5}}>Equipamentos Associados:</Text>
                <ScrollView showsHorizontalScrollIndicator={false} style={style.bottom_links} horizontal={true}>
                
                {
                (arr_equipamento)?(
                arr_equipamento.map((item) => {
                    return (
                        <>
                        <View style={style.bottom_card}>
                            <View style={style.bottom_icons}>
                                <Row style={{alignItems:'center', justifyContent:'space-between'}}>
                                    {render_icon(item)}
                                    {(item.sync === false) ? (
                                        <Ionicons style={{color: 'lightgray'}} name="ios-checkmark-circle-outline" size={18} />
                                    ) : (
                                        <Ionicons style={{color: 'green'}} name="ios-checkmark-done-circle" size={20} />
                                    )}
                                </Row>
                            </View>
                            <View style={style.bottom_texts}>
                                <Text style={style.bottom_equip_id}>{item.patrimonio}</Text>
                                <Text style={style.bottom_equip_name}>{item.descricao}</Text>
                            </View>
                        </View>
                        </>
                    )
                })
                ):(<></>)
            }
                    
                </ScrollView>
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
    numero_onibus: {
        fontSize: 36,
        fontWeight: 'bold'
    },
    garagem: {
        fontSize: 14,
        marginTop:-7,
        marginBottom:10,
    },
    container_actions: {
        backgroundColor: 'white',
        padding: 30
    },
    badge_status: {
        borderRadius: 5,
        alignSelf: 'center',
        backgroundColor: 'orangered',
        color: 'white',
        paddingVertical: 5,
        paddingHorizontal:10
    },
    status: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    badge_prioridade: {
        borderRadius: 5,
        alignSelf: 'center',
        backgroundColor: '#6b0700',
        color: 'white',
        paddingVertical: 5,
        paddingHorizontal:10,
        marginRight:5,
    },
    bottom_links: {
        height:130,
    },
    bottom_card: {
        width:130,
        height:130,
        backgroundColor:'#f1f1f1',
        padding:5,
        marginRight:10,
    },
    bottom_icons: {
        height:60,
        flexDirection:'row',
        alignItems:'flex-start',
        justifyContent: 'space-between',
    },
    bottom_texts: {
        height:60,
        justifyContent:'flex-end',
        alignItems:'center',
    },
    bottom_equip_id: {
        fontSize:16,
        fontWeight:'bold',
        textAlign:'center',
    },
    bottom_equip_name: {
        fontSize:12,
        textAlign:'center',
    },
});