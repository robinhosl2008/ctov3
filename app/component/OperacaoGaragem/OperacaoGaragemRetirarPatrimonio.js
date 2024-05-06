import React, { useState }              from 'react';
import { useNavigation, useRoute }      from '@react-navigation/native';
import { View, Text, StyleSheet }       from 'react-native';
import Octicons                         from 'react-native-vector-icons/Octicons';
import SimpleLineIcons                  from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons           from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto                         from 'react-native-vector-icons/Fontisto';
import Entypo                           from 'react-native-vector-icons/Entypo';
import Ionicons                         from 'react-native-vector-icons/Ionicons';
import { connect }                      from 'react-redux';
import util                             from './../../util/util';
import OperacaoGaragemService           from './../../service/OperacaoGaragemService';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { List } from 'react-native-paper';
import OperacaoGaragemOnibusHeader from './OperacaoGaragemOnibusHeader';

export default function OperacaoGaragemRetirarPatrimonio(props) {

    const {params}                      = useRoute()
    const navigation                    = useNavigation();
    let obj_params                      = params.params;
    let onibus_em_alerta                = obj_params.onibus_em_alerta;
    let id_lib_equipamento_tipo         = props.id_lib_equipamento_tipo; 
    
    // Obtém apenas os dados do Alerta selecionado anteriormente
    let arr_equipamento = (onibus_em_alerta.arr_equipamento !== undefined) ? onibus_em_alerta.arr_equipamento : [];
    arr_equipamento     = util.obj_to_array(arr_equipamento).sort(util.order_by("id_lib_equipamento_tipo"));

    function render_icon(item) {
        switch(item.id_lib_equipamento_tipo){
            case 1: return <Octicons style={{color: 'black', alignSelf: 'center'}} name="server" size={25} />;
            case 2: return <Fontisto style={{color: 'black'}} name="wifi" size={20} />;
            case 3: return <SimpleLineIcons style={{color: 'black'}} name="screen-desktop" size={25} />;
            case 4: return <MaterialCommunityIcons style={{color: 'black'}} name="router-wireless" size={25} />;
            default: {
                return <></>
            }
        }
    }

    function selecionar_equipamento_retirar(equipamento){

        // Associa o equipamento selecionado
        props.setEquipamentoSaida(equipamento);

        // Pula para próxima etapa do Fluxo de Retirada de Patrimonio
        props.setActive((p) => p + 1);

    }

    return (
        <View style={[style.container, props.style]}>
            <Text style={style.title}>Selecione o Patrimônio a ser desassociado</Text>
            {
                (arr_equipamento.length === 0) ? (
                    <View><Text>Não há patrmiônio</Text></View>
                ) : (
                    <View style={style.container_equipamentos}>
                        <ScrollView>
                            {
                                arr_equipamento.map((item) => {
                                    if (item.sync && item.id_lib_equipamento_tipo == id_lib_equipamento_tipo){
                                        return (
                                            <TouchableOpacity key={item.id_equipamento} onPress={() => { selecionar_equipamento_retirar(item); }}>
                                                <List.Item
                                                    title={item.patrimonio}
                                                    description={item.descricao}
                                                    left={props => <View style={{justifyContent: 'center', alignContent: 'center', marginEnd: 10}}>{ render_icon(item) }</View> }
                                                    right={props => <Entypo name="chevron-small-right" color="black" style={{alignSelf: 'center'}} size={20} />}
                                                    style={style.item}
                                                />
                                            </TouchableOpacity>
                                            )
                                    }
                                })
                            }
                        </ScrollView>
                    </View>    
                )
            }
        </View>
    )

}


const style = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        width: '100%'
    },
    title:{ 
        marginBottom: 20, 
        fontWeight: 'bold', 
        fontSize: 18
    },
    container_equipamentos: {
        flexDirection: 'column',
        width: '100%'
    },
    box_equip: {
        alignItems: 'center',
        marginEnd: 10,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        width: 100
    }
});
