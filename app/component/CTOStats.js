import React                        from 'react';
import { View, StyleSheet, Text }         from 'react-native';
import CardStat                     from './CardStat';
import Title                        from './Title';
import {useSelector}                from 'react-redux';
import AppIcon                      from './AppIcon';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {connect} from 'react-redux';

function CTOStats(props) {

    //Recuperar Dados do Status da Central Tecnica
    let cto = useSelector(state => state.cto_status.cto);
    //Recuperar array de patrimônio em posse do usuário
    let arr_filter_items = useSelector(state=> state.patrimonio_recebido.filter_items);
    //Objeto retornado pela função filtrar Patrimônios, contendo a qtd de cada patrimonio
    let qtdpatrimonios = filtrarPatrimonios(arr_filter_items);

    //Constante de navegação
    const navigation    = useNavigation();
    
    //Função Filtrar Patrimônios
    //Entrada: Array de patrimônios
    //Saída: objeto com qtd de cada patrimonio
    function filtrarPatrimonios(array){

        let players = 0;
        let modens = 0;
        let telas = 0;
        let roteadores = 0;
        let todos = 0;

        if(array.length>0){
            array.map(function(item){
                //Se o id_lib_equipamento_tipo for 1 então é Player
                if(item.id_lib_equipamento_tipo == '1'){
                    players ++;
                }
                //Se o id_lib_equipamento_tipo for 2 então é Modem
                else if(item.id_lib_equipamento_tipo == '2'){
                    modens ++;
                }
                //Se o id_lib_equipamento_tipo for 3 então é Tela
                else if(item.id_lib_equipamento_tipo == '3'){
                    telas ++;
                }
                //Se o id_lib_equipamento_tipo for 4 então é Roteador
                else if(item.id_lib_equipamento_tipo == '4'){
                    roteadores++;
                }
            });
        }
        todos = players + modens + telas + roteadores; 
        return {'qtdplayers':players,'qtdmodens': modens,'qtdtelas': telas,'qtdroteadores': roteadores, 'qtdtotal': todos};
    }

    //FUNÇÃO PARA NAVEGAR A TELA DE CONSULTAR PATRIMONIO PASSANDO O ARRAY DE VALORES COMO PARAMETRO
    function consultar_patrimonios(param){
        navigation.navigate('ConsultarPatrimonioScreen', {
            screen: 'ConsultarPatrimonioScreen',
            params: {qtd_patrimonios: param},
        });
    }

    function render_icon(num_icone) {
        switch(num_icone){
            case 1: return <Octicons style={style.icon} name="server" size={25} />;
            case 2: return <Fontisto style={style.icon} name="wifi" size={25} />;
            case 3: return <SimpleLineIcons style={style.icon} name="screen-desktop" size={25} />;
            case 4: return <MaterialCommunityIcons style={style.icon} name="router-wireless" size={25} />;
            default: {
                return <></>
            }
        }
    }

    return (
        <View style={style.container}>
            {/*console.log("Players: "+qtdpatrimonios.qtdplayers+"\nModens: "+qtdpatrimonios.qtdmodens+"\nTelas: "+qtdpatrimonios.qtdtelas+"\nRoteadores: "+qtdpatrimonios.qtdroteadores)*/}
            <Title>Central de Técnicos Onbus</Title>
            <View style={style.viewContainer}>
                <CardStat title="Carros em Alerta" value={cto.total_onibus_em_alerta}></CardStat>
                <CardStat title="Alertas Pendentes" value={cto.total_alerta_pendente}></CardStat> 
            </View>
            <View style={[style.viewContainer, {marginTop: 10}]}>
                <CardStat title="Atuações Pendentes" value={cto.total_atuacoes_pendentes}></CardStat>
                <CardStat title="Atuações à Validar" value={cto.total_atuacoes_validar}></CardStat> 
            </View>
            <TouchableOpacity onPress={() => {consultar_patrimonios(qtdpatrimonios)}}><View style={style.containerpatrimonios}>
                <Text style={style.containerpatrimoniostitulo}>Patrimônios:</Text>
                <View style={style.patrimonios}>
                    {render_icon(1)}
                    <Text style={style.textqtdpatrimonios}>{qtdpatrimonios.qtdplayers}</Text>
                    {render_icon(2)}
                    <Text style={style.textqtdpatrimonios}>{qtdpatrimonios.qtdmodens}</Text>
                    {render_icon(3)}
                    <Text style={style.textqtdpatrimonios}>{qtdpatrimonios.qtdtelas}</Text>
                    {render_icon(4)}
                    <Text style={style.textqtdpatrimonioslast}>{qtdpatrimonios.qtdroteadores}</Text>
                </View>
            </View></TouchableOpacity>
            
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        marginBottom: 40,
    },
    viewContainer: {
        flexDirection:"row", 
        justifyContent: "space-around",  
        alignSelf: "stretch"
    },
    containerpatrimonios:{
        width:'98%',
        alignSelf:'center',
        backgroundColor:'#fff',
        borderRadius: 10,
        marginTop:10,
        paddingHorizontal:10,
        paddingVertical:20,
        elevation: 2,
        shadowColor: 'grey',
        shadowOffset: {width: 10, height: 10},
        shadowOpacity: 1
    },
    containerpatrimoniostitulo:{
        color:"#777777",
        marginBottom:10,
    },
    patrimonios: {
        flexDirection:"row",
        justifyContent: "space-around",
        alignSelf:"stretch",
        alignItems:"center",
    },
    icon: {
        color:"#777777",
    },
    textqtdpatrimonios: {
        color: '#777777',
        fontSize: 25,
        marginRight:20,
    },
    textqtdpatrimonioslast: {
        color:'#777777',
        fontSize: 30,
    },
});

export default CTOStats;