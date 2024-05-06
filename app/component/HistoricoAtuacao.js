import React                        from 'react';
import { View, Text, StyleSheet }   from 'react-native'
import { useNavigation }            from '@react-navigation/native';
import CardTitle                    from './CardTitle';
import {connect}                    from 'react-redux';
import HistoriciAtuacaoScreen       from './../screen/HistoricoAtuacao/HistoricoAtuacaoScreen'; 
import { TouchableOpacity }         from 'react-native-gesture-handler';
import { Badge, List }              from 'react-native-paper';
import {useSelector}                from 'react-redux';
import Title                        from './Title';
import LottieAttentionCircle        from './LottieAttentionCircle';
import AppIcon                      from './AppIcon';
import AlertaNaoConcluidoScreen from '../screen/AlertaNaoConcluido/AlertaNaoConcluidoScreen';
import util from '../util/util';

function HistoricoAtuacao(props) {

    let count_falta_sincronizar = useSelector(state => state.onibus_em_alerta.alertas_nao_concluidos.length);

    const navigation            = useNavigation();

    return (
        <View style={style.container}>
            <Title>Alertas não Concluídos</Title>
            <TouchableOpacity onPress={() => {navigation.navigate('AlertaNaoConcluidoScreen')}}> 
                <List.Item 
                    style={{backgroundColor: 'white', borderRadius: 10}}  
                    title="Alertas à concluir"
                    description="Verifique os alertas que estão pendentes de conclusão"
                    descriptionStyle={{paddingEnd: 20}}
                    left={props => <AppIcon lib="Feather" icon="alert-triangle" size={24} style={{paddingHorizontal: 18, alignSelf: 'center'}}></AppIcon>}
                    right={props => 
                        (count_falta_sincronizar > 0) ?
                        <LottieAttentionCircle>{count_falta_sincronizar}</LottieAttentionCircle> : 
                        <Badge style={{alignSelf: "center", backgroundColor: "black"}}>{count_falta_sincronizar}</Badge>
                    }
                />
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        marginBottom: 40
    }
});

function mapStateToProps(state) {
    return {
        cto_sync:   state.cto_sync
    };
}

export default connect(mapStateToProps)(HistoricoAtuacao);