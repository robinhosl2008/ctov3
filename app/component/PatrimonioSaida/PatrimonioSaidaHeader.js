import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LottieFolderOpen from '../LottieFolderOpen';
import { connect } from 'react-redux';

function PatrimonioSaidaHeader(props) {

    let user_auth           = props.state.app.user_auth;
    let envio_patrimonio    = props.state.patrimonio_recebido.envio_patrimonio;

    function handle_destino(){
        let response = "...";
        if (envio_patrimonio.status_destino){
            response = envio_patrimonio.status_destino;
        }
        if (envio_patrimonio.destinatario){
            response += " ("+envio_patrimonio.destinatario+") ";
        }

        return response;
    }

    return (
        <View style={{backgroundColor: 'white', marginBottom: 10, padding: 10, borderRadius: 10}}>
            <View style={{alignItems: 'center'}}>
                <Image style={style.imageHeader} fadeDuration={300} resizeMode="stretch" source={require('./../../assets/image/transferencia-patrimonio.jpg')}/>
                <Text style={{fontSize: 20, padding: 10, marginTop: 10}}>{user_auth.label_saida_patrimonio}</Text>
            </View>
            <View style={style.box}>
                <Text style={{color: 'gray'}}>ORIGEM</Text>
                <Text style={{color: 'black', fontSize: 16}}>{(envio_patrimonio.status_inicio) ? envio_patrimonio.status_inicio : "..."}</Text>
            </View>
            <View style={style.box}>
                <Text style={{color: 'gray'}}>DESTINO</Text>
                <Text style={{color: 'black', fontSize: 16}}>{handle_destino()}</Text>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    box: {
        padding: 10
    },
    imageHeader: {
        width: 220,
        height: 110
    }
});

export default connect(function mapStateToProps(state){ return {state} })(PatrimonioSaidaHeader);
