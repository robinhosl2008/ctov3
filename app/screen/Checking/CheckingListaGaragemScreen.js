import React from 'react';
import { useNavigation, useRoute }    from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native'
import HeaderBlank from '../../component/HeaderBlank';
import AVCheckingHeader from '../../component/Checking/AVCheckingHeader';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Badge, List } from 'react-native-paper';
import store from '../../state/store';
import util from '../../util/util';

function CheckingListaGaragemScreen(props) {

    const navigation            = useNavigation();
    const state                 = store.getState();
    const {params}              = useRoute();
    let obj_params              = params.route_params;
    let av_checking             = obj_params.av_checking;
    let av_checking_calendario  = obj_params.av_checking_calendario;
    let rota                    = obj_params.rota;
    let rota_garagem            = [];

    rota_garagem                = state.rota_garagem.data
    .filter((item_rota) => {
        if (item_rota.id == rota.id_rota){
            return item_rota;
        }
    });

    function selecionar_checking_garagem(garagem){
        navigation.navigate('CheckingListaOnibusScreen', {
            screen: 'CheckingListaOnibusScreen',
            params: { av_checking: av_checking, av_checking_calendario: av_checking_calendario, rota: rota, garagem: garagem }, 
        });
    }

    function somarQtdFotos(rota){
        //console.log(total_tiradas, total_a_tirar);
        return <Text>{rota.qtd_foto_tirada} / {rota.qtd_fotos}</Text>;
    }

    return (
        <View style={style.container}>
            <HeaderBlank>
                Cancelar
            </HeaderBlank>
            <View>
                <AVCheckingHeader av_checking={av_checking} />
                <View><Badge style={style.badge_fotos_total}><Text style={{fontSize:16, fontWeight:'bold'}}>Fotos Tiradas: {somarQtdFotos(rota)}</Text></Badge></View>
            </View>
            <View style={style.container_calendario}>
                <ScrollView showsVerticalScrollIndicator={false}>
                <List.Section>
                    <List.Subheader>{rota.rota}</List.Subheader>
                    {
                        (rota_garagem.length) ? (
                            rota_garagem.map((item) => (
                                item.garagem.map((garagem) => (
                                <TouchableOpacity key={garagem.id_garagem} onPress={() => {selecionar_checking_garagem(garagem)}}>
                                    <List.Item
                                        title={garagem.garagem}
                                        left={props => <List.Icon {...props} icon="bus" />}
                                    />
                                </TouchableOpacity>
                                ))
                        ))) : (<></>)
                    }
                </List.Section>
                </ScrollView>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        paddingBottom: 30
    },
    container_calendario: {
        flex: 1,
        marginTop: 30,
        width: '100%'

    },
    badge_qtd_fotos: {
        alignSelf: 'center'
    },
    badge_fotos_total:{
        alignSelf: 'center',
        backgroundColor: '#dbdbdb',
        width: '80%',
        height:40,
        borderRadius:10,
        fontSize:16,
        fontWeight:'bold',
    },
});

export default CheckingListaGaragemScreen;