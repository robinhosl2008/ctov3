import React from 'react';
import { View } from 'react-native';
import { Badge, List } from 'react-native-paper';
import Title from './Title';
import LottieAttentionCircle from './LottieAttentionCircle';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PatrimonioSaidaScreen from './../screen/Patrimonio/PatrimonioSaidaScreen';
import PatrimonioEntradaScreen from './../screen/Patrimonio/PatrimonioEntradaScreen';
import {useSelector}                from 'react-redux';
import {connect} from 'react-redux';
import AppIcon                      from './AppIcon';
import util from '../util/util';

function PatrimonioStats(props) {
    
    const navigation    = useNavigation(); 
    let total_receber   = props.equipamento_funcionario_controle.total_patrimonio_receber;
    let total_enviar    = props.equipamento_funcionario_controle.total_patrimonio_enviar;

    let arr_coleta      = useSelector(state=>state.coleta.arr_coleta);
    let total_coletas   = useSelector(state=>state.coleta.cont_coletas_ativas);

    return (
        <View>
            <Title>Transferência de Patrimônio</Title>
            <TouchableOpacity onPress={() => {navigation.navigate('PatrimonioSaidaScreen')}}>
                <List.Item 
                    style={{backgroundColor: 'white', borderRadius: 10, marginBottom: 5}} 
                    title={props.user_auth.label_saida_patrimonio}
                    description="Clique para enviar Patrimônios para outro colaborador"
                    left={props => <List.Icon {...props} icon="cloud-upload" color="darkorange" />}
                    right={props => 
                        (total_enviar > 0) ?
                        <LottieAttentionCircle>{total_enviar}</LottieAttentionCircle> : 
                        <Badge size={35} style={{alignSelf: "center", backgroundColor: "black"}}>{total_enviar}</Badge> 
                    }
                />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => {navigation.navigate('PatrimonioEntradaScreen')}}> 
                <List.Item 
                    style={{backgroundColor: 'white', borderRadius: 10}}  
                    title={props.user_auth.label_entrada_patrimonio}
                    description="Clique para receber Patrimônios"
                    left={props => <List.Icon {...props} icon="cloud-download" color="darkorange" />}
                    right={props => 
                        (total_receber > 0) ?
                        <LottieAttentionCircle>{total_receber}</LottieAttentionCircle> : 
                        <Badge size={35} style={{alignSelf: "center", backgroundColor: "black"}}>{total_receber}</Badge>
                    }
                />
            </TouchableOpacity>

            {/* Botao para Coleta */}
            <View style={{marginTop:45}}>
            <Title>Coleta de Patrimônio</Title>
            <TouchableOpacity onPress={() => {navigation.navigate('ColetaInfoScreen')}}> 
                <List.Item 
                    style={{backgroundColor: 'white', borderRadius: 10}}  
                    title="Coleta"
                    description="Gerenciar coleta de patrimônios"
                    descriptionStyle={{paddingEnd: 20}}
                    left={props => <AppIcon lib="Octicons" icon="package" size={24} style={{paddingHorizontal: 18, alignSelf: 'center'}}></AppIcon>}
                    right={props => 
                        (total_coletas > 0) ?
                        <LottieAttentionCircle>{total_coletas}</LottieAttentionCircle> : 
                        <Badge style={{alignSelf: "center", backgroundColor: "black"}}>{total_coletas}</Badge>
                    }
                />
            </TouchableOpacity>
            </View>
        </View>
    );
}

function mapStateToProps(state) {
    return {
        user_auth:                          state.app.user_auth,
        equipamento_funcionario_controle:   state.equipamento_funcionario_controle
    };
}

export default connect(mapStateToProps)(PatrimonioStats);