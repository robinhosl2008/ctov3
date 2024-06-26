import React from 'react';
import HeaderApp from './../component/HeaderApp';
import { createStackNavigator } from '@react-navigation/stack';
import PatrimonioEntradaScreen from '../screen/Patrimonio/PatrimonioEntradaScreen';
import PatrimonioSaidaScreen from '../screen/Patrimonio/PatrimonioSaidaScreen';
import PatrimonioSaidaListaItensScreen from '../screen/Patrimonio/PatrimonioSaidaListaItensScreen';
import PatrimonioSaidaSelecionarStatusDestinoScreen from '../screen/Patrimonio/PatrimonioSaidaSelecionarStatusDestinoScreen';
import PatrimonioSaidaListaDestinatarioScreen from '../screen/Patrimonio/PatrimonioSaidaListaDestinatarioScreen';
import PatrimonioSaidaListaColetadorScreen from '../screen/Patrimonio/PatrimonioSaidaListaColetadorScreen';
import PatrimonioConfirmarSaidaScreen from '../screen/Patrimonio/PatrimonioConfirmarSaidaScreen';
import DrawerNavigator from './DrawerNavigator';
import OperacaoGaragemListaOnibusScreen from '../screen/OperacaoGaragem/OperacaoGaragemListaOnibusScreen';
import OperacaoGaragemAlertaAtuacaoScreen from '../screen/OperacaoGaragem/OperacaoGaragemAlertaAtuacaoScreen';
import OperacaoGaragemAssociarPatrimonioScreen from './../screen/OperacaoGaragem/OperacaoGaragemAssociarPatrimonioScreen';
import ConfirmarAssociarPatrimonioScreen from '../screen/App/ConfirmarAssociarPatrimonioScreen';
import LoadingSuccessScreen from '../screen/App/LoadingSuccessScreen';
import OperacaoGaragemAdicionarAtuacaoScreen from '../screen/OperacaoGaragem/OperacaoGaragemAdicionarAtuacaoScreen';
import OperacaoGaragemRetirarPatrimonioScreen from '../screen/OperacaoGaragem/OperacaoGaragemRetirarPatrimonioScreen';
import OperacaoGaragemSubstituirPatrimonioScreen from '../screen/OperacaoGaragem/OperacaoGaragemSubstituirPatrimonioScreen';
import OperacaoGaragemMotivoRetiradaScreen from '../screen/OperacaoGaragem/OperacaoGaragemMotivoRetiradaScreen';
import OperacaoGaragemSemAtuacaoScreen from '../screen/OperacaoGaragem/OperacaoGaragemSemAtuacaoScreen';
import OperacaoGaragemCheckListScreen from '../screen/OperacaoGaragem/OperacaoGaragemCheckListScreen';
import OperacaoGaragemConfirmarDesassociarPatrimonioScreen from '../screen/OperacaoGaragem/OperacaoGaragemConfirmarDesassociarPatrimonioScreen';
import OperacaoOOHListaAlertasScreen from '../screen/OperacaoOOH/OperacaoOOHListaAlertasScreen';
import OperacaoOOHListaAVScreen from '../screen/OperacaoOOH/OperacaoOOHListaAVScreen';
import OperacaoOOHListaEstabelecimentoScreen from '../screen/OperacaoOOH/OperacaoOOHListaEstabelecimentosScreen';
import OperacaoOOHListaPontosScreen from '../screen/OperacaoOOH/OperacaoOOHListaPontosScreen';
import OperacaoOOHAlertaAtuacaoScreen from '../screen/OperacaoOOH/OperacaoOOHAlertaAtuacaoScreen';
import CheckingListarAVScreen      from '../screen/Checking/CheckingListarAVScreen';
import CheckingListaRotaScreen      from '../screen/Checking/CheckingListaRotaScreen';
import CheckingListaGaragemScreen   from '../screen/Checking/CheckingListaGaragemScreen';
import CheckingListaOnibusScreen   from '../screen/Checking/CheckingListaOnibusScreen';
import LoginScreen from '../screen/App/LoginScreen';
import store from './../state/store';
import { connect } from 'react-redux';
import OperacaoGaragemOnibusScreen from '../screen/v2_OperacaoGaragem/OperacaoGaragemOnibusScreen';
import OperacaoGaragemListarAtuacaoScreen from '../screen/v2_OperacaoGaragem/OperacaoGaragemListarAtuacaoScreen';
import ConfirmarChecklistScreen from '../screen/OperacaoGaragem/ConfirmarChecklistScreen';
import ConfirmarCarroNaoEncontradoScreen from '../screen/OperacaoGaragem/ConfirmarCarroNaoEncontradoScreen';
import HistoricoAtuacaoScreen from '../screen/HistoricoAtuacao/HistoricoAtuacaoScreen';
import AlertaNaoConcluidoScreen from '../screen/AlertaNaoConcluido/AlertaNaoConcluidoScreen';
import ConsultarPatrimonioScreen from '../screen/ConsultarPatrimonio/ConsultarPatrimonioScreen';
import ConsultarPatrimonioItens from '../screen/ConsultarPatrimonio/ConsultarPatrimonioItens';
import ColetaInfoScreen from '../screen/Coleta/ColetaInfoScreen';
import ColetaExibirScreen from '../screen/Coleta/ColetaExibirScreen';
import VideoProcessingScreen from '../screen/App/VideoProcessingScreen';
import UpgradeScreen from '../screen/App/UpgradeScreen';


