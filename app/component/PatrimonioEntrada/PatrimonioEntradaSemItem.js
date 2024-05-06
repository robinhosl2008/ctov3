import React from 'react';
import { StyleSheet, TouchableOpacity, View, TouchableHighlight, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Checkbox, List, Button } from 'react-native-paper';
import CardTitle from './../CardTitle';
import { connect } from 'react-redux';
import store from './../../state/store';
import LottieEmptyBox from '../LottieEmptyBox';

function PatrimonioEntradaSemItem(props) {

    return (
    <CardTitle style={style.container}>
        <Text style={style.nome_usuario}>Sem resultado</Text>
        <Text style={style.msg}>Nenhum patrimônio localizado.</Text>
        <LottieEmptyBox></LottieEmptyBox>
    </CardTitle>
    );
}

const style = StyleSheet.create({
    container: {
        marginTop: 20, 
        marginBottom: 80,
        alignItems: 'center'
    },
    nome_usuario: {
        fontSize: 20,
        marginBottom: 10
    },
    msg:{

    }
});

export default connect(function mapStateToProps(state){ return {state} })(PatrimonioEntradaSemItem);