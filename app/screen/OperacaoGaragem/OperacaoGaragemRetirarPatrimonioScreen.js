import React, {useState}                    from 'react';
import { useNavigation, useRoute }          from '@react-navigation/native';
import { View, Text, StyleSheet, Button }   from 'react-native';
import OperacaoGaragemRetirarPatrimonio     from '../../component/OperacaoGaragem/OperacaoGaragemRetirarPatrimonio';
import HeaderBlank                          from '../../component/HeaderBlank';
import { ProgressSteps, ProgressStep }      from 'react-native-progress-steps';
import OperacaoGaragemOnibusHeader          from '../../component/OperacaoGaragem/OperacaoGaragemOnibusHeader';
import OperacaoGaragemMotivoRetiradaScreen  from './OperacaoGaragemMotivoRetiradaScreen';
import OperacaoGaragemAssociarPatrimonio    from '../../component/OperacaoGaragem/OperacaoGaragemAssociarPatrimonio';
import AppButton                            from '../../component/AppButton';
import store                                from './../../state/store';
import { filterParamPatrimonioRecebido }    from './../../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import LottieQuestion                       from '../../component/LottieQuestion';
import OperacaoGaragemService               from '../../service/OperacaoGaragemService';

function OperacaoGaragemRetirarPatrimonioScreen(props) {

    const {params}                                                  = useRoute()
    const navigation                                                = useNavigation();
    let obj_params                                                  = params.params;
    let onibus_em_alerta                                            = obj_params.onibus_em_alerta;
    let id_lib_equipamento_tipo                                     = obj_params.id_lib_equipamento_tipo;
    const [active, setActive]                                       = useState(0);
    const [equipamento_saida, setEquipamentoSaida]                  = useState(null);
    const [equipamento_entrada, setEquipamentoEntrada]              = useState(null);
    const [lib_equipamento_motivo_retirada, setLibMotivoRetirada]   = useState(null);
    const [observacao, setObservacao]                               = useState(null);

    function confirmar_motivo_retirada(){
        store.dispatch(filterParamPatrimonioRecebido({id_lib_equipamento_tipo: equipamento_saida.id_lib_equipamento_tipo}));
        setActive((p) => p + 1);
    }

    async function confirmar_retirada(){

        navigation.navigate('LoadingSuccessScreen', {
            screen: 'LoadingSuccessScreen',
            params: { 
                popCount: 2,
            },
        });

        await OperacaoGaragemService.desassociar_patrimonio({
            onibus_em_alerta:                   onibus_em_alerta,
            alerta:                             obj_params.alerta,
            onibus_em_alerta_atuacao:           obj_params.onibus_em_alerta_atuacao,
            equipamento_saida:                  equipamento_saida,
            lib_equipamento_motivo_retirada:    lib_equipamento_motivo_retirada,
            observacao:                         observacao
        });
    }

    return (
        <>
        <View style={style.container}>
            <HeaderBlank style={{paddingBottom: 10}}>Cancelar</HeaderBlank>
            <ProgressSteps removeBtnRow={true} activeStep={active}  completedStepIconColor="orange" activeStepIconBorderColor="orange" completedProgressBarColor="orange" labelColor="black" activeLabelColor="black">
                <ProgressStep removeBtnRow={true} nextBtnDisabled={true} nextBtnTextStyle={{display: 'none'}} label="Retirada">
                    <OperacaoGaragemRetirarPatrimonio id_lib_equipamento_tipo={id_lib_equipamento_tipo} setEquipamentoSaida={setEquipamentoSaida} setActive={setActive} style={{marginTop: 10}} />
                </ProgressStep>
                <ProgressStep removeBtnRow={true} nextBtnDisabled={true} nextBtnTextStyle={{display: 'none'}} previousBtnStyle={{display: 'none'}} label="Motivo Retirada" previousBtnTextStyle={{color: '#393939'}}>
                    <OperacaoGaragemMotivoRetiradaScreen style={{marginTop: 20}} equipamento={equipamento_saida} lib_equipamento_motivo_retirada={lib_equipamento_motivo_retirada} setLibMotivoRetirada={setLibMotivoRetirada} setObservacao={setObservacao} setActive={setActive} />
                </ProgressStep>
                <ProgressStep removeBtnRow={true} nextBtnDisabled={true} nextBtnTextStyle={{display: 'none'}} label="Confirmar"  previousBtnStyle={{display: 'none'}}>
                    {
                        active === 2 ? (
                            <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
                                <LottieQuestion titulo="Confirma a Retirada?"></LottieQuestion>
                                <OperacaoGaragemOnibusHeader onibus_em_alerta={onibus_em_alerta} />
                                <View style={{marginVertical: 10}}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold', borderColor: 'lightgray', borderBottomWidth: 1, marginBottom: 5}}>Desassociando:</Text>
                                    <View style={{flexDirection: 'row', marginVertical: 2}}>
                                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Patrimônio: </Text>
                                        <Text style={{fontSize: 18}}>{equipamento_saida.patrimonio}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', marginVertical: 2}}>
                                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Motivo: </Text>
                                        <Text style={{fontSize: 18}}>{lib_equipamento_motivo_retirada.motivo}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', marginVertical: 2}}>
                                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Observação: </Text>
                                        <Text style={{fontSize: 18}}>{observacao}</Text>
                                    </View>
                                </View>
                            </View>
                        ) : (<></>)
                    }
                </ProgressStep>
            </ProgressSteps>
        </View>
        <View style={style.container_button}>
            {
                active == 1 && lib_equipamento_motivo_retirada !== null ? (<AppButton onPress={() => { confirmar_motivo_retirada() }}>Continuar</AppButton>) : (<></>)
            }
            {
                active == 2 ? (<AppButton onPress={() => { confirmar_retirada() }}>Confirmar</AppButton>) : (<></>)
            }
        </View>
        </>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        paddingBottom: 30
    },
    container_searchbar: {
        paddingHorizontal: 30,
        marginBottom: 30
    },
    wrapperStep:{

    },
    container_button: {
        paddingHorizontal: 20,
        marginBottom: 20,
        backgroundColor: 'white'
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

export default OperacaoGaragemRetirarPatrimonioScreen;