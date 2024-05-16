import React, {useState} from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Badge, Searchbar } from 'react-native-paper'
import { connect } from 'react-redux';
import util from './../../util/util';
import { useNavigation } from '@react-navigation/native';
import {StatusBar} from 'react-native';
import { filterParamOnibusEmAlerta } from './../../state/OperacaoGaragem/OnibusEmAlertaAction';
import store from './../../state/store';
import RNPickerSelect from "react-native-picker-select";
import OperacaoGaragemService from '../../service/OperacaoGaragemService';
import { useRoute } from '@react-navigation/core';
import Loader from '../Loader';

function OperacaoGaragemOnibus(props) { 

    const {params}                                                      = useRoute()
    const garagem                                                       = params.route_params.id_garagem;
    const [arr_onibus_em_alerta, setOnibusEmAlerta]                     = useState([]);

    const [verificafiltro, setVerificaFiltro]                           = useState(false);
    const [arr_onibus_em_alerta_bk, setOnibusEmAlertaBackup]            = useState([]);

    const [is_loaded, setLoaded]                                        = useState(false);
    const [is_loading, setLoading]                                      = useState(false);
    const [renderflatlist, setRender]                                   = useState(false);
    const [searchtext, setSearchText]                                   = useState(null);


    //Função que define os valores para a tela
    async function definir_variaveis(){
        console.log(":::Definindo Variaveis");
        setLoading(true); //Esta carregando
        //Obter do firestore a lista de onibus em alerta filtrada pelo filtro de atuação e garagem
        let onibus_em_alerta = await OperacaoGaragemService.listar_onibus_em_alerta({id_empresa_onibus: garagem});
        //let onibus_em_alerta = await OperacaoGaragemService.listar_onibus_em_alerta();
        setOnibusEmAlerta(onibus_em_alerta);
        setLoaded(true); //carregou as informacoes
    }

    //console.log("LISTA RETORNADA AQUI");
    //console.log(props.items);
    //console.log("LISTA LOCAL:");
    if(!is_loaded && !is_loading){
        definir_variaveis();
    }
    if(is_loaded && is_loading){
        setLoading(false);
    }

    const navigation                                = useNavigation();
    const [pageSize, addPageSize]                   = useState(10);

    function filtrar_por_numero(){
        // Filtra os onibus pelo número
        console.log("::Filtrando por numero");
        console.log(searchtext);
        //se há filtro previo aplicado
        if(verificafiltro){
            setOnibusEmAlerta(OperacaoGaragemService.filtrar_por_numero(searchtext, arr_onibus_em_alerta_bk));
            console.log("FILTRO EXECUTADO");
            //forçar reload
            setRender(!renderflatlist);
        }
        //Verifica se o valor da variavel é vazia
        else if(searchtext==null||searchtext==''){
            setOnibusEmAlerta(arr_onibus_em_alerta_bk);
            setOnibusEmAlertaBackup([]);
            setVerificaFiltro(false);
            //forçar reload
            setRender(!renderflatlist);
        }
        else{
            setOnibusEmAlertaBackup(arr_onibus_em_alerta);
            setOnibusEmAlerta(OperacaoGaragemService.filtrar_por_numero(searchtext, arr_onibus_em_alerta));
            setVerificaFiltro(true);
            console.log("FILTRO EXECUTADO");
            //forçar reload
            setRender(!renderflatlist);
        }
        
        //store.dispatch(filterParamOnibusEmAlerta({numero_onibus: str}));
    }

    function ordenar_lista(tipo){
        // Ordena a lista de acordo com o parâmetro (data, numero)
        let lista_tempo = OperacaoGaragemService.ordenar_lista(tipo, arr_onibus_em_alerta);
        setOnibusEmAlerta(lista_tempo);
        setRender(!renderflatlist);
        console.log("lista ordenada");
        /* setValue(str);
        store.dispatch(filterParamOnibusEmAlerta({ordenar: str})); */
    }

    function filtrar_prioridade(valor){
        // Filtra os onibus que estão com alerta de prioridade
        store.dispatch(filterParamOnibusEmAlerta({prioridade: valor}));
        setIsSwitchOn(valor);
    }
    
    //FUNÇÃO SUBSTITUIDA PELA VER_ALERTAS
    function selecionar_alerta(item, item_alerta){
        navigation.navigate('v2OperacaoGaragemOnibus', {
            screen: 'v2OperacaoGaragemOnibus',
            params: { id_onibus: item.id_onibus, id_onibus_em_alerta: item_alerta.id_onibus_em_alerta, numero_onibus: item.numero_onibus},
        });
    }
    //Função criada para substituir selecionar_alertas, passa apenas item como parâmetro, não passa id_onibus_em_alerta para a tela seguinte
    function ver_alertas(item){
        navigation.navigate('v2OperacaoGaragemOnibus', {
            screen: 'v2OperacaoGaragemOnibus',
            params: { id_onibus: item.id_onibus, numero_onibus: item.numero_onibus, arr_alerta: item.arr_alerta},
        });
    }

    //função que verifica se a lista a ser carregada está vazia
    function verifica_listas(){
        if(arr_onibus_em_alerta.length<=0){
            return false;
        }
        return true;
    }
     
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    
    const onToggleSwitch = () => {setIsSwitchOn(!isSwitchOn)}
    
    function renderOnibus(item){

        let arr_alerta = util.obj_to_array(item.arr_alerta);
        let arr_onibus_em_alerta = util.obj_to_array(item);
        let arrayatuacao = []

        let checkarAlertas = false;
        
        arr_onibus_em_alerta.map(function(alerta){
            //Usado para teste em desenvolvimento
            //console.log("ALERTA:");
            //console.log(alerta.metadata);
            if(alerta.metadata == undefined){
                //Usado para teste em desenvolvimento
                //console.log("EXIBIR");
                checkarAlertas = true;
            }
        });

        if(checkarAlertas === true){
            return(
                <View>
                    <TouchableOpacity onPress={() => {ver_alertas(item)}} style={style.container}>
                        <View style={style.header}>
                            <View style={style.headerCol}>
                                    <Text style={style.garagem}>{item.garagem}</Text>
                                    <Text style={style.numero_onibus}>{item.numero_onibus}</Text>
                            </View>
                            <View style={style.headerCol}>
                                <View style={style.header_status}>
                                    {
                                    item.has_alerta ? (
                                    <>
                                        {item.prioridade == '1' ? <><Badge style={[style.badge_prioridade]}>PRIORIDADE</Badge></> : <></> }
                                        <Badge style={[style.badge_status]}>EM ALERTA</Badge>
                                        <Text style={{paddingHorizontal: 5}}>|</Text>
                                        <Text style={{fontSize: 12, fontWeight: 'bold'}}>{(item.em_alerta_at) ? util.diff_in_days(item.em_alerta_at) + " dia(s)" : "Tempo Indefinido"}</Text>
                                    </>
                                    ) : (
                                    <>{
                                        //<Text>...</Text>
                                    }
                                    </>)
                                    }
                                    {//<Entypo name="chevron-small-right" color="black" style={{alignSelf: 'center', width:20,}} size={20} />
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={{paddingLeft:10,}}>
                            <Text style={{fontWeight:'bold'}}>Alertas:</Text>
                        {
                            arr_alerta.map((item_alerta) => {
                                return (
                                    <>
                                    {(!item_alerta.metadata && item_alerta.id_lib_em_alerta_status == 1)?(<Text key={item_alerta.id_onibus_em_alerta}>{item_alerta.alerta}</Text>):(<></>)}
                                    </>      
                                )
                            })
                        }
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }else{
            return(<></>);
        }
    }
    const [value, setValue] = React.useState('numero');
    return (
        <>
        {   (!is_loaded)?(
            <Loader></Loader>
        ):(
            <View style={{ paddingTop: StatusBar.currentHeight, paddingHorizontal: 10 }}>
                
                <Searchbar
                    style={style.pesquisa_onibus}
                    placeholder="Filtrar por Número"
                    onChangeText={(str) => setSearchText(str)}
                    keyboardType="number-pad"
                    onSubmitEditing={()=>filtrar_por_numero()}
                    onIconPress={()=>filtrar_por_numero()}
                    inputStyle={{
                        minHeight: 0
                    }}
                /> 

                <Text style={style.ordenarPor} >Ordenar Por:</Text>
                <View style={style.ordena_onibus}>
                    <RNPickerSelect
                        pickerProps={{style : {width: '100%', height:30,}, inputAndroid: {backgroundColor:'white'} }}
                        style={{backgroundColor:'white'}}
                        placeholder={{
                            label: 'Ordenação Padrão',
                            value: null,
                            color: 'black'
                        }}
                        onValueChange={(value) => ordenar_lista(value, )}
                        items={[
                            { label: "Ordenar por n° do Carro", value: "numero" },
                            { label: "Carro em alerta a mais tempo", value: "data-desc" },
                            { label: "Carro em alerta a menos tempo", value: "data-asc" },
                        ]}
                    />
                </View>

                {(is_loaded)?(
                    (verifica_listas())?(
                       
                        <FlatList style={{marginBottom:150}}
                            data={util.paginate(arr_onibus_em_alerta, pageSize, 1)}
                            extraData={renderflatlist} 
                            renderItem={({item}) => renderOnibus(item) }
                            keyExtractor={(item) => item.id_onibus}
                            onEndReached={() =>  addPageSize(pageSize + 10) }
                            onEndReachedThreshold={0.3}
                            ListFooterComponent={() => {
                                if (pageSize >= props.items.length) return null;
                                return (
                                    <View style={{flex: 1}}>
                                        <ActivityIndicator size="large" color="darkorange" /> 
                                    </View>
                                );
                            }}
                            />
                    ):(
                        <Text>Nenhum Resultado Encontrado</Text>
                    )
                ):(
                    <Loader></Loader>
                )}
                
            </View>
        )
        }
        </>
    )
}

const style = StyleSheet.create({
    ordenarPor: {
        fontSize: 14,
        marginBottom: 3,
        color: 'black',
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 25,
        padding: 15,
    },
    onibus_card: {
        padding: 15,
    },
    header: {
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',//'#fafafa',
        //borderBottomWidth: 0.2,
    },
    headerCol: {
        flexDirection: 'column'
    },
    garagem: {
        color: 'black',
        fontSize: 14,
    },
    numero_onibus: {
        fontSize: 37,
        fontWeight: 'bold',
        paddingVertical: 0,
        marginTop : -5,
    },
    header_status: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    badge_status: {
        borderRadius: 5,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        backgroundColor: 'orangered',
        color: 'white'
    },
    badge_prioridade: {
        borderRadius: 5,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        backgroundColor: '#6b0700',
        color: 'white',
        marginRight:5,
    },
    list_item: {
        paddingVertical: 15,
    },
    pesquisa_onibus: {
        height:45,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom:10,
        padding: 0,
        shadowOpacity: 0,
    },
    ordena_onibus:{
        alignItems: "center",
        backgroundColor: 'white',
        padding: 3,
        borderRadius:10, 
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        marginBottom:10,
    },
    botaofiltro:{
        height:40,
        paddingLeft:10,
        paddingRight:10,
        borderRadius:10,
        marginLeft:5,
        marginRight: 5,
    }
});

export default connect(function mapStateToProps(state){ return {items: state.onibus_em_alerta.filter_items} })(OperacaoGaragemOnibus);