const Stack         = createStackNavigator();
const AppNavigator  = (props) => (
    <Stack.Navigator
        screenOptions={{
            headerMode: "screen",
            header: ({ scene, previous, navigation }) => (
                <HeaderApp scene={scene} previous={previous} navigation={navigation} />
            ),
        }}>
        {
            (props.user.id === undefined) ? (
                <>
                    <Stack.Screen name="LoginScreen" options={{title: "Login", headerShown: false}} component={LoginScreen} />
                    <Stack.Screen name="UpgradeScreen" options={{title: "Upgrade", headerShown: false}} component={UpgradeScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="HomeScreen" options={{title: "Home"}} component={DrawerNavigator} /> 

                    <Stack.Screen name="PatrimonioEntradaScreen" options={{title: store.getState().app.user_auth.label_entrada_patrimonio}} component={PatrimonioEntradaScreen} />
                    <Stack.Screen name="PatrimonioSaidaScreen" options={{title: store.getState().app.user_auth.label_saida_patrimonio}} component={PatrimonioSaidaScreen} />
                    <Stack.Screen name="PatrimonioSaidaListaItensScreen" options={{title: store.getState().app.user_auth.label_saida_patrimonio}} component={PatrimonioSaidaListaItensScreen} />
                    <Stack.Screen name="PatrimonioSaidaSelecionarStatusDestinoScreen" options={{title: store.getState().app.user_auth.label_saida_patrimonio}} component={PatrimonioSaidaSelecionarStatusDestinoScreen} />
                    <Stack.Screen name="PatrimonioSaidaListaDestinatarioScreen" options={{title: store.getState().app.user_auth.label_saida_patrimonio}} component={PatrimonioSaidaListaDestinatarioScreen} />
                    <Stack.Screen name="PatrimonioSaidaListaColetadorScreen" options={{title: store.getState().app.user_auth.label_saida_patrimonio}} component={PatrimonioSaidaListaColetadorScreen} />
                    <Stack.Screen name="PatrimonioConfirmarSaidaScreen" options={{headerShown: false}} component={PatrimonioConfirmarSaidaScreen} />
                    <Stack.Screen name="OperacaoGaragemListaOnibusScreen" options={{title: "Operação Garagem"}} component={OperacaoGaragemListaOnibusScreen} />
                    <Stack.Screen name="OperacaoGaragemAlertaAtuacaoScreen" options={{title: "Operação Garagem"}} component={OperacaoGaragemAlertaAtuacaoScreen} />
                    <Stack.Screen name="OperacaoGaragemAssociarPatrimonioScreen" options={{headerShown: false}} component={OperacaoGaragemAssociarPatrimonioScreen} />
                    <Stack.Screen name="OperacaoGaragemRetirarPatrimonioScreen" options={{headerShown: false}} component={OperacaoGaragemRetirarPatrimonioScreen} />
                    <Stack.Screen name="OperacaoGaragemSubstituirPatrimonioScreen" options={{headerShown: false}} component={OperacaoGaragemSubstituirPatrimonioScreen} />
                    <Stack.Screen name="OperacaoGaragemAdicionarAtuacaoScreen" options={{headerShown: false}} component={OperacaoGaragemAdicionarAtuacaoScreen} />
                    <Stack.Screen name="OperacaoGaragemSemAtuacaoScreen" options={{headerShown: false}} component={OperacaoGaragemSemAtuacaoScreen} />
                    <Stack.Screen name="OperacaoGaragemCheckListScreen" options={{headerShown: false}} component={OperacaoGaragemCheckListScreen} />
                    <Stack.Screen name="OperacaoGaragemMotivoRetiradaScreen" options={{headerShown: false}} component={OperacaoGaragemMotivoRetiradaScreen} />
                    <Stack.Screen name="OperacaoGaragemConfirmarDesassociarPatrimonioScreen" options={{headerShown: false}} component={OperacaoGaragemConfirmarDesassociarPatrimonioScreen} />
                    <Stack.Screen name="OperacaoOOHListaAlertasScreen" options={{title: "Operação OOH"}} component={OperacaoOOHListaAlertasScreen} />
                    <Stack.Screen name="OperacaoOOHListaAVScreen" options={{title: "Operação OOH"}} component={OperacaoOOHListaAVScreen} />
                    <Stack.Screen name="OperacaoOOHListaEstabelecimentoScreen" options={{title: "Operação OOH"}} component={OperacaoOOHListaEstabelecimentoScreen} />
                    <Stack.Screen name="OperacaoOOHListaPontosScreen" options={{title: "Operação OOH"}} component={OperacaoOOHListaPontosScreen} />
                    <Stack.Screen name="OperacaoOOHAlertaAtuacaoScreen" options={{title: "Operação OOH", headerShown: false}} component={OperacaoOOHAlertaAtuacaoScreen} />
                    <Stack.Screen name="ConfirmarAssociarPatrimonioScreen" options={{headerShown: false}} component={ConfirmarAssociarPatrimonioScreen} />
                    <Stack.Screen name="CheckingListarAVScreen" options={{title: "Checking Fotográfico"}} component={CheckingListarAVScreen} />
                    <Stack.Screen name="CheckingListaRotaScreen" options={{headerShown: false}} component={CheckingListaRotaScreen} />
                    <Stack.Screen name="CheckingListaGaragemScreen" options={{headerShown: false}} component={CheckingListaGaragemScreen} />
                    <Stack.Screen name="CheckingListaOnibusScreen" options={{headerShown: false}} component={CheckingListaOnibusScreen} />
                    <Stack.Screen name="v2OperacaoGaragemOnibus" options={{headerShown: false}} component={OperacaoGaragemOnibusScreen} /> 
                    <Stack.Screen name="v2OperacaoGaragemListarAtuacaoScreen" options={{headerShown: false}} component={OperacaoGaragemListarAtuacaoScreen} /> 
                    <Stack.Screen name="ConfirmarChecklistScreen" options={{headerShown: false}} component={ConfirmarChecklistScreen} /> 
                    <Stack.Screen name="ConfirmarCarroNaoEncontradoScreen" options={{headerShown: false}} component={ConfirmarCarroNaoEncontradoScreen} /> 
                    <Stack.Screen name="HistoricoAtuacaoScreen" options={{headerShown: false}} component={HistoricoAtuacaoScreen} /> 
                    <Stack.Screen name="AlertaNaoConcluidoScreen" options={{headerShown: false}} component={AlertaNaoConcluidoScreen} /> 
                    <Stack.Screen name="LoadingSuccessScreen" options={{headerShown: false}} component={LoadingSuccessScreen} />
                    <Stack.Screen name="ConsultarPatrimonioScreen" options={{headerShown: false}} component={ConsultarPatrimonioScreen} />
                    <Stack.Screen name="ConsultarPatrimonioItens" options={{headerShown: false}} component={ConsultarPatrimonioItens} />
                    <Stack.Screen name="ColetaInfoScreen" options={{title: 'Coleta de Patrimônios', headerShown: true}} component={ColetaInfoScreen} />
                    <Stack.Screen name="ColetaExibirScreen" options={{title: 'Coleta de Patrimônios', headerShown: true}} component={ColetaExibirScreen} />
                    <Stack.Screen name="VideoProcessingScreen" options={{headerShown: false}} component={VideoProcessingScreen} />
                </>
            )
        }
    </Stack.Navigator> 
);

export default connect(function mapStateToProps(state){ return {user: state.app.user_auth} })(AppNavigator);
// export default AppNavigator;