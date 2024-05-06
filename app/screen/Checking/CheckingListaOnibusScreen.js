import React, {useState} from 'react'
import { useNavigation, useRoute }    from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native'
import HeaderBlank from '../../component/HeaderBlank';
import AVCheckingHeader from '../../component/Checking/AVCheckingHeader';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MediaService from './../../service/MediaService';
import CheckingService from './../../service/CheckingService';
import { Badge, List } from 'react-native-paper';
import store from '../../state/store';
import util from '../../util/util';
import AVCheckingListarOnibus from '../../component/Checking/AVCheckingListarOnibus';

function CheckingListaOnibusScreen(props) {

    const navigation                    = useNavigation();
    const {params}                      = useRoute();
    let obj_params                      = params.params;
    let av_checking                     = obj_params.av_checking;
    let av_checking_calendario          = obj_params.av_checking_calendario;
    let rota                            = obj_params.rota;
    let garagem                         = obj_params.garagem;

    function somarQtdFotos(rota){
        //console.log(total_tiradas, total_a_tirar);
        return <Text>{rota.qtd_foto_tirada} / {rota.qtd_fotos}</Text>;
    }

    return (
        <View style={style.container}>
            <HeaderBlank>
                Cancelar
            </HeaderBlank>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <AVCheckingHeader av_checking={av_checking} />
                    <View><Badge style={style.badge_fotos_total}><Text style={{fontSize:16, fontWeight:'bold'}}>Fotos Tiradas: {somarQtdFotos(rota)}</Text></Badge></View>
                </View>
                <View style={{paddingTop: 30}}>
                    <AVCheckingListarOnibus av_checking={av_checking} av_checking_calendario={av_checking_calendario} garagem={garagem} rota={rota} />
                </View>
            </ScrollView>
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
    container_onibus: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 40,
        paddingBottom: 300
    },
    box_onibus: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        width: 100,
        alignItems: 'center',
        marginHorizontal: 8,
        marginBottom: 20
    },
    box_icon: {
        marginVertical: 15
    },
    badge_fotos_total:{
        alignSelf: 'center',
        backgroundColor: '#dbdbdb',
        width:100,
        height:50,
        borderRadius:10
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

export default CheckingListaOnibusScreen;
