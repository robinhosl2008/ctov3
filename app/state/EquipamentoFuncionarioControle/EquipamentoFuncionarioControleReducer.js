const INITIAL_STATE = {
    total_patrimonio_receber:   0,
    total_patrimonio_enviar:    0,
};

const EquipamentoFuncionarioControleReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_EQUIPAMENTO_FUNCIONARIO_CONTROLE':{
      return {...state, ...action.payload};
    }break;
    default:
      return state
  }
};

export default EquipamentoFuncionarioControleReducer;