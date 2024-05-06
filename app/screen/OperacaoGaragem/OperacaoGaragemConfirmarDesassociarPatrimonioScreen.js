import React                        from 'react'
import { View, Text, StyleSheet }   from 'react-native'
import { Button }                   from 'react-native-paper';
import HeaderBlank                  from '../../component/HeaderBlank';
import LottiePatrimonioDesassociar  from '../../component/LottiePatrimonioDesassociar';
import LottieQuestion               from '../../component/LottieQuestion';
import { useRoute, useNavigation }  from '@react-navigation/native';
import OperacaoGaragemService       from '../../service/OperacaoGaragemService';
import Alert                        from '../../component/Alert';

function OperacaoGaragemConfirmarDesassociarPatrimonioScreen() {

    const {params}                  = useRoute();
    const navigation                = useNavigation();
    let obj_params                  = params.params;
    let onibus_em_alerta            = obj_params.onibus_em_alerta;
    let alerta                      = obj_params.alerta;
    let equipamento                 = obj_params.equipamento;
    let has_substituir              = (obj_params.has_substituir !== undefined && obj_params.has_substituir) ? true : false;

    async function desassociar_patrimonio(){

        // Verifica se a atuação é de Troca de Equipamento
        // Caso seja, o usuário precisará associar um novo patrimônio
        // Senão, o patrimônio será desassociado e não teremos mais etapas
        if (has_substituir){
            navigation.navigate('OperacaoGaragemAssociarPatrimonioScreen', {
                screen: 'OperacaoGaragemAssociarPatrimonioScreen',
                params: obj_params,
            });
        } else {

            // Apenas registra a desassociação do patrimônio
            await OperacaoGaragemService.desassociar_patrimonio(obj_params);

            navigation.navigate('LoadingSuccessScreen', {
                screen: 'LoadingSuccessScreen',
                params: { 
                    popCount: 3,
                },
            });

        }

    }

    return (
        <View style={style.container}>
            <HeaderBlank>Cancelar</HeaderBlank>
            <LottieQuestion titulo="Confirma a retirada do patrimônio?" />
            <View style={style.content}>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={{fontSize: 14, color: 'gray', textTransform: 'uppercase'}}>{equipamento.tipo}</Text>
                    <Text style={{fontSize: 22, fontWeight:'bold'}}>{equipamento.patrimonio}</Text>
                </View>
                <View style={{flex: 1}}>
                    <LottiePatrimonioDesassociar />
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text style={{fontSize: 16, color: 'gray'}}>CARRO</Text>
                    <Text style={{fontSize: 22, fontWeight:'bold'}}>{onibus_em_alerta.numero_onibus}</Text>
                </View>
            </View>
            <Alert>
                Você está realizando uma substituição de equipamento. Portanto, esse patrimônio só será retirado quando um novo for associado ao carro.
            </Alert>
            <View style={[style.containerButton]}>
                <Button mode="outlined" style={style.btnStyle} contentStyle={style.btnContentStyle} labelStyle={style.btnLabelStyle} onPress={() => { desassociar_patrimonio(); }}>Confirmar</Button>
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

export default OperacaoGaragemConfirmarDesassociarPatrimonioScreen;
