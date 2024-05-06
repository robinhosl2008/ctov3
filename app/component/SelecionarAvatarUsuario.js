import React from 'react';
import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Badge, Chip } from 'react-native-paper';
import {connect} from 'react-redux';
import store from './../state/store';
import { filterParam, delFilterParam } from '../state/EquipamentoFuncionarioControle/PatrimonioEncaminhadoAction';
import * as _ from 'underscore';

function SelecionarAvatarUsuario(props) {

    const [remetente_selecionado, set_remetente_selecionado]   = useState(props.state.users);

    function switch_remetente(user){

        // Se o ID do Remetente selecionado for o mesmo, precisamos então remover o filtro pelo Remetente
        // Pois significa que o usuário clicou novamente no Remetente, afim de não filtrar por ele
        if (remetente_selecionado === user.id){
            
            set_remetente_selecionado(null);
            store.dispatch(delFilterParam("id_remetente"));

        } else {

            // Filtra pelo usuário selecionado
            set_remetente_selecionado(user.id);
            store.dispatch(filterParam({id_remetente: user.id}));

        }
    }

    return (
        <View style={{backgroundColor: 'white', padding:10, borderRadius: 10}}>
            <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize: 15}}>Selecione o Remetente: </Text>
            <Text style={{paddingBottom: 15}}>Marque o Colaborador que lhe enviou o Patrimônio. Puxe para os lados para visualizar mais opções</Text>
            <View style={style.container}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {
                    props.state.patrimonio_encaminhado.arr_remetente_qtd.map(user => (
                        <Chip key={user.id} style={style.chip} mode='outlined' selected={(remetente_selecionado == user.id) ? true : false} onPress={() => switch_remetente(user)}>
                            <View style={style.chipView}>
                                <Text style={style.chipText}>{user.nick}</Text>
                                <Badge style={(!user.total_enviado) ? style.badgeEmpty : null}>{user.total_enviado}</Badge>
                            </View>
                        </Chip>
                    ))
                    }
                </ScrollView>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    container:{
        flexDirection: 'row'
    },
    chip: {
        alignItems: 'center',
        marginEnd: 5,
        height: 50
    },
    chipView: {
        flexDirection: 'row'
    },
    chipText:{
        marginEnd: 5
    },
    badgeEmpty:{
        backgroundColor: 'black'
    }
});

function mapStateToProps(state) {
    return {state};
}

export default connect(mapStateToProps)(SelecionarAvatarUsuario);