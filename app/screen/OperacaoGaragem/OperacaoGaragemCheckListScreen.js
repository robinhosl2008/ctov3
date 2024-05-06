import React                                            from 'react'
import { View, StyleSheet, Text, ActivityIndicator }    from 'react-native'
import { ScrollView, TouchableOpacity }                 from 'react-native-gesture-handler';
import { RadioButton, TextInput, Button, List }         from 'react-native-paper';
import HeaderBlank                                      from '../../component/HeaderBlank';
import Ionicons                                         from 'react-native-vector-icons/Ionicons';
import { useRoute }                                     from '@react-navigation/native';
import { useNavigation }                                from '@react-navigation/native';
import util                                             from './../../util/util'; 
import AppButton                                        from '../../component/AppButton';
import OperacaoGaragemRightBusInfo                      from '../../component/v2OperacaoGaragem/OperacaoGaragemRightBusInfo';
import OperacaoGaragemService                           from './../../service/OperacaoGaragemService';

function OperacaoGaragemCheckListScreen(props) {

    const {params}                                          = useRoute()
    const navigation                                        = useNavigation();
    let onibus_em_alerta                                    = params.params.onibus_em_alerta;
    let alerta                                              = params.params.alerta;
    let tipo                                                = params.params.tipo;
    let arr_equipamento                                     = (onibus_em_alerta['arr_equipamento'] !== undefined) ? util.obj_to_array(onibus_em_alerta.arr_equipamento) : [];

    const [validForm, setValidForm]                         = React.useState(false);
    const [sem_patrimonio, setSemPatrimonio]                = React.useState(false);
    const [arr_checklist_patrimonio, setArrCheckList]       = React.useState(() => {

        let _arr_temp = [...arr_equipamento];

        _arr_temp = arr_equipamento.map((item) => {
            item['checked'] = false;
            return item;
        });

        console.info(_arr_temp);

        return _arr_temp;
    });

    function confirmar_checklist(){

        if (sem_patrimonio){
            desmarcar_todos();
        }

        navigation.navigate('ConfirmarChecklistScreen', {
            screen: 'ConfirmarChecklistScreen',
            params: { 
                onibus_em_alerta:           onibus_em_alerta,
                alerta:                     alerta, 
                arr_checklist_patrimonio:   arr_checklist_patrimonio,
                sem_patrimonio:             sem_patrimonio,
                tipo:                       tipo
            }
        });
    }

    function desmarcar_todos(){
        let _arr_temp = [...arr_checklist_patrimonio];

        _arr_temp.map((_item, i) => {
            _arr_temp[i]['checked'] = false;
        });

        setArrCheckList(_arr_temp);
    }

    function add_del_item(item){

        let _arr_temp = [...arr_checklist_patrimonio];

        _arr_temp.map((_item, i) => {
            if (item.id_equipamento == _item.id_equipamento){
                _arr_temp[i]['checked'] = !_arr_temp[i]['checked'];
            }
        });

        setArrCheckList(_arr_temp);
        checkValidForm();
    }

    function onOffSemPatrimonio(){
        desmarcar_todos();
        setSemPatrimonio(() => { 
            if (sem_patrimonio === false){
                setValidForm(true);
                return true;
            } else {
                setValidForm(false);
                return false;
            }
        });
        checkValidForm();
    }

    function checkValidForm(){

        let status = false;

        arr_checklist_patrimonio.map((item) => {
            if (item.checked === true){
                status = true;
            }
        });

        if (status == false && sem_patrimonio == true) {
            status = true;
        }

        setValidForm(status);
    }

    return (
        <>
        <View style={{backgroundColor: 'white', paddingHorizontal: 20}}>
            <HeaderBlank right={<OperacaoGaragemRightBusInfo onibus_em_alerta={onibus_em_alerta} numero_onibus={onibus_em_alerta.numero_onibus} />}>
                Cancelar
            </HeaderBlank>
        </View>
        <View style={style.container}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Marque todos os patrimônios que foram localizados no carro:</Text>

            <TouchableOpacity onPress={() => { onOffSemPatrimonio() }}>
                <View style={{backgroundColor: '#ffd7d1', padding: 10, borderRadius: 5, marginVertical: 25}}>
                    <List.Item 
                        title="Não encontrei nenhum patrimônio" 
                        titleStyle={{fontWeight: 'bold', fontSize: 18, marginBottom: 10}}
                        description="Esta opção serve para indicar que todos os patrimônios do carro foram Furtados ou Perdidos" 
                        descriptionStyle={{lineHeight: 20, fontSize: 14, color: 'black'}}
                        left={ props => 
                            <View style={{flexDirection: 'row'}}>
                                <Ionicons name={(sem_patrimonio) ? 'checkbox-sharp' : 'square-outline'} color="black" style={{marginTop: 10}} size={20} />
                            </View>
                    }/>
                </View>
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false} style={{display: (sem_patrimonio) ? 'none' : 'flex'}}>
                {
                    arr_equipamento.map((item, i) => {
                        return (
                            <TouchableOpacity key={item.id_equipamento} onPress={() => { add_del_item(item) }}>
                                <List.Item 
                                title={item.patrimonio} 
                                description={item.descricao} 
                                left={ props => 
                                    <View style={{flexDirection: 'row'}}>
                                        <Ionicons name={(arr_checklist_patrimonio[i]['checked']) ? 'checkbox-sharp' : 'square-outline'} color="black" style={{alignSelf: 'center'}} size={20} />
                                    </View>
                                }/>
                            </TouchableOpacity> 
                        )
                    })
                }
            </ScrollView>
            <View style={{marginVertical: 20}}>
                <AppButton onPress={() => confirmar_checklist() } disabled={!validForm}>CONFIRMAR CHECKLIST</AppButton>
            </View>
        </View>
        </>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20
    }
});

export default OperacaoGaragemCheckListScreen;