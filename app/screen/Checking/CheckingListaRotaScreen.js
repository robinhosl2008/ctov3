import React from 'react'
import { useNavigation, useRoute }    from '@react-navigation/native';
import { View, Text, StyleSheet, Alert } from 'react-native'
import HeaderBlank from '../../component/HeaderBlank';
import AVCheckingHeader from '../../component/Checking/AVCheckingHeader';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Badge, List } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import util from './../../util/util';

function CheckingListaRotaScreen(props) {

    const navigation            = useNavigation();
    const {params}              = useRoute();
    console.log(':: PARAMS ::');
    console.log(':: PARAMS ::');
    console.log(':: PARAMS ::');
    console.log(params.route_params)
    let av_checking             = params.route_params[0]; 
    //let av_checking_calendario  = params.route_params.av_checking_calendario;


    function selecionar_checking_rota(rota, calendario){

        console.info("::: ROTA A SER ENVIADA");
        console.info(rota);

        navigation.navigate('CheckingListaGaragemScreen', {
            screen: 'CheckingListaGaragemScreen',
            params: { av_checking: av_checking, av_checking_calendario: calendario, rota: rota }, 
        });
    }

    function somarQtdFotos(){
        var total_a_tirar = 0;
        var total_tiradas = 0;
        util.obj_to_array(av_checking.checking_calendario).map(function(calendario){
            calendario.rota.map(function(rota){
                total_a_tirar = total_a_tirar + rota.qtd_fotos;
                total_tiradas = total_tiradas + rota.qtd_foto_tirada;
            })
        });
        //console.log(total_tiradas, total_a_tirar);
        return <Text>{total_tiradas} / {total_a_tirar}</Text>;
    }

    function compararDataMenor(strdata){
        var data = new Date;
        var dataAtual = new Date();
        var partesData = strdata.split("-");
        var dataparam = new Date(partesData[0], partesData[1] - 1, partesData[2], 23, 59, 59, 999);
        //console.log(dataAtual); console.log(dataparam);
        if(dataparam>dataAtual){
            //console.log("ok");
            return false;
        }
        else{
            //console.log("atrasado");
            return true;
        }
    }

    function mostrarAlerta() {  
        Alert.alert(  
            'Prazo Expirado',  
            'A data limite deste checking expirou, você não pode mais tirar fotos, entre em contato com o Operacional!',  
            [   
                {text: 'OK', onPress: () => null},  
            ]  
        );  
    }  

    return (
        <View style={style.container}>
            <HeaderBlank>
                Cancelar
            </HeaderBlank>
            <View>
                <AVCheckingHeader av_checking={av_checking} />
                <View><Badge style={style.badge_fotos_total}><Text style={{fontSize:16, fontWeight:'bold'}}>Fotos Tiradas: {somarQtdFotos()}</Text></Badge></View>
            </View>
            <View style={style.container_calendario}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <List.Section title="Selecione o calendário a ser atuado:">
                        {
                            util.obj_to_array(av_checking.checking_calendario).map((calendario) => (
                            <List.Accordion

                                key={calendario.id}
                                title={<>
                                    <Text>{`${util.dataUS2BR(calendario.data_inicio)} até ${util.dataUS2BR(calendario.data_termino)}`}</Text>
                                    </>}
                                description = {(compararDataMenor(calendario.data_termino))?(<View style={{flexDirection: 'row'}}>
                                    <Badge style={style.badge_atraso}>
                                        <Text style={{fontSize:12}}>Em Atraso</Text>
                                    </Badge>
                                </View>):(<></>)}
                                titleStyle={{fontWeight: 'bold'}}
                                left={props => <List.Icon {...props} icon="calendar" />}>
                                {
                                    calendario.rota.map((rota) => (
                                        <TouchableOpacity key={rota.id} onPress={() => {
                                            (compararDataMenor(calendario.data_termino))?(mostrarAlerta()):(selecionar_checking_rota(rota, calendario))
                                        }}>
                                            <View style={{width: '100%', alignSelf: 'flex-start'}}>
                                                <List.Item 
                                                    title={rota.rota} 
                                                    right={props => <Badge size={25} style={style.badge_qtd_fotos}>{rota.qtd_fotos - rota.qtd_foto_tirada}</Badge>}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                }
                            </List.Accordion>
                            ))
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
        color: '#000000',
        width: '80%',
        height:40,
        borderRadius:10,
        fontSize:16,
        fontWeight:'bold',
    },
    badge_atraso:{
        backgroundColor: '#a00800',
        justifyContent: 'center',
    }
});

export default CheckingListaRotaScreen;
