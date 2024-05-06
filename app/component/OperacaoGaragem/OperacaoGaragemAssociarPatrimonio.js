import React, {useState}                        from 'react';
import { View, Text, StyleSheet }                           from 'react-native';
import { Button, List, Searchbar }                                 from 'react-native-paper';
import { connect }                              from 'react-redux';
import { ScrollView, TouchableOpacity }         from 'react-native-gesture-handler';
import { useNavigation }                        from '@react-navigation/native';
import { useRoute }                             from '@react-navigation/native';
import store                                    from './../../state/store';
import ConfirmarAcaoScreen                      from '../../screen/App/ConfirmarAcaoScreen';
import Entypo                                   from 'react-native-vector-icons/Entypo';
import LottieEmptyBox                           from '../LottieEmptyBox';
import util                                     from './../../util/util';

function OperacaoGaragemAssociarPatrimonio(props) {

    const {params}                                              = useRoute()
    const navigation                                            = useNavigation();
    let onibus_em_alerta                                        = params.params.onibus_em_alerta;
    let arr_equipamento                                         = (onibus_em_alerta['arr_equipamento'] !== undefined) ? util.obj_to_array(onibus_em_alerta.arr_equipamento) : [];
    let alerta                                                  = params.params.alerta;
    let onibus_em_alerta_atuacao                                = params.params.onibus_em_alerta_atuacao;
    let   [search_text, setSearchText]                          = useState(null); 
    let   [arr_patrimonio, setArrPatrimonio]                    = useState(props.state.patrimonio_recebido.filter_items);
    const [arr_patrimonio_bckp]                                 = useState(props.state.patrimonio_recebido.filter_items);
    let substituir                                              = (props.substituir !== undefined) ? props.substituir : false;

    // Há patrimônios que podem ser utilizados no DOOH e Navee
    // Que são, Player e Modem. Nesse caso, filtrar para verificar se já existe patrimônio associado
    // Para perguntar ao usuário se ele deseja reutilizar
    let arr_equipamento_reutilizar      = arr_equipamento.filter((item) => {
        if (item.id_lib_equipamento_tipo == 1 && onibus_em_alerta_atuacao.has_player == '1'){
            return item;
        }
        if (item.id_lib_equipamento_tipo == 2 && onibus_em_alerta_atuacao.has_modem == '1'){
            return item;
        }
    });
    let patrimonio_reutilizar           = arr_equipamento_reutilizar.length === 1 ? arr_equipamento_reutilizar[0] : null;

    function filtrar_patrimonio(){
        if (!search_text){
            setArrPatrimonio(arr_patrimonio_bckp);
        } else {
            setArrPatrimonio(arr_patrimonio_bckp.filter(item=>{
                if (item.patrimonio.endsWith(search_text)){
                    return item;
                }
            }));
        }
    }

    function selecionar_patriminio(item, reutilizar=false){
        if (substituir == false){
            navigation.navigate('ConfirmarAssociarPatrimonioScreen', {
                screen: 'ConfirmarAssociarPatrimonioScreen',
                params: { 
                    onibus_em_alerta:            onibus_em_alerta, 
                    alerta:                      alerta,
                    onibus_em_alerta_atuacao:    onibus_em_alerta_atuacao,
                    patrimonio:                  item,
                    reutilizar:                  reutilizar
                },
            });
        } else {

            // Estamos no Fluxo de Substituição de Patrimônio
            props.setEquipamentoEntrada(item);
            props.setActive((p) => p + 1);

        }
    }

    return (
    <>
    {
        (patrimonio_reutilizar && substituir == false) ?
            <View style={style.container_equip_reutilizar}>
                <Text style={style.text_reutilizar}>O patrimônio {patrimonio_reutilizar.patrimonio} está associado a este carro. Deseja reutilizar?</Text>
                <Button onPress={() => { selecionar_patriminio(patrimonio_reutilizar, true) }} mode="outlined" color="white" style={style.btn_reutilizar}>SIM, REUTILIZAR</Button>
            </View>
        :<></>
    }
    <View style={{marginHorizontal: 10, marginVertical: 10}}>
        <View style={style.container_searchbar}>
            <Searchbar
                placeholder="Buscar pelo Nº do Patrimônio" 
                keyboardType="number-pad"
                onChangeText={(str) => setSearchText(str)} 
                onSubmitEditing={()=>filtrar_patrimonio()}
                onIconPress={()=>filtrar_patrimonio()}
            /> 
        </View>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>Selecione o patrimônio a ser associado:</Text> 
    </View>
    {
        arr_patrimonio.length ? (
            arr_patrimonio.map((item) => {
                return (
                    <TouchableOpacity key={item.id_equipamento} onPress={() => {selecionar_patriminio(item)}}>
                        <List.Item 
                        title={item.patrimonio} 
                        description={item.descricao} 
                        right={ props => 
                            <View style={{flexDirection: 'row'}}>
                                <Entypo name="chevron-small-right" color="black" style={{alignSelf: 'center'}} size={20} />
                            </View>
                        }/>
                    </TouchableOpacity> 
                )
            })    
        ) : (
            <LottieEmptyBox titulo="Sem patrimônio para associar" />
        )
    }
    </>
    )
}

const style = StyleSheet.create({
    container_equip_reutilizar: {
        marginHorizontal: 10, 
        borderRadius: 5, 
        borderWidth: 1,
        borderColor: 'lightgray',
        padding: 20,
        backgroundColor: 'whitesmoke',
    },
    text_reutilizar: {
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 25,
        color: 'black'
    },
    btn_reutilizar: {
        padding: 5,
        marginTop: 20,
        backgroundColor: 'darkorange'
    },
    container_searchbar: {
        marginBottom: 30
    }
});

export default connect(function mapStateToProps(state){ return {state} })(OperacaoGaragemAssociarPatrimonio); 