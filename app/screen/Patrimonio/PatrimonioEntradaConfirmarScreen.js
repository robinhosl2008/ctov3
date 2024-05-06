import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, List } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import store from './../../state/store';
import { addDelPatrimonioReceber } from '../../state/EquipamentoFuncionarioControle/PatrimonioEncaminhadoAction';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import EquipamentoFuncionarioControleService from './../../service/EquipamentoFuncionarioControleService';
import { Col, Row, Grid } from "react-native-easy-grid";

function PatrimonioEntradaConfirmarScreen(props) {

    const arr_patrimonios_recebidos = props.state.patrimonio_encaminhado.data;
    const arr_id_patrimonio_receber = props.state.patrimonio_encaminhado.arr_id_patrimonio_receber;
    const total_relacionados        = arr_id_patrimonio_receber.length;

    function arr_patrimonios_selecionados(){
        return arr_patrimonios_recebidos.filter(item => {
            return arr_id_patrimonio_receber.indexOf(item.id_equipamento) > -1
        })
    }

    return (
        <>
        <Grid>
            <Row size={1} style={style.header}>
                <Text style={[style.headerTitle, {fontWeight: 'bold'}, (total_relacionados > 0) ? style.hasItems : style.emptyItems]}>{total_relacionados}</Text>
                <Text style={[style.headerTitle, (total_relacionados > 0) ? style.hasItems : style.emptyItems]}>Patrimônio(s) relacionado(s)</Text>
            </Row>
            <Row size={6} style={{paddingBottom: 30}}>
                <ScrollView>
                    {
                        arr_patrimonios_selecionados().map(item => (
                            <List.Item 
                                key={item.id_equipamento} 
                                title={item.patrimonio} 
                                titleStyle={style.listItemTitle} 
                                description={item.descricao} 
                                right={props => <TouchableOpacity onPress={() => store.dispatch(addDelPatrimonioReceber(item.id_equipamento))}><Entypo name="trash" color="tomato" style={style.listItemLeftIcon} size={30} /></TouchableOpacity>}/>
                        ))
                    }
                </ScrollView>
            </Row>
            <Row size={1}>
                <View style={[style.containerButton]}>
                    <Button mode="outlined" style={style.btnStyle} contentStyle={style.btnContentStyle} labelStyle={style.btnLabelStyle} onPress={() => { EquipamentoFuncionarioControleService.confirmar_recebimento_patrimonio() }}>Confirmar Recebimento</Button>
                </View>
            </Row>
        </Grid>
        </>
    );
}

const style = StyleSheet.create({
    header:{
        flexDirection: 'row',
        justifyContent: 'center'
    },
    headerTitle: {
        fontSize: 20,
        marginBottom: 20,
        marginEnd: 10
    },
    listItemTitle:{
        fontSize: 22
    },
    listItemLeftIcon: {
        paddingTop: 12,
        paddingEnd: 10
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
        width: '100%'
    },
    btnContentStyle: {
        height: 50
    },
    btnLabelStyle: {
        color: 'white',
    },
    hasItems: {
        color: 'darkorange',
        opacity: 1
    },
    emptyItems: {
        color: 'gray',
        opacity: 0.6
    }
});

export default connect(function mapStateToProps(state){ return {state} })(PatrimonioEntradaConfirmarScreen);