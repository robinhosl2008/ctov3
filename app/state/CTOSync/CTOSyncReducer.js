const INITIAL_STATE = {
    data: [],
    count_falta_sincronizar: 0
};

const CTOSyncReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_CTO_SYNC':{

      let newState                      = {...state, ...action.payload};
      newState.count_falta_sincronizar  = somar_falta_sincronizar(newState);

      return newState;

    }break;
    default:
      return state
  }
};

function somar_falta_sincronizar(state){

  let total_falta_sincronizar = 0;

  state.data.map((item) => {
    if (item.concluir_atuacao == false || !item.sync){
      total_falta_sincronizar++;
    }
  });

  return total_falta_sincronizar;
}

export default CTOSyncReducer;