import React from 'react'
import { View, Text, StyleSheet }   from 'react-native'
import { Button, List, Badge } from 'react-native-paper';
import HeaderBlank                  from '../../component/HeaderBlank';
import LottiePatrimonioAssociar     from '../../component/LottiePatrimonioAssociar';
import LottieQuestion               from '../../component/LottieQuestion';
import { useRoute, useNavigation }  from '@react-navigation/native';
import OperacaoGaragemService       from '../../service/OperacaoGaragemService';
import AppBadge                     from '../../component/AppBadge';
import AppIcon                      from '../../component/AppIcon';
import OperacaoGaragemRightBusInfo from '../../component/v2OperacaoGaragem/OperacaoGaragemRightBusInfo';

function ConfirmarCarroNaoEncontradoScreen() {

    const {params}                  = useRoute();
    const navigation                = useNavigation();
    let onibus_em_alerta            = params.params.onibus_em_alerta;
    let arr_checklist_patrimonio    = params.params.arr_checklist_patrimonio;
    let sem_patrimonio              = params.params.sem_patrimonio;

    async function confimar_carro_nao_encontrado(){

        await OperacaoGaragemService.confirmar_carro_nao_encontrado({
            onibus_em_alerta:           onibus_em_alerta,
        }).catch((error) => {
            console.error("::: ERRO AO SALVAR CONFIRMAR CARRO NÃO ENCONTRADO :::");
            console.error(error);
        });

        navigation.navigate('LoadingSuccessScreen', {
            screen: 'LoadingSuccessScreen',
            params: { 
                popCount: 4,
            },
        });

    }

    return (
        <View style={style.container}>
            <HeaderBlank
                right={<OperacaoGaragemRightBusInfo onibus_em_alerta={onibus_em_alerta} numero_onibus={onibus_em_alerta.numero_onibus} />}
            >Cancelar</HeaderBlank>
            <LottieQuestion titulo="Confirma que o carro não foi encontrado, no momento da atuação?" /> 
            <View style={style.content}></View>
            <View style={[style.containerButton]}>
                <Button mode="outlined" style={style.btnStyle} contentStyle={style.btnContentStyle} labelStyle={style.btnLabelStyle} onPress={() => { confimar_carro_nao_encontrado(); }}>Confirmar</Button>
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
    item_furtado: {
        borderRadius: 5,
        paddingHorizontal: 5,
        backgroundColor: 'red',
        textTransform: 'uppercase'
    },
    item_localizado: {
        borderRadius: 5,
        paddingHorizontal: 5,
        backgroundColor: 'green',
        textTransform: 'uppercase'
    }
});

export default ConfirmarCarroNaoEncontradoScreen;
