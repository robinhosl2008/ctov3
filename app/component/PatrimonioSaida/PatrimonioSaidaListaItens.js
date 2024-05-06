import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import LottieFolderOpen from '../LottieFolderOpen';
import { connect } from 'react-redux';
import { addDelPatrimonioRecebidoEnviar } from './../../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import CardTitle from '../CardTitle';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { List, Checkbox, Searchbar } from 'react-native-paper';
import RNPickerSelect from "react-native-picker-select";
import PatrimonioEntradaSemItem from '../PatrimonioEntrada/PatrimonioEntradaSemItem';
import { filterParamPatrimonioRecebido, clearFilterParamPatrimonioRecebido } from './../../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import store from './../../state/store';

function PatrimonioSaidaListaItens(props) {

    let arr_filter_items            = props.state.patrimonio_recebido.filter_items;
    let envio_patrimonio            = props.state.patrimonio_recebido.envio_patrimonio;
    let arr_id_patrimonio_enviar    = envio_patrimonio.arr_id_patrimonio_enviar;

    //função que filtra pelo número do patrimônio quando o usuario digita no campo
    function filtrar(str){
        console.log(":::::FILTRANDO PATRIMONIO: " + str);
        store.dispatch(filterParamPatrimonioRecebido({patrimonio: str}));
    }

    //função que filtra por categoria, trazendo de volta apenas itens de uma categoria especifica e limpando filtros quando categoria nula
    function filtrar_tipo(tipo){
        if(tipo!=null){
            console.log(":::::FILTRANDO POR TIPO: " + tipo);
            store.dispatch(filterParamPatrimonioRecebido({id_lib_equipamento_tipo: tipo}));
        }else{
            console.log(":::::Limpando Filtro: " + tipo);
            store.dispatch(clearFilterParamPatrimonioRecebido());
            
        }
        console.log(arr_filter_items);
    }

    //Função que checa se algum item será exibido no loop
    //Corrige falha em casos onde a lista retorna item mas não são renderizados, mostrando sem resultados na tela
    function checa_itens(array){
        let verificador = false;
        array.map(function(item){
            if (item.id_equipamento_status == envio_patrimonio.id_status_inicio){
                verificador = true
            }
        })
        return verificador;
    }

    return (
        <>
        <View>
            <View style={{marginBottom: 10}}>
                <View style={{marginVertical: 10, backgroundColor: 'white', borderRadius: 10, padding: 10}}>
                    <Text style={{fontSize:14, marginBottom:3, fontWeight: 'bold'}} >Filtrar Por:</Text>
                    <View style={style.ordena_onibus}>
                        <RNPickerSelect
                            pickerProps={{style : {width: '100%', height:30,}, inputAndroid: {backgroundColor:'white'} }}
                            style={{backgroundColor:'white'}}
                            placeholder={{
                                label: 'Sem Filtro',
                                value: null,
                                color: 'black'
                            }}
                            onValueChange={(value) => filtrar_tipo(value)}
                            items={[
                                { label: "Player", value: 1 },
                                { label: "Modem", value: 2 },
                                { label: "Tela", value: 3 },
                                { label: "Roteador", value: 4 },
                            ]}
                        />
                    </View>
                </View>
                <Searchbar
                    style={style.pesquisa_onibus}
                    placeholder="Filtrar por Nº do Patrimônio"
                    onChangeText={(str) => filtrar(str)}
                    keyboardType="number-pad"
                />
            </View>
            {
            //FUNÇÃO ALTERADA:
            //SE ARRAY FILTRADO TIVER ITENS E A FUNÇÃO CHECA ITENS RETORNAR TRUE, ALGO SERA RENDERIZADO, PROSSEGUIR COM LOOP
            //SENÃO MOSTRAR SEM ITENS 
            arr_filter_items.length && checa_itens(arr_filter_items) ? 
            (
            <CardTitle style={{marginBottom: 120}} title="Selecione os Patrimônios" subTitle="Marque os patrimônios que você deseja transferir.">
                <ScrollView>
                    <View>
                        {
                            arr_filter_items.sort((a,b) => {
                                const nameA = a.patrimonio.toUpperCase(); // ignore upper and lowercase
                                const nameB = b.patrimonio.toUpperCase(); // ignore upper and lowercase
                                if (nameA < nameB) {
                                  return -1;
                                }
                                if (nameA > nameB) {
                                  return 1;
                                }
                              
                                // names must be equal
                                return 0;
                            }).map(item => {
                                //console.log("\n\n\nITEM PATRIMONIO:");console.log(item);console.log("Tamanho do array:" + arr_filter_items.length);console.log("\n\n\n");
                                if (item.id_equipamento_status == envio_patrimonio.id_status_inicio){
                                    
                                    return (
                                        <TouchableOpacity onPress={() => { store.dispatch(addDelPatrimonioRecebidoEnviar(item.id_equipamento)) }} key={item.id_equipamento} >
                                            <List.Item title={item.patrimonio} description={item.descricao} right={props => <Checkbox color="darkorange" status={ (arr_id_patrimonio_enviar.indexOf(item.id_equipamento) > -1) ? 'checked' : 'unchecked' } />}/>
                                        </TouchableOpacity>
                                    )
                                }
                            })
                        }
                    </View>
                </ScrollView> 
            </CardTitle>    
            ) : (
                <PatrimonioEntradaSemItem></PatrimonioEntradaSemItem>
            ) }
        </View>
        </>
    )
}
const style = StyleSheet.create({
    pesquisa_onibus: {
        height:45,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom:10,
        padding: 0,
        shadowOpacity: 0,
    },
})

export default connect(function mapStateToProps(state){ return {state} })(PatrimonioSaidaListaItens);
