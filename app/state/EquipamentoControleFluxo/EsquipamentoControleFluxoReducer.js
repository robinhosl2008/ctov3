
const INITIAL_STATE = {

  // Lista original do Controle de Fluxo de Equipamento
  data: [],

  // Armazena todos os possíveis status de recebimento e respectivos usuários
  arr_status_destino_user: [],

  // Armazena todos os possíveis status de recebimento/envio do usuário logado
  arr_fluxo_status: []
  
};

const EsquipamentoControleFluxoReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_EQUIPAMENTO_CONTROLE_FLUXO': {
      let newState = {...state, ...action.payload};
      return newState;
    }break;
    default:
      return state
  }
};

export default EsquipamentoControleFluxoReducer;