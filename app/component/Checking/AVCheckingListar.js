import React, {useState} from 'react';
import { useNavigation }    from '@react-navigation/native';
import {RefreshControl, SafeAreaView, View, ScrollView, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import { List, Badge, Searchbar, Switch } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import util from './../../util/util';
import AppBadge from '../AppBadge';
import store from './../../state/store';
import { filterParamChecking } from './../../state/Checking/CheckingAction';
import { delFilterParamChecking } from './../../state/Checking/CheckingAction';
import CheckingService from '../../service/CheckingService';
import Loader from '../Loader';

function AVCheckingListar(props) { 
    
    const navigation    = useNavigation();
    const [arr_checking, setArrChecking]                                = useState([]);

    const [verificafiltro, setVerificaFiltro]                           = useState(false);
    const [arr_checking_bk, setArrCheckingBackup]                       = useState([]);

    const [is_loaded, setLoaded]                                        = useState(false);
    const [is_loading, setLoading]                                      = useState(false);
    const [searchtext, setSearchText]                                   = useState(null);

    const [refreshing, setRefreshing]                                   = useState(false);


    let avcheckingcalendario = [];
    let vetor = (props.route_params.vetor) ? true : false;
    //Esta função foi substituida pela função selecionar_calendario2, que passa parametros diferentes
    //function selecionar_calendario(av_checking, calendario){
    //    navigation.navigate('CheckingListaRotaScreen', {
    //        screen: 'CheckingListaRotaScreen',
    //        params: { av_checking: av_checking, av_checking_calendario: calendario },
    //    });
    //}

    function definir_dados(){
        setLoading(true);
        let checking = props.route_params.arr_alerta;
        setArrChecking(checking);
        setLoaded(true);
        setLoading(false);
    }

    async function refresh_screen(){
        let checking = await CheckingService.listar_checking_fotografico();
        setArrChecking(checking);
        setSearchText('');
        setVerificaFiltro(false);
        setArrCheckingBackup([]);
        setRefreshing(false);       
    }

    if(!is_loaded && !is_loading){
        definir_dados();
        
    }

    function selecionar_calendario2(av_checking){
        navigation.navigate('CheckingListaRotaScreen', {
            screen: 'CheckingListaRotaScreen',
            params: { av_checking: av_checking },
        });
    }

    function checarFiltro(){
        if(("texto_pesquisa" in props.verificafiltro) === false && ("prioridade" in props.verificafiltro) === false){
            avcheckingcalendario = props.av_checking_calendario_or;
            console.log("checking calendario or definido");
            console.log(avcheckingcalendario);
            //store.dispatch(filterParamChecking({texto_pesquisa: ''}));
        }else{
            avcheckingcalendario = props.av_checking_calendario;
            console.log("checking calendario definido");
            console.log(avcheckingcalendario);
        }
    }

    function filtrar_AVs(){
        // Filtra os onibus pelo número
        //store.dispatch(filterParamChecking({texto_pesquisa: str})); 
        console.log("Entrou no filtro");
        console.log("str filtrada: " + searchtext);
        if(searchtext == ''){
            //Se a string está vazia, limpar filtros
            setArrChecking(arr_checking_bk);
            setArrCheckingBackup([]);
            setVerificaFiltro(false);
        }
        else{
            //Se tem filtro e um novo filtro sera aplicado, resetar a lista para aplicar corretamente o filtro
            if(verificafiltro){
                setArrChecking(CheckingService.filtrar_checking(searchtext, arr_checking_bk));
                setVerificaFiltro(true);
            }
            else{
                setArrCheckingBackup(arr_checking);
                setArrChecking(CheckingService.filtrar_checking(searchtext, arr_checking));
                setVerificaFiltro(true);
            }
        }
    }
    
    function filtrar_AVs_prioridade(valor){
        // Filtra os onibus que estão com alerta de prioridade
        store.dispatch(filterParamChecking({prioridade: valor}));
        setIsSwitchOn(valor);
    }

    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    
    const onToggleSwitch = () => {setIsSwitchOn(!isSwitchOn)}

    return (
        <>
        {   (!is_loaded)?(
            <Loader></Loader>
        ):(
            <View style={{padding:0, margin:0}}>
                {/* <Searchbar
                    style={style.pesquisa_checking}
                    placeholder="Filtrar AVs"
                    value = {searchtext}
                    onChangeText={(str) => setSearchText(str)}
                    onSubmitEditing={()=>filtrar_AVs()}
                    onIconPress={()=>filtrar_AVs()}
                    /> */}
                {/* A função de filtrar prioridade ficará indisponível no momento

                <View style={{flexDirection:'row-reverse', alignItems:'center'}}>
                    <Switch style={{justifyContent:'center', width:60, height:50}} value={isSwitchOn} color="orange" onValueChange={(onToggleSwitch) => filtrar_AVs_prioridade(onToggleSwitch)} />
                    <Text style={{justifyContent:'center'}}>Exibir apenas AVs Prioritárias:</Text>
                </View> */
                }
                <SafeAreaView>
                    <ScrollView showsVerticalScrollIndicator={false} style={{paddingBottom:50}} 
                        refreshControl={
                            <RefreshControl
                              refreshing={refreshing}
                              onRefresh={()=>{setRefreshing(true); refresh_screen();}}
                            />
                          }
                    >
                        {(arr_checking.length)?
                            <>
                                {
                                    arr_checking.map((av_checking,index) => (
                                    
                                        <TouchableOpacity key={index.toString()} onPress={() => selecionar_calendario2(av_checking)}>
                                            <View style={style.container_av} key={index.toString()}>
                                                <View style={style.header}>
                                                    <View style={{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                    <Text style={style.titulo}>AV {av_checking.id}</Text>{ (av_checking.prioridade && av_checking.prioridade == '1') ? <><Badge style={[style.badge_prioridade]}>PRIORIDADE</Badge></> : <></> }
                                                    </View>
                                                    <Text style={style.subtitulo}>{av_checking.nome_campanha}</Text>
                                                    <Text style={style.subtitulo}>{av_checking.cliente}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                }
                            </>
                        : (
                            <Text>Sem checking fotográfico agendado!</Text>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </View>
        )} 
        </>    
    );
}

const style = StyleSheet.create({
    container_av: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom:10
    },
    header: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius:10,
        borderWidth: 0.5,
        borderColor: 'gray',
        paddingBottom: 15
    },
    container_calendario: {
        borderWidth: 0.5,
        borderTopWidth: 0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 2,
        textTransform: 'uppercase'
    },
    subtitulo: {
        fontSize: 16,
        marginVertical: 2
    },
    calendar_icon:{
        marginLeft: 0,
        marginRight: 0
    },
    badge: {
        alignSelf: 'center',
        backgroundColor: 'black'
    },
    pesquisa_checking: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom:20,
        marginTop: 0,
        padding: 5,
    },
    badge_prioridade: {
        borderRadius: 5,
        paddingHorizontal: 10,
        alignSelf: 'center',
        backgroundColor: '#6b0700',
        color: 'white',
        marginRight:5,
    },
});

export default connect(function mapStateToProps(state){ return {av_checking_calendario: state.checking.filter_items, verificafiltro: state.checking.filter_params, av_checking_calendario_or: state.checking.data} })(AVCheckingListar);