const INITIAL_STATE = {
    cto:         {
      total_alerta_pendente:    0,
      total_atuacoes_pendentes: 0,
      total_atuacoes_validar:   0,
      total_onibus_em_alerta:   0,
      total_onibus_prioridade:  0,

      total_ooh_a_fazer: 0,
      total_checking_a_fazer:0,
      total_garagem_a_fazer:0
    }
  };
  
  const CTOStatusReducer = (state = INITIAL_STATE, action) => { 
    switch (action.type) {
      case 'UPDATE_CTO_STATUS':{
        return {...state, ...action.payload};
      }break;
      default:
        return state
    }
  };
  
  export default CTOStatusReducer;