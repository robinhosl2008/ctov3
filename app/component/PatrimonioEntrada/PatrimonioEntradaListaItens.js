import React from 'react';
import { StyleSheet, TouchableOpacity, View, TouchableHighlight } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Checkbox, List, Button } from 'react-native-paper';
import CardTitle from './../CardTitle';
import { connect } from 'react-redux';
import store from './../../state/store';
import { 
    addPatrimonioReceber,
    delPatrimonioReceber,
    addDelPatrimonioReceber
 } from '../../state/EquipamentoFuncionarioControle/PatrimonioEncaminhadoAction';
import LottieEmptyBox from '../LottieEmptyBox';
import PatrimonioEntradaSemItem from './PatrimonioEntradaSemItem';

function PatrimonioEntradaListaItens(props) {

    let arr_filter_items            = props.state.patrimonio_encaminhado.filter_items;
    let arr_id_patrimonio_receber   = props.state.patrimonio_encaminhado.arr_id_patrimonio_receber;

    //Função para renderizar uma lista aleatoria de x itens para testes
    function lista_aleatoria(qtditens){
        let retorno = [];
        for(let i=0; i<qtditens; i++){
            retorno.push(
                <TouchableOpacity key={i} >
                    <List.Item title={"item"+i} description={"item"+i+" descrição"} right={props => <Checkbox color="darkorange" status={ (arr_id_patrimonio_receber.indexOf(i) > -1) ? 'checked' : 'unchecked' } />}/>
                </TouchableOpacity>
            )
        }
        return retorno;
    }

    return (
        <View>
            {arr_filter_items.length ? 
            (
            <CardTitle style={{marginTop: 10, marginBottom: 80, paddingBottom: 130}} title="Selecione os Patrimônios" subTitle="Marque todos os patrimônios que você recebeu em mãos.">
                <ScrollView>
                    <View style={{paddingBottom:50}}>
                        {
                            //lista_aleatoria(30)  
                            arr_filter_items.map(item => (
                                <TouchableOpacity onPress={() => { store.dispatch(addDelPatrimonioReceber(item.id_equipamento)) }} key={item.id_equipamento} >
                                    <List.Item title={item.patrimonio} description={item.descricao} right={props => <Checkbox color="darkorange" status={ (arr_id_patrimonio_receber.indexOf(item.id_equipamento) > -1) ? 'checked' : 'unchecked' } />}/>
                                </TouchableOpacity>
                            )).sort()
                        }
                    </View>
                </ScrollView> 
            </CardTitle>    
            ) : (
                <PatrimonioEntradaSemItem></PatrimonioEntradaSemItem>
            ) }
        </View>
        
    );
}

const style = StyleSheet.create({
    container: {
        marginBottom: 40
    },
    viewContainer: {
        flexDirection:"row", 
        justifyContent: "space-around",  
        alignSelf: "stretch"
    }
});

export default connect(function mapStateToProps(state){ return {state} })(PatrimonioEntradaListaItens);