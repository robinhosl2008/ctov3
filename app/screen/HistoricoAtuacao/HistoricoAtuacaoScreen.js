import React, {useEffect}           from 'react';
import { Text, View, StyleSheet }   from 'react-native';
import { ScrollView }               from 'react-native-gesture-handler';
import HeaderBlank                  from '../../component/HeaderBlank';
import Timeline                     from 'react-native-timeline-flatlist'
import AppIcon                      from '../../component/AppIcon';
import AppBadge                     from '../../component/AppBadge';
import { Badge, List }              from 'react-native-paper';
import {useSelector}                from 'react-redux';
import util                         from './../../util/util';
import LottieCalendarioHistorico    from '../../component/LottieCalendarioHistorico';

export default function HistoricoAtuacaoScreen(props) { 

    const [arr_historico, setArrHistorico]  = React.useState([]);
    let arr_cto_sync                        = useSelector(state => state.cto_sync.data.sort(util.order_by('data_atuacao', 'desc')));
    let count_falta_sincronizar             = useSelector(state => state.cto_sync.count_falta_sincronizar);
    
    useEffect(() => {
        
        let arr_item = []; 

        arr_cto_sync.map((item) => {

            arr_item.push({
                title:          render_title(item),
                description:    render_content(item),
                icon:           (item.concluir_atuacao) ? <AppIcon lib="FontAwesome" icon="check" size={12} color={(item.sync) ? 'white' : 'black'} /> : <></>,
                circleColor:    (item.sync) ? 'green' : (item.concluir_atuacao == false) ? 'red' : 'lightgray'
            });

        });

        setArrHistorico(arr_item);

    }, [arr_cto_sync]);

    function render_title(item){

        let title = "Não definido";

        if (item['onibus_em_alerta'] && item['onibus_em_alerta_atuacao']){
            title = `${item.onibus_em_alerta.alerta} \n${item.onibus_em_alerta_atuacao.atuacao}`;
        } else {

            switch(item.tipo_movimento){
                case "OPERACAO_GARAGEM":{

                    // Quando não houver atuação "SEM ATUAÇÃO"]
                    // O título será obtido de outra forma
                    switch(item.submovimento){
                        case "CHECKLIST_PATRIMONIO":    title = "Checklist de Patrimônio"; break;
                        case "CARRO_NAO_ENCONTRADO":    title = "Carro não encontrado"; break;
                        case "RESOLVIDO_SEM_ATUACAO":   title = "Resolvido sem atuação"; break;
                    }

                }break;
                case "CHECKING":{
                    title = "Checking Fotográfico";
                }break;
            }

        }

        return (
            <View>
                    <Text style={style.title}>{item.numero_onibus}</Text>
                    <Text style={style.subtitle}>{title}</Text>
                    <Text style={style.horario}>{(item.data_atuacao) ? util.dataHoraUS2BR(item.data_atuacao) : 'Sem data...'}</Text>
            </View>
        );
    }

    function render_content(item){
        switch(item.tipo_movimento){
            case "OPERACAO_GARAGEM":{

                switch(item.submovimento){
                    case 'CHECKLIST_PATRIMONIO':{
                        return render_content_checklist(item);
                    }break;
                    case 'ASSOCIAR_PATRIMONIO': 
                    case 'DESASSOCIAR_PATRIMONIO':
                    case 'SUBSTITUIR_PATRIMONIO':{
                        return render_content_movimento_patrimonio(item);
                    }break;
                    default: {
                        return (
                            <View style={style.container_content}>
                                <></>
                            </View>
                        )
                    }
                }

            }break;
            case "CHECKING":{
                return render_checking_fotografico(item);  
            }break;
        }
    }

    function render_content_checklist(item){
        return (
            <View style={style.container_content}>
                {
                    item.arr_movimento[0].arr_checklist_patrimonio.map((item_patrimonio) => {
                        return (
                        <View style={{flexDirection: 'row', paddingVertical: 5}}>
                            <AppIcon lib="FontAwesome" icon={item_patrimonio.checked ? 'check-square-o' : 'square-o'}></AppIcon>
                            <Text style={{paddingHorizontal: 10, fontSize: 16}}>{item_patrimonio.patrimonio}</Text>
                        </View>
                        )
                    })
                }
            </View>
        )
    }

    function render_content_movimento_patrimonio(item){
        return (
            <View style={style.container_content}>
                {
                    item.arr_movimento.map((item_movimento) => {
                        return (
                            <View style={{flexDirection: 'row', paddingVertical: 5}}>
                                {
                                    (item_movimento.flag == 'ENTRADA') ? (
                                        <AppIcon lib="MaterialCommunityIcons" icon="arrow-up-bold-box" color="green"></AppIcon>
                                    ) : (
                                        <AppIcon lib="MaterialCommunityIcons" icon="arrow-down-bold-box" color="red"></AppIcon>
                                    )
                                }
                                <Text style={{paddingHorizontal: 10, fontSize: 16}}>{item_movimento.patrimonio}</Text>
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    function render_checking_fotografico(item){

        let item_movimento = item.arr_movimento[0];

        return (
            <View style={style.container_content}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{marginEnd: 10, minWidth: 62, fontWeight: 'bold'}}>AV:</Text>
                    <Text>{item_movimento.id_av}</Text>
                </View>        
                <View style={{flexDirection: 'row'}}>
                    <Text style={{marginEnd: 10, minWidth: 63, fontWeight: 'bold'}}>Cliente:</Text>
                    <Text style={{flex: 1, flexWrap: 'wrap'}}>{item_movimento.cliente}</Text>
                </View>        
                <View style={{flexDirection: 'row'}}>
                    <Text style={{marginEnd: 10, minWidth: 30, fontWeight: 'bold'}}>Campanha:</Text>
                    <Text style={{flex: 1, flexWrap: 'wrap'}}>{item_movimento.nome_campanha}</Text>
                </View>        
            </View>
        )
    }

    return (
        <View style={style.container}>
            <HeaderBlank 
                right={
                    (count_falta_sincronizar) ? (
                        <View style={{alignItems: 'flex-end', width: '100%'}}>
                                {
                                    (count_falta_sincronizar <= 1) ? (
                                        <Text style={{fontWeight: 'bold'}}>Falta Sincronizar</Text>
                                    ) : (
                                        <Text style={{fontWeight: 'bold'}}>Faltam Sincronizar</Text>
                                    )
                                }
                            <AppBadge style={{backgroundColor: 'red'}}>
                                {
                                    (count_falta_sincronizar <= 1) ? (
                                        <Text style={{fontWeight: 'bold'}}>{count_falta_sincronizar} atuação</Text>
                                    ) : (
                                        <Text style={{fontWeight: 'bold'}}>{count_falta_sincronizar} atuações</Text>
                                    )
                                }
                            </AppBadge>
                        </View>
                    ) : (
                        <View style={{alignItems: 'flex-end', width: '100%'}}>
                            <Text style={{fontWeight: 'bold'}}>Nenhuma Pendência</Text>
                            <AppBadge style={{backgroundColor: 'green'}}>Tudo Sincronizado</AppBadge>
                        </View>
                    )
                }
                content={
                <View style={{alignItems: 'center'}}>
                    <LottieCalendarioHistorico />
                    <Text style={{fontSize: 24, marginTop: 10}}>Registro de Atuação</Text>
                </View>
                }>
            Fechar
            </HeaderBlank>
                <Timeline 
                    style={style.list}
                    data={arr_historico}
                    circleSize={20}
                    circleColor='lightgray'
                    circleSize={30}
                    lineColor='lightgray'
                    showTime={false}
                    titleStyle={{marginTop: -10}}
                    descriptionStyle={{color:'gray'}}
                    options={{ style:{paddingTop:5} }}
                    innerCircle={'icon'}
                />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1
    },
    list: {
        flex: 1,
        paddingBottom: 40
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    horario: {
        fontStyle: 'italic',
        marginVertical: 2
    },
    container_content: {
        paddingTop: 5,
        paddingBottom: 10
    },
    item_furtado: {
        borderRadius: 5,
        paddingHorizontal: 5,
        backgroundColor: 'red',
        textTransform: 'uppercase'
    },
    item_localizado: {
        borderRadius: 5,
        paddingHorizontal: 5,
        backgroundColor: 'green',
        textTransform: 'uppercase'
    },
    badge_falta_sincronizar: {
        alignSelf: 'center',
        backgroundColor: 'red'
    }
});