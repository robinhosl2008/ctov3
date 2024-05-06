
const INITIAL_STATE = {

      // Armazena o total de patrimonios a receber (Do usuário logado)
      total_patrimonio_receber: 0,

      // Armazena o total de patrimonios a enviar (Do usuário logado)
      total_patrimonio_enviar: 0,

      // Propriedade que armazena o total de patrimonios que cada remetente enviou
      remetente_qtd: [],

      // Lista original dos patrimonios
      data: [],

      // Parametros utilizados para filtrar a lista de patrimonios
      filter_params: {},

      // Lista que contém os patrimonios filtrados
      filter_items: [],

      // Array que armazena os ID's dos patrimonios que o usuário marcou para receber
      // Essa lista será automaticamente esvaziada, quando ocorrer a sincronização com o servidor
      arr_id_patrimonio_receber: []

};

const EquipamentoFuncionarioControleReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_PATRIMONIO_ENCAMINHADO': {

      let newState = {...state, ...action.payload};

      // Atualiza automaticamente os itens filtrados
      newState.filter_items = auto_filter_apply(newState);

      return newState;

    }break;
    case 'FILTER_PARAM_EQUIPAMENTO_FUNCIONARIO_CONTROLE': {

      // Extrai o index e o valor do payload
      let key   = Object.keys(action.payload);
      let value = action.payload[key];
      
      let newState = {...state};
      newState.filter_params[key] = value;

      // Atualiza automaticamente os itens filtrados
      newState.filter_items = auto_filter_apply(newState);

      return newState;

    }break;
    case 'DEL_FILTER_PARAM_EQUIPAMENTO_FUNCIONARIO_CONTROLE': {
      
      let newState = {...state};
      delete newState.filter_params[action.payload];

      // Atualiza automaticamente os itens filtrados
      newState.filter_items = auto_filter_apply(newState);

      return newState;

    }break;
    case 'ADD_PATRIMONIO_RECEBER':{

      let newState = {...state};

      // Apenas adiciona ao array se o ID do Equipamento ainda não foi vinculado
      if (newState.arr_id_patrimonio_receber.indexOf(action.payload) == -1){
        newState.arr_id_patrimonio_receber.push(action.payload);
      }

      return newState;

    }break;
    case 'DEL_PATRIMONIO_RECEBER':{

      let newState  = {...state};
      let idx       = newState.arr_id_patrimonio_receber.indexOf(action.payload);

      if (idx > -1){
        newState.arr_id_patrimonio_receber.splice(idx, 1);
      }

      return newState;

    }break;
    case 'ADD_DEL_PATRIMONIO_RECEBER': {

      let newState  = {...state};
      let idx       = newState.arr_id_patrimonio_receber.indexOf(action.payload);

      if (idx == -1){
        newState.arr_id_patrimonio_receber.push(action.payload);
      } else {
        newState.arr_id_patrimonio_receber.splice(idx, 1);
      }

      return newState;

    }break;
    case 'CLEAR_PATRIMONIO_RECEBER': {

      let newState                        = {...state};
      newState.arr_id_patrimonio_receber  = [];

      return newState;

    }break;
    default:
      return state
  }
};

function auto_filter_apply(state){

  let filteredItems = state.data.filter(item => {

    let hasChecked = true;

    // Apenas itens com fluxo_status de "ENCAMINHADO" devem ser exibidos
    if (item.fluxo_status != 'ENCAMINHADO' ){
      hasChecked = false;
    }

    // Caso haja, filtra pelo ID do Remetente
    if ("id_remetente" in state.filter_params && state.filter_params.id_remetente !== item.id_remetente ){
      hasChecked = false;
    }

    if (hasChecked){
      return item;
    }

  });

  return filteredItems;
}

export default EquipamentoFuncionarioControleReducer;