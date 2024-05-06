import { combineReducers }                      from 'redux';
import AppReducer                               from './App/AppReducer';
import LibReducer                               from './Lib/LibReducer';
import UsersReducer                             from './Users/UsersReducer';
import EsquipamentoControleFluxoReducer         from './EquipamentoControleFluxo/EsquipamentoControleFluxoReducer';
import EquipamentoFuncionarioControleReducer    from './EquipamentoFuncionarioControle/EquipamentoFuncionarioControleReducer';
import PatrimonioEncaminhadoReducer             from './EquipamentoFuncionarioControle/PatrimonioEncaminhadoReducer';
import PatrimonioRecebidoReducer                from './EquipamentoFuncionarioControle/PatrimonioRecebidoReducer';
import PatrimonioHistoricoReducer               from './EquipamentoFuncionarioControle/PatrimonioHistoricoReducer';   
import EmpresaOnibusReducer                     from './EmpresaOnibus/EmpresaOnibusReducer';
import EmpresaOnibusFuncionarioReducer          from './EmpresaOnibusFuncionario/EmpresaOnibusFuncionarioReducer';
import OnibusEmAlertaReducer                    from './OperacaoGaragem/OnibusEmAlertaReducer';
import CheckingReducer                          from './Checking/CheckingReducer';
import CheckingOnibusReducer                    from './Checking/CheckingOnibusReducer';
import RotaGaragemReducer                       from './RotaGaragem/RotaGaragemReducer';
import CTOSyncReducer                           from './CTOSync/CTOSyncReducer'; 
import CTOStatusReducer                         from './CTOStatus/CTOStatusReducer';
import ColetaReducer                            from './Coleta/ColetaReducer';
import OperacaoOOHReducer                       from './OperacaoOOH/OperacaoOOHReducer';


export default combineReducers({
    app:                                AppReducer,
    lib:                                LibReducer,
    users:                              UsersReducer,
    checking:                           CheckingReducer,
    checking_onibus:                    CheckingOnibusReducer, 
    equipamento_controle_fluxo:         EsquipamentoControleFluxoReducer,
    equipamento_funcionario_controle:   EquipamentoFuncionarioControleReducer,
    patrimonio_encaminhado:             PatrimonioEncaminhadoReducer,
    patrimonio_recebido:                PatrimonioRecebidoReducer,
    patrimonio_historico:               PatrimonioHistoricoReducer,
    empresa_onibus:                     EmpresaOnibusReducer,
    empresa_onibus_funcionario:         EmpresaOnibusFuncionarioReducer,
    onibus_em_alerta:                   OnibusEmAlertaReducer,
    ooh_pontos_em_alerta:               OperacaoOOHReducer,
    rota_garagem:                       RotaGaragemReducer,
    cto_sync:                           CTOSyncReducer,
    cto_status:                         CTOStatusReducer,
    coleta:                             ColetaReducer,
});
