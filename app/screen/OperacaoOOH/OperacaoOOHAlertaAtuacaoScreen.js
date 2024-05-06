import React, { useEffect, useState }             from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Image, ImageBackground, BackHandler, Alert }       from 'react-native';
import { useRoute }                     from '@react-navigation/native';
import { connect, useSelector }                      from 'react-redux';
import util                             from './../../util/util';
import { Badge, List, Modal, Portal, Button, Provider, Card }                  from 'react-native-paper';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Entypo                           from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons           from 'react-native-vector-icons/MaterialCommunityIcons';
import Title                            from './../../component/Title';
import { useNavigation }                from '@react-navigation/native';
import store                            from './../../state/store';
import ServiceMedia                     from '../../service/MediaService';
import {launchCamera}                   from 'react-native-image-picker';
import OperacaoOOHService               from './../../service/OperacaoOOHService';
import { clearFilterParamPatrimonioRecebido, filterParamPatrimonioRecebido }   from './../../state/EquipamentoFuncionarioControle/PatrimonioRecebidoAction';
import ApiService from '../../service/ApiService';
import AppButton from '../../component/AppButton';
import AppIcon from '../../component/AppIcon';
import HeaderBlank from '../../component/HeaderBlank';

export function OperacaoOOHAlertaAtuacaoScreen(props) {
    
    const {params}                                  = useRoute()
    const navigation                                = useNavigation();

    //recuperando parametros
    let id_lib_em_alerta = params.params.id_lib_em_alerta;
    let alerta_selecionado = params.params.alerta;
    //let filtro_atuacao = props.state.onibus_em_alerta.arr_filtro_atuacao;
    let estabelecimento = params.params.estabelecimento;
    let id_estabelecimento = params.params.id_estabelecimento;
    let id_av = params.params.id_av;
    let av = params.params.av;
    let id_ooh_ponto_em_alerta = params.params.id_ooh_ponto_em_alerta;

    const [atuacoes_concluidas, setAtuacoesConcluidas]      = useState(false);
    const [total_atuacoes, setTotalAtuacoes]                = useState(0);
    const [total_atuacoes_feitas, setTotalAtuacoesFeitas]   = useState(0);
    const [img_ponto, setImgPonto]                          = useState(require('./../../assets/image/foto-img-sem-conexao.png'));
    
    //variáveis de controle para tela de atuação
    const [atuacoes_obrigatorias, setAtuacoesObrigatorias]      = useState(0);
    const [realizadas_obrigatorias, setRealizadasObrigatorias]  = useState(0);
    const [atuacoes_opcionais, setAtuacoesOpcionais]            = useState(0);
    const [realizadas_opcionais, setRealizadasOpcionais]        = useState(0);
    const [has_obrigatoria, setHasObrigatoria]                  = useState(false);

    // Obtem os dados do Ponto em Alerta
    let ponto_em_alerta = useSelector(state => state.ooh_pontos_em_alerta.pontos_em_alerta.filter((item) => {
        if (item.id_ooh_ponto_em_alerta == id_ooh_ponto_em_alerta){
            return item;
        }
    }))[0];

    ApiService.get("cto/render-s3-image", {id_ooh_estabelecimento_ponto: ponto_em_alerta.id_ooh_estabelecimento_ponto})
    .then(res =>{
        setImgPonto({uri: res.data.dados.img_url}); 
    }).catch();
    
    console.log("                           __");
    console.log("  .-----------------------'  |");
    console.log(" /| _ .---. .---. .---. .---.|");
    console.log(" |j||||___| |___| |___| |___||");
    console.log(" |=|||=======THIAGOFSF=======|");
    console.log(" [_|j||(O)___________|(O)____]");
    console.log(ponto_em_alerta);
    console.log("Atuacoes Obrigatorias: "+ atuacoes_obrigatorias +'/n' +
    "Realizadas Obrigatorias: "+realizadas_obrigatorias + '/n'+
    "Atuacoes Opcionais: "+atuacoes_opcionais+'/n'+
    "Realizadas Opcionais:"+realizadas_opcionais);


    // Obtém apenas os dados do Alerta selecionado anteriormente
    let alerta          = ponto_em_alerta;
    let arr_atuacao     = (ponto_em_alerta['arr_atuacao'] !== undefined) ? util.obj_to_array(ponto_em_alerta['arr_atuacao']).sort(util.order_by("atuacao")) : [];

    useEffect(() => {  
        
        // Analia a quantidade de atuações pendentes
        let _total_atuacoes_feitas = 0;
        /* arr_atuacao.map((item) => {
            if (item['metadata'] !== undefined){
                _total_atuacoes_feitas = _total_atuacoes_feitas + 1;
            }
        }); */

        //contar atuacoes
        contarAtuacoes(alerta);

        // Define o total de atuações do aleta
        setTotalAtuacoes(arr_atuacao.length);

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

    console.log("                           __");
    console.log("  .-----------------------'  |");
    console.log(" /| _ .---. .---. .---. .---.|");
    console.log(" |j||||___| |___| |___| |___||");
    console.log(" |=|||=======THIAGOFSF=======|");
    console.log(" [_|j||(O)___________|(O)____]");
    console.log(arr_atuacao);
    console.log();

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


    // Função que verifica se ainda há atuação para ser realizada
    function hasAtuacao(){
        let arr_atuacao_pendente = arr_atuacao.filter((item) => {
            if (item['metadata'] === undefined && ( item['id_lib_em_alerta_atuacao_status'] == 1 || item['id_lib_em_alerta_atuacao_status'] == 3 )){
                return item;
            }
        });
        
        return (arr_atuacao_pendente.length > 0) ? true : false;
    }

    async function selecionar_atuacao(item_atuacao){
        
        // Variáveis de controle
        let hasPhoto                = false;
        let hasVideo                = false;

        // 3. Filtra apenas Patrimonio do tipo que deve ser associado, conforme a atuação
        if (item_atuacao.has_foto == '1'){
            hasPhoto = true;
        } else if (item_atuacao.has_video == '1'){
            hasVideo = true;
        }
        
        if(hasPhoto){

            await ServiceMedia.take_photo({
                nome_arquivo:               item_atuacao.id, 
                alerta:                     alerta, 
                ponto_em_alerta_atuacao:   item_atuacao 
            }).then((filename) => {

                navigation.navigate('LoadingSuccessScreen', {
                    screen: 'LoadingSuccessScreen',
                    params: { 
                        popCount: 1,
                    },
                });

                // Registra a atuação
                OperacaoOOHService.registrar_foto_atuacao({
                    alerta:                     ponto_em_alerta, 
                    ponto_em_alerta_atuacao:    item_atuacao,
                    filename:                   filename
                });

            }).catch((error) => {
                console.error("::: FOTO NÃO ENVIADA :::");
                console.log(error);
            });

        } else if(hasVideo) {

            await ServiceMedia.take_video({navigation: navigation}).then(async (filename) => {

                navigation.navigate('LoadingSuccessScreen', {
                    screen: 'LoadingSuccessScreen',
                    params: { 
                        popCount: 2,
                    },
                });
                console.log("entrou aqui, não devia")
                await OperacaoOOHService.registrar_video_atuacao({
                    alerta:                     ponto_em_alerta, 
                    ponto_em_alerta_atuacao:    item_atuacao,
                    filename:                   filename
                }); 
            }).catch((error) => {
                console.error("::: VÍDEO NÃO GRAVADO :::");
                console.info(error);
            });

        }
    }

    async function concluir_atuacao(){
        await OperacaoOOHService.concluir_atuacao({
            alerta:                     alerta
        });
        navigation.navigate('LoadingSuccessScreen', {
            screen: 'LoadingSuccessScreen',
            params: { 
                popCount: 5,
            },
        });
    }

    function render_item_atuacao(item_atuacao){

        // Se o status da atuação for igual a 1 (A fazer) ou 3 (Rejeitado) e não houver metadata
        // O usuário ainda precisa reazlizar a atuação
        let hasDone = false;
        let status = item_atuacao.id_lib_em_alerta_atuacao_status;
        console.log("status: "+status);

        if ((item_atuacao.id_lib_em_alerta_atuacao_status !== 1 && item_atuacao.id_lib_em_alerta_atuacao_status !== 3) || item_atuacao['metadata'] !== undefined){
            hasDone = true;
        }

        return (

            <View style={style.containeritem} key={item_atuacao.id_ooh_ponto_em_alerta_atuacao}>
                <TouchableOpacity disabled={hasDone} onPress={() => selecionar_atuacao(item_atuacao)}>
                    <View style={[style.header, (item_atuacao['metadata']) ? {fontWeight: 'bold'} : {}]}>
                        <View style={{flexDirection: 'row'}}>
                            {
                                (item_atuacao['metadata']) ? (
                                    <AppIcon lib="FontAwesome" icon="check" style={{marginEnd: 10}} />
                                ) : (<></>)
                                /* (status == 2 || status == 4) ? (
                                    <AppIcon lib="FontAwesome" icon="check" style={{marginEnd: 10}} />
                                ) : (<></>) */
                            }
                            <View style={{justifyContent:'flex-start', alignSelf:'flex-start'}}>
                                <Text style={style.title}>{item_atuacao.nome}</Text>
                                {item_atuacao.has_obrigatorio==1?(<Text style={style.badge_obrigatorio}>OBRIGATORIO</Text>):(<></>)}
                            </View>
                        </View>
                        <Entypo name="chevron-small-right" style={{alignSelf: 'center'}} size={20} />
                    </View>
                </TouchableOpacity>
            </View>

           /*  <TouchableOpacity disabled={hasDone} key={item_atuacao.id_ooh_ponto_em_alerta_atuacao} onPress={() => { selecionar_atuacao(item_atuacao) }}>
                <List.Item
                    title={item_atuacao.nome}
                    //description={item_atuacao.descricao}
                    style={[style.listItem]}
                    titleStyle={[(hasDone) ? {color: 'darkgray'} : {color: 'black'}]}
                    left={props => <MaterialCommunityIcons name={(hasDone) ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} color={(hasDone) ? "darkgray" : "black"} style={{alignSelf: 'center'}} size={20} />}
                    right={props => <Entypo name="chevron-small-right" color={(hasDone) ? "darkgray" : "black"} style={{alignSelf: 'center'}} size={20} />}
                />                                
            </TouchableOpacity> */  
        )
    }

    return (
        <>
        <View style={style.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.container_dados}>
            <HeaderBlank color={"black"} handle_close={exibirAlerta}> 
                Fechar
            </HeaderBlank>
            <Image
                    source={img_ponto}
                    resizeMode="cover"
                    style={{justifyContent:'center', width:130 , height:130, marginTop:-50, borderRadius: 130}}
                >
            </Image>
            <Text style={{fontSize: 16, color:'#000', paddingTop:10, fontWeight: 'bold'}}>{ponto_em_alerta.alerta} - {estabelecimento}</Text>
            {(ponto_em_alerta.av!=null)?(
                <Text style={{fontSize: 14, color:'#000'}}>
                    AV: {ponto_em_alerta.av.id} | {ponto_em_alerta.av.nome_campanha} | {ponto_em_alerta.av.cliente}
                </Text>
            ):(<></>)}    
        </View>

        <View style={{paddingHorizontal:20, paddingTop:20}}>
            <View style={style.containercard}>
                <View style={style.headercard}>
                    <View style={style.headerColcard}>
                            <Text style={style.estabelecimentocard}> {ponto_em_alerta.id_ooh_estabelecimento_ponto} | {ponto_em_alerta.produto}</Text>
                            {ponto_em_alerta.prioridade == '1' ? <><Badge style={[style.badge_prioridade]}>PRIORIDADE</Badge></> : <></> }
                    </View>
                    <View style={style.headerCol}>
                        <View style={style.header_status}>
                            <Badge style={[style.badge_status]}>EM ALERTA</Badge>
                            <Text style={{paddingHorizontal: 5}}>|</Text>
                            <Text style={{fontSize: 12, fontWeight: 'bold'}}>{(ponto_em_alerta.em_alerta_at) ? util.diff_in_days(ponto_em_alerta.em_alerta_at) + " dia(s)" : "Tempo Indefinido"}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1, }} />
                <View style={{
                    flexDirection: 'row',
                    padding: 10,
                    paddingEnd: 20,
                    borderRadius: 5
                }}>
                    <AppIcon lib="Octicons" icon="comment-discussion" color="gray" size={30} style={{marginRight:10}} />
                    <Text style={{color:'gray', fontSize:14}}>{ (ponto_em_alerta.observacao) ? ponto_em_alerta.observacao : "Sem observação..." }</Text>
                </View>
            </View>
        </View>

        <View style={{paddingHorizontal:20, paddingTop:20}}>
                    {/*console.log(arr_onibus_em_alerta_atuacao)*/}
            
                {
                    (arr_atuacao!=undefined)?(
                    arr_atuacao.map((item_atuacao) => {
                        return render_item_atuacao(item_atuacao)
                    })
                    ):(<></>)
                } 
        </View>
        </ScrollView>
            <View style={{paddingTop: 20, paddingHorizontal:20}}>
                <AppButton onPress={() => concluir_atuacao()} disabled={habilitarBotao()} style={(realizadas_obrigatorias == atuacoes_obrigatorias) ? {backgroundColor: '#00bd0b'}: {}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        { (atuacoes_concluidas) ? (<LottiePulseButton style={{marginEnd: 10}} />) : (<></>) }
                        <Text style={{fontSize: 16, color: 'white', textTransform: 'uppercase'}}>Concluir Atuação</Text>
                    </View>
                </AppButton>
            </View>
        </View>
        
        {/*
        <Provider>
            <Portal>
                <Modal visible={modalSemAtuacao} onDismiss={() => { setModalSemAtuacao(false) }} contentContainerStyle={{backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 5}}>
                    <OperacaoGaragemSemAtuacao onibus_em_alerta={onibusSemAtauacao} setModalSemAtuacao={setModalSemAtuacao} />
                </Modal>
            </Portal>
        </Provider>
        */}
        </>
    )
}

const style = StyleSheet.create({
    container_dados: {
        backgroundColor: 'white',
        paddingHorizontal:10,
        alignItems: 'center',
    },
    container_header:{
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 10,
    },
    onibus_info: {
        alignItems: 'center',
        backgroundColor: '#fafafa',
        width: '100%',
        padding: 10,
        borderRadius: 10,
    },
    header_status: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    badge_status: {
        borderRadius: 5,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        backgroundColor: 'orangered',
        color: 'white'
    },
    container_alerta_info: {
        width: "100%", 
        alignItems: 'center',
        paddingVertical: 15,
    },
    listItem: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 5
    },
    containeritem: {
        borderWidth: 0.5,
        borderColor: 'lightgray',
        borderRadius: 5,
        marginBottom: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#e6e6e6',
        padding: 15,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    title: {
        color: 'black',
        fontSize: 18,
        // fontWeight: 'bold'
    },
    container_atuacao: {
        marginVertical: 5,
        padding: 10
    },
    item_atuacao: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    badge_obrigatorio:{
        width:100,
        padding:3,
        backgroundColor:'#000',
        color:'#fff',
        borderRadius:5,
        textAlign:'center',
        fontSize:12,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom:10,
    },
    alerta: {
        fontSize: 16,
        marginTop:-7,
    },
    container_actions: {
        backgroundColor: 'white',
        padding: 30
    },
    status: {
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
    containercard:{
        borderWidth: 1,
        borderColor:'gray',
        borderRadius:5,
        padding:10,
    },
    headercard: {
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',//'#fafafa',
        paddingBottom:10,
        //borderBottomWidth: 0.2,
    },
    headerColcard: {
        flexDirection: 'column'
    },
    estabelecimentocard: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 0,
        marginTop : -5,
    },
});

export default connect(function mapStateToProps(state){ return {state} })(OperacaoOOHAlertaAtuacaoScreen);
