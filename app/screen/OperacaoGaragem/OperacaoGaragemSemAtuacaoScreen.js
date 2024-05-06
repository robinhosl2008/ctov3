import React                                from 'react';
import { View, StyleSheet }                 from 'react-native';
import store                                from '../../state/store';
import { useRoute }                         from '@react-navigation/native';
import { useNavigation }                    from '@react-navigation/native';
import HeaderBlank                          from '../../component/HeaderBlank';
import OperacaoGaragemSemAtuacao            from './../../component/OperacaoGaragem/OperacaoGaragemSemAtuacao';
import OperacaoGaragemRightBusInfo          from '../../component/v2OperacaoGaragem/OperacaoGaragemRightBusInfo';

function OperacaoGaragemSemAtuacaoScreen(props) {

    const state             = store.getState();
    const {params}          = useRoute()
    const navigation        = useNavigation();
    let onibus_em_alerta    = params.params.onibus_em_alerta;
    let alerta              = params.params.alerta;

    return (
        <View style={style.container}>
            <View style={{paddingHorizontal: 20}}>
                <HeaderBlank right={<OperacaoGaragemRightBusInfo onibus_em_alerta={onibus_em_alerta} numero_onibus={onibus_em_alerta.numero_onibus} />}>
                    Cancelar
                </HeaderBlank>
            </View>
            <OperacaoGaragemSemAtuacao onibus_em_alerta={onibus_em_alerta} alerta={alerta} />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});

export default OperacaoGaragemSemAtuacaoScreen;