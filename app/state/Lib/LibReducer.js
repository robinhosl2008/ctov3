const INITIAL_STATE = {
    lib_equipamento_status: {
      data:           [],
      obj_id_status:  {}
    },
    lib_em_alerta_atuacao: [],
    lib_equipamento_motivo_retirada: [],
    arr_filtro_atuacao: []
};

const LibReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_LIB_EQUIPAMENTO_STATUS':{

      let newState                    = {...state};
      newState.lib_equipamento_status = action.payload; 
      return newState;
      
    }break;
    case 'UPDATE_LIB_EM_ALERTA_ATUACAO':{
      let newState                    = {...state, ...action.payload};
      return newState;
    }break;
    case 'UPDATE_LIB_EQUIPAMENTO_MOTIVO_RETIRADA':{
      let newState                    = {...state, ...action.payload};
      return newState;
    }break;
    case 'UPDATE_LIB_FILTRO_ATUACAO':{
      let newState                    = {...state, ...action.payload};
      return newState;
    }break;
    default:
      return state
  }
};

export default LibReducer;