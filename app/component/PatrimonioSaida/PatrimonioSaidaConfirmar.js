import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, List } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import store from './../../state/store';
import { addDelPatrimonioRecebidoEnviar } from '../../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import EquipamentoFuncionarioControleService from './../../service/EquipamentoFuncionarioControleService';
import { Col, Row, Grid } from "react-native-easy-grid";
import { useRoute, useNavigation }         from '@react-navigation/native';
import { limparColetador } from './../../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import { useSelector } from 'react-redux';

function PatrimonioSaidaConfirmar(props) {

    const navigation                = useNavigation();
    const {params}                  = useRoute()

    const arr_patrimonios           = props.state.patrimonio_recebido.data;
    const arr_id_patrimonio_enviar  = props.state.patrimonio_recebido.envio_patrimonio.arr_id_patrimonio_enviar;
    const total_relacionados        = arr_id_patrimonio_enviar.length;

    function arr_patrimonios_selecionados(){
        return arr_patrimonios.filter(item => {
            return arr_id_patrimonio_enviar.indexOf(item.id_equipamento) > -1
        })
    }

    //Função que exibe alerta perguntando se vai ter coleta
    function verificarColeta(){

        Alert.alert("Coleta", "Selecione o tipo de transferência:", [
            {
                text: "Cancelar",
                onPress: () => null,
                style: "cancel"
            },
            {
              text: "Com Coleta",
              onPress: () => nav_confirmacao(1),
            },
            {
              text: "Em mãos",
              onPress: () => nav_confirmacao(0),
            },
          ]);

        //LINK PARA SALVAR
        //EquipamentoFuncionarioControleService.confirmar_envio_patrimonio()
    }

    //Função que faz a navegação para a tela de confirmação
    function nav_confirmacao(parametro){
        
        //Limpa qq coletador que possa ter sido definido anteriormente (caso o usuario volte)
        store.dispatch(limparColetador());

        if(parametro == 1){
            navigation.navigate('PatrimonioSaidaListaColetadorScreen',{
                screen: 'PatrimonioSaidaListaColetadorScreen',
                params: {'coletador': parametro},
            })
        }
        else{
            navigation.navigate('PatrimonioConfirmarSaidaScreen',{
                screen: 'PatrimonioConfirmarSaidaScreen',
                params: {'coletador': parametro},
            })
        }
    }
 
    return (
        <>
        <Grid>
            <Row size={1} style={[style.header]}>
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
                                right={props => <TouchableOpacity onPress={() => store.dispatch(addDelPatrimonioRecebidoEnviar(item.id_equipamento))}><Entypo name="trash" color="tomato" style={style.listItemLeftIcon} size={30} /></TouchableOpacity>}/>
                        ))
                    }
                </ScrollView>
            </Row>
            <Row size={1}>
                <View style={[style.containerButton]}>
                    {(arr_patrimonios_selecionados().length>0)?(<Button mode="outlined" style={style.btnStyle} contentStyle={style.btnContentStyle} labelStyle={style.btnLabelStyle} onPress={() => verificarColeta()}>Confirmar</Button>):(<Button disabled={true} mode="outlined" style={{backgroundColor:'gray', width: '100%'}} contentStyle={style.btnContentStyle} labelStyle={style.btnLabelStyle} onPress={() => verificarColeta()}>Confirmar</Button>)}
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

export default connect(function mapStateToProps(state){ return {state} })(PatrimonioSaidaConfirmar);
