import React from 'react'
import { View, Text, StyleSheet }   from 'react-native'
import { Button } from 'react-native-paper';
import HeaderBlank                  from '../../component/HeaderBlank';
import LottiePatrimonioAssociar     from '../../component/LottiePatrimonioAssociar';
import LottieQuestion               from '../../component/LottieQuestion';
import { useRoute, useNavigation }                 from '@react-navigation/native';
import OperacaoGaragemService       from './../../service/OperacaoGaragemService';

function ConfirmarAssociarPatrimonioScreen() {

    const {params}                  = useRoute();
    const navigation                = useNavigation();
    let onibus_em_alerta            = params.params.onibus_em_alerta;
    let alerta                      = params.params.alerta;
    let equipamento                 = params.params.patrimonio;
    let onibus_em_alerta_atuacao    = params.params.onibus_em_alerta_atuacao;
    let reutilizar                  = params.params.reutilizar;

    async function associar_patrimonio(){

        await OperacaoGaragemService.associar_patrimonio({
            onibus_em_alerta:           onibus_em_alerta,
            alerta:                     alerta,
            onibus_em_alerta_atuacao:   onibus_em_alerta_atuacao,
            equipamento:                equipamento,
            reutilizar:                 reutilizar
        }).catch((error) => {

            console.error("::: ERRO AO ASSOCIAR O PATRIMÔNIO :::");
            console.error("::: ERRO AO ASSOCIAR O PATRIMÔNIO :::");
            console.error("::: ERRO AO ASSOCIAR O PATRIMÔNIO :::");
            console.error(error);

        });

        navigation.navigate('LoadingSuccessScreen', {
            screen: 'LoadingSuccessScreen',
            params: { 
                popCount: 3,
            },
        });

    }

    return (
        <View style={style.container}>
            <HeaderBlank>Cancelar</HeaderBlank>
            <LottieQuestion titulo="Confirma a associação do patrimônio?" />
            <View style={style.content}>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={{fontSize: 14, color: 'gray', textTransform: 'uppercase'}}>{equipamento.tipo}</Text>
                    <Text style={{fontSize: 22, fontWeight:'bold'}}>{equipamento.patrimonio}</Text>
                </View>
                <View style={{flex: 1}}>
                    <LottiePatrimonioAssociar></LottiePatrimonioAssociar>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={{fontSize: 16, color: 'gray'}}>CARRO</Text>
                    <Text style={{fontSize: 22, fontWeight:'bold'}}>{onibus_em_alerta.numero_onibus}</Text>
                </View>
            </View>
            <View style={[style.containerButton]}>
                <Button mode="outlined" style={style.btnStyle} contentStyle={style.btnContentStyle} labelStyle={style.btnLabelStyle} onPress={() => { associar_patrimonio(); }}>Confirmar</Button>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20
    },
    content: {
        flex: 0.8,
        flexDirection: 'row',
        marginVertical: 50,
        paddingHorizontal: 5
    },
    containerButton:{
        flex: 0.4,
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
});

export default ConfirmarAssociarPatrimonioScreen;
