import React, {useState, useEffect} from 'react'
import { View, StyleSheet, Text, Alert, BackHandler } from 'react-native'
import HeaderBlank from '../../component/HeaderBlank';
import OperacaoGaragemAtuacao from './../../component/v2OperacaoGaragem/OperacaoGaragemAtuacao';
import { useSelector } from 'react-redux'
import { List } from 'react-native-paper';
import store  from '../../state/store';
import { useRoute }         from '@react-navigation/native';
import { useNavigation }    from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import util from '../../util/util';
import { ScrollView } from 'react-native-gesture-handler';
import AppButton from './../../component/AppButton';
import LottiePulseButton from './../../component/LottiePulseButton';
import OperacaoGaragemRightBusInfo from './../../component/v2OperacaoGaragem/OperacaoGaragemRightBusInfo';
import OperacaoGaragemAtuacaoBusInfo from './../../component/v2OperacaoGaragem/OperacaoGaragemAtuacaoBusInfo';
import OperacaoGaragemService from '../../service/OperacaoGaragemService';
import AppIcon from './../../component/AppIcon';
import { appModalLoading }                                          from './../../state/App/AppAction';
 
export default function OperacaoGaragemListarAtuacaoScreen(props) {

    const {params}                                          = useRoute()
    const navigation                                        = useNavigation(); 
    let id_onibus                                           = params.params.id_onibus;
    let id_onibus_em_alerta                                 = params.params.id_onibus_em_alerta;
    let arr_onibus_em_alerta_atuacao                        = {};
    const [atuacoes_concluidas, setAtuacoesConcluidas]      = useState(false);
    const [total_atuacoes, setTotalAtuacoes]                = useState(0);
    const [total_atuacoes_feitas, setTotalAtuacoesFeitas]   = useState(0);

    //variáveis de controle para tela de atuação
    const [atuacoes_obrigatorias, setAtuacoesObrigatorias]      = useState(0);
    const [realizadas_obrigatorias, setRealizadasObrigatorias]  = useState(0);
    const [atuacoes_opcionais, setAtuacoesOpcionais]            = useState(0);
    const [realizadas_opcionais, setRealizadasOpcionais]        = useState(0);
    const [has_obrigatoria, setHasObrigatoria]                  = useState(false);

    // Obtém apenas os dados do Ônibus em Alerta
    let onibus_em_alerta = useSelector(state => state.onibus_em_alerta.data.filter((item) => {
        if (item.id_onibus == id_onibus){
            return item;
        }
    }))[0];
    
    // Obtém o alerta que está sendo atuado
    let alerta = util.obj_to_array(onibus_em_alerta.arr_alerta).filter((item) => {
        if (item.id_onibus_em_alerta == id_onibus_em_alerta){
            return item;
        }
    })[0];

    // Gera um array de atuações, indexados pelo "id_lib_em_alerta_atuacao"
    let arr_onibus_em_alerta_atuacao_temp      = (alerta['arr_atuacao'] !== undefined) ? util.obj_to_array(alerta['arr_atuacao']) : [];
    for(let atuacao of arr_onibus_em_alerta_atuacao_temp){
        arr_onibus_em_alerta_atuacao[atuacao['id_lib_em_alerta_atuacao']] = atuacao;
    }

    arr_onibus_em_alerta_atuacao = util.obj_to_array(arr_onibus_em_alerta_atuacao);

    // Se tivermos num alerta Facultativo, onde o técnico tem a liberdade de escolher a atuação
    // Precisamos listar todas as possibilidades de atuação para o Técnico
    // **DESATIVADO **
    /*if (alerta.has_facultativo == "1"){
        useSelector(state => state.lib.lib_em_alerta_atuacao.map((item) => {
            if (!arr_onibus_em_alerta_atuacao[item.id]){
                arr_onibus_em_alerta_atuacao[item.id] = {
                    "id_onibus_em_alerta_atuacao":      null, // Será gerado quando o usuário realizar a atuação
                    "atuacao":                          item.nome,
                    "descricao":                        item.descricao,
                    "has_foto":                         item.has_foto,
                    "has_modem":                        item.has_modem,
                    "has_observacao":                   item.has_observacao,
                    "has_player":                       item.has_player,
                    "has_roteador":                     item.has_roteador,
                    "has_tela":                         item.has_tela,
                    "has_troca_equipamento":            item.has_troca_equipamento,
                    "has_video":                        item.has_video,
                    "id_lib_em_alerta_atuacao":         item.id,
                    "id_lib_em_alerta_atuacao_status":  2,
                    "status":                           "Pendente"
                }
            }
        }));
    }*/

    useEffect(() => { 
        
        // Analia a quantidade de atuações pendentes
        let _total_atuacoes_feitas = 0;
        arr_onibus_em_alerta_atuacao_temp.map((item) => {
            if (item['metadata'] !== undefined){
                _total_atuacoes_feitas = _total_atuacoes_feitas + 1;
            }
        });

        //contar atuacoes
        contarAtuacoes(alerta);

        // Define o total de atuações do aleta
        setTotalAtuacoes(arr_onibus_em_alerta_atuacao_temp.length);

        // Define o total de atuações concluídas
        setTotalAtuacoesFeitas(_total_atuacoes_feitas);

        // Define se o alerta teve todas as atuações realizadas ou não
        setAtuacoesConcluidas((total_atuacoes == total_atuacoes_feitas && total_atuacoes_feitas > 0) ? true : false);

        // Detectar pressionamento do botao voltar
        const backAction = () => {
            exibirAlerta();
            return true;
          };
             const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
             return () => backHandler.remove();
    });

    function contarAtuacoes(alerta){
        let total_obrigatorias = 0;
        let total_optativas = 0;
        let concluidas_obrigatorias = 0;
        let concluidas_optativas = 0;
        let arrayatuacao = []

        if(alerta.arr_atuacao != undefined){
            arrayatuacao = util.obj_to_array(alerta.arr_atuacao);
        }
        for(let atuacao of arrayatuacao){
            if(atuacao.has_obrigatorio==1){
                total_obrigatorias ++;
                if(atuacao.metadata!=undefined || atuacao.id_lib_em_alerta_atuacao_status == 2 || atuacao.id_lib_em_alerta_atuacao_status == 4){
                    concluidas_obrigatorias ++;
                }
            }
            else{
                total_optativas ++;
                if(atuacao.metadata!=undefined || atuacao.id_lib_em_alerta_atuacao_status == 2 || atuacao.id_lib_em_alerta_atuacao_status == 4){
                    concluidas_optativas ++;
                }
            }
        }

        setAtuacoesObrigatorias(total_obrigatorias);
        setAtuacoesOpcionais(total_optativas);
        setRealizadasObrigatorias(concluidas_obrigatorias);
        setRealizadasOpcionais(concluidas_optativas);

        if(total_obrigatorias>0){
            setHasObrigatoria(true);
        }

    }

    function exibirTotalAlertas(){
        return (
            <View>
                {(atuacoes_obrigatorias==0)?<Text style={{fontSize:14,color:'#ff3d00', fontWeight:'bold', textAlign:'center'}}>Sem atuações obrigatórias</Text>:<Text style={{fontSize:14,color:'#ff3d00', fontWeight:'bold', textAlign:'center'}}>{realizadas_obrigatorias} de {atuacoes_obrigatorias} obrigatórias</Text>}
                {(atuacoes_opcionais==0)?<Text style={{fontSize:12, color:'#808080', textAlign:'center'}}>Sem atuações opcionais</Text>:<Text style={{fontSize:12, color:'#808080', textAlign:'center'}}>{realizadas_opcionais} de {atuacoes_opcionais} opcionais</Text>}
            </View>
        );
    }

    function exibirAlerta(){
        
        
        let total = 0;
        let concluidas = 0;

        total = atuacoes_obrigatorias + atuacoes_opcionais;
        concluidas = realizadas_obrigatorias + realizadas_opcionais;
        

        if(concluidas == 0){
            //console.log("nada a fazer");
            navigation.goBack();
        }
        else if(atuacoes_obrigatorias > 0 && atuacoes_opcionais <= 0){
            //console.log("POSSUI APENAS OBRIGATORIAS");
            //console.log("Concluidas: "+concluidas+" | total: "+ total);
            if(concluidas>=1 && concluidas < total){
                Alert.alert("ATENÇÃO", "Ainda existem atuações obrigatórias não realizadas.\n\nDeseja mesmo voltar?", [
                    { text: "Sim", onPress: () => navigation.goBack() },
                    {
                      text: "Não",
                      onPress: () => null,
                      style: "cancel"
                    },
                  ]);
            }
            else if(concluidas==total){
                Alert.alert("ATENÇÃO", "Você já realizou todas as atuações obrigatórias deste alerta porém ainda não concluiu.\n\nDeseja concluir agora?", [
                    {
                        text: "Cancelar",
                        onPress: () => null,
                        style: "cancel"
                      },
                      {
                        text: "Sair mesmo assim",
                        onPress: () => navigation.goBack(),
                        style: "cancel"
                    },
                    { text: "Concluir Agora", onPress: () => concluir_atuacao() }
                  ]);
            }
        }
        else if(atuacoes_obrigatorias <= 0 && atuacoes_opcionais > 0){
            //console.log("POSSUI APENAS OPTATIVAS");
            if(concluidas>=1 && concluidas < total){
                Alert.alert("ATENÇÃO", "Ainda existem atuações opcionais não realizadas, mas Você já pode concluir este alerta.\n\nDeseja concluir?", [
                    {
                        text: "Cancelar",
                        onPress: () => null,
                        style: "cancel"
                      },
                      {
                        text: "Sair mesmo assim",
                        onPress: () => navigation.goBack(),
                        style: "cancel"
                    },
                    { text: "Concluir Agora", onPress: () => concluir_atuacao() }
                ]);
            }
            else if(concluidas==total){
                Alert.alert("ATENÇÃO", "Você já realizou todas as atuações porém ainda não concluiu o alerta.\n\nDeseja concluir agora?", [
                    {
                        text: "Cancelar",
                        onPress: () => null,
                        style: "cancel"
                      },
                      {
                        text: "Sair mesmo assim",
                        onPress: () => navigation.goBack(),
                        style: "cancel"
                    },
                    { text: "Concluir Agora", onPress: () => concluir_atuacao() }
                  ]);
            }
        }
        else if(atuacoes_obrigatorias > 0 && atuacoes_opcionais > 0){
            //console.log("POSSUI AMBAS")
            if(concluidas>=1 && concluidas < total){
                if(realizadas_obrigatorias == atuacoes_obrigatorias){
                    Alert.alert("ATENÇÃO", "Você já realizou todas as atuações obrigatórias porém ainda não concluiu o alerta.\n\nDeseja concluir agora?", [
                        {
                            text: "Cancelar",
                            onPress: () => null,
                            style: "cancel"
                          },
                          {
                            text: "Sair mesmo assim",
                            onPress: () => navigation.goBack(),
                            style: "cancel"
                        },
                        { text: "Concluir Agora", onPress: () => concluir_atuacao() }
                      ]);
                }else{
                    Alert.alert("ATENÇÃO", "Ainda existem atuações obrigatórias não realizadas. Deseja mesmo voltar?", [
                        { text: "Sim", onPress: () => navigation.goBack() },
                        {
                            text: "Não",
                            onPress: () => null,
                            style: "cancel"
                          },
                      ]);
                }
                
            }
            else if(concluidas==total){
                Alert.alert("ATENÇÃO", "Você já realizou todas as atuações porém ainda não concluiu, deseja concluir agora?", [
                    {
                        text: "Cancelar",
                        onPress: () => null,
                        style: "cancel"
                      },
                      {
                        text: "Sair mesmo assim",
                        onPress: () => navigation.goBack(),
                        style: "cancel"
                    },
                    { text: "Concluir Agora", onPress: () => concluir_atuacao() }
                  ]);
            }
        }
    }

    //Função para concluir atuação
    function concluir_atuacao(){

        // Habilita a Modal de Loading
        //store.dispatch(appModalLoading({modal_loading:{ visible: true }}));
        
       navigation.navigate('LoadingSuccessScreen', {
            screen: 'LoadingSuccessScreen',
            params: { 
                popCount: 3,
            },
        });
        OperacaoGaragemService.concluir_atuacao({onibus_em_alerta: onibus_em_alerta, alerta: alerta})

        //navigation.navigate("HomeScreen");
    }

    function habilitarBotao(){
        if(has_obrigatoria === true){
            if(atuacoes_obrigatorias == realizadas_obrigatorias){
                return false;
            }
            else{
                return true;
            }
        }
        else{
            if(realizadas_opcionais>0){
                return false;
            }
            else{
                return true;
            }
        }
    }

    return (
        <>
        <View style={style.container}>
            <HeaderBlank handle_close={exibirAlerta}> 
                Fechar
            </HeaderBlank>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{alignContent:'center', alignItems:'center', marginBottom:10}}>
                <AppIcon lib="Fontisto" icon="bus" size={50} style={{marginEnd: 5}}></AppIcon>
                <Text style={style.numero_onibus}>{onibus_em_alerta.numero_onibus}</Text>
                <Text style={style.alerta}>{alerta.alerta}</Text>
                <View style={style.status}>
                    {exibirTotalAlertas()
                    }
                </View>
            </View>

            <OperacaoGaragemAtuacaoBusInfo onibus_em_alerta={onibus_em_alerta} alerta={alerta} />
                    {/*console.log(arr_onibus_em_alerta_atuacao)*/}
            {
                (arr_onibus_em_alerta_atuacao.length == 0)?
                (
                <View style = {{alignItems:'center', paddingVertical:50, paddingHorizontal:5}}>
                    <Text style={{color:'gray'}}>Não há atuações para este carro</Text>
                </View>):
                (
                    util.obj_to_array(arr_onibus_em_alerta_atuacao).map((item_atuacao) => {
                        return (
                            <View key={item_atuacao.id_onibus_em_alerta_atuacao}>
                                <OperacaoGaragemAtuacao 
                                    title={item_atuacao.atuacao}
                                    onibus_em_alerta={onibus_em_alerta}
                                    alerta={alerta}
                                    item_atuacao={item_atuacao}
                                />
                            </View>
                        )
                        })
                )

            }
            </ScrollView>
            <View style={{paddingTop: 20}}>
                <AppButton onPress={() => concluir_atuacao()} disabled={habilitarBotao()} style={(realizadas_obrigatorias == atuacoes_obrigatorias) ? {backgroundColor: '#00bd0b'}: {}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        { (atuacoes_concluidas) ? (<LottiePulseButton style={{marginEnd: 10}} />) : (<></>) }
                        <Text style={{fontSize: 16, color: 'white', textTransform: 'uppercase'}}>Concluir Atuação</Text>
                    </View>
                </AppButton>
            </View>
        </View>
        </>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingBottom:10,
    },
    numero_onibus: {
        fontSize: 36,
        fontWeight: 'bold'
    },
    alerta: {
        fontSize: 16,
        marginTop:-7,
    },
    container_actions: {
        backgroundColor: 'white',
        padding: 30
    },
    badge_status: {
        borderRadius: 5,
        alignSelf: 'center',
        backgroundColor: 'orangered',
        color: 'white',
        paddingVertical: 5,
        paddingHorizontal:10
    },
    status: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    badge_prioridade: {
        borderRadius: 5,
        alignSelf: 'center',
        backgroundColor: '#6b0700',
        color: 'white',
        paddingVertical: 5,
        paddingHorizontal:10,
        marginRight:5,
    },
});