import React, {useEffect}           from 'react';
import { Text, View, StyleSheet, Alert }   from 'react-native';
import { ScrollView, TouchableOpacity }               from 'react-native-gesture-handler';
import HeaderBlank                  from '../../component/HeaderBlank';
import Timeline                     from 'react-native-timeline-flatlist'
import AppIcon                      from '../../component/AppIcon';
import AppBadge                     from '../../component/AppBadge';
import { Badge, List }              from 'react-native-paper';
import {useSelector}                from 'react-redux';
import util                         from '../../util/util';
import { useNavigation } from '@react-navigation/native';
import LottieAlerta                 from '../../component/LottieAlerta';
import Entypo from 'react-native-vector-icons/Entypo';

export default function AlertaNaoConcluidoScreen(props) { 

    let arrayOnibus             = useSelector(state => state.onibus_em_alerta.filter_items);
    let arrayResult             = useSelector(state => state.onibus_em_alerta.alertas_nao_concluidos);
    const navigation                                = useNavigation();

    function renderCard(item){
        //console.log(id_alerta, alerta, num_onibus, garagem, at_realizadas, at_total);
        return(
            <TouchableOpacity key={item.id_alerta} onPress={() => {selecionar_alerta(item.id_onibus, item.id_alerta, item.num_onibus)}}>
                    <View style={style.container_lista} key={item.id_alerta}>
                        <View style = {{flexDirection: 'row', justifyContent:'space-between'}}>
                            <View style={style.header}>
                                <Text style={style.titulo}>CARRO {item.num_onibus}</Text>
                                <Text style={style.subtitulo}>{item.garagem}</Text>
                            </View>
                            <View >
                                <View>
                                    <Text style={{alignSelf: 'center',}}>Atuações:</Text>
                                    <Badge style={style.badge_contador}> {item.realizadas} / {item.a_realizar} </Badge>
                                </View>
                            </View>
                            <Entypo name="chevron-small-right" color="black" style={{alignSelf: 'center'}} size={20} />
                        </View>
                        <Text style={style.subtitulo, {textAlign: 'center', borderTopWidth: 1, borderBottomColor: 'gray', marginTop:10,}}>Alerta: {item.alerta_txt}</Text>
                    </View>   
            </TouchableOpacity>
        );
    }

    

    function selecionar_alerta(id_onibus, id_alerta, num_onibus ){
        navigation.navigate('v2OperacaoGaragemOnibus', {
            screen: 'v2OperacaoGaragemOnibus',
            params: { id_onibus: id_onibus, id_onibus_em_alerta: id_alerta, numero_onibus:num_onibus },
        });
    }

    function renderPrevia(){
        return(
            <TouchableOpacity key={1} onPress={() => Alert.alert("clicou")}>
                    <View style={style.container_lista} key={1}>
                        <View style = {{flexDirection: 'row', justifyContent:'space-between'}}>
                            <View style={style.header}>
                                <Text style={style.titulo}>CARRO {50100}</Text>
                                <Text style={style.subtitulo}>Novacap</Text>
                            </View>
                            <View>
                                <View><Text style={{alignSelf: 'center',}}>Atuações:</Text><Badge style={style.badge_contador}> 2 / 3 </Badge></View>
                            </View>
                        </View>
                        <Text style={style.subtitulo}>Alerta: Sem Engajamento NAVEE</Text>
                    </View>
            </TouchableOpacity>
        );

    }

    return (
        <View style={style.container}>
            <HeaderBlank
            content={
                <View style={{alignItems: 'center'}}>
                    <LottieAlerta />
                    <Text style={{fontSize: 24, marginTop: 10}}>Alertas não Concluídos</Text>
                </View>
            }
            >Fechar</HeaderBlank>

            {//arrayOnibus.map((onibus)=>processarAtuação(onibus))
            console.log(arrayResult)
            }
            {(arrayResult.length) ? arrayResult.map((item)=>renderCard(item)) : <></>
            }
            
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1
    },
    container_lista: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginBottom:10,
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 2,
        textTransform: 'uppercase'
    },
    subtitulo: {
        fontSize: 16,
        marginVertical: 2
    },
    badge_contador:{
        alignSelf: 'center',
        backgroundColor: '#dbdbdb',
        width:100,
        height:50,
        borderRadius:10,
        fontSize:18,
    },
    header: {
        paddingRight:10,
        width:'65%',
    },
});
