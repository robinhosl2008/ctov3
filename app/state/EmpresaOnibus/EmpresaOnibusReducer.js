const INITIAL_STATE = {
  data:         [],
  obj_id_item:  {}
};

const EmpresaOnibusReducer = (state = INITIAL_STATE, action) => { 
  switch (action.type) {
    case 'UPDATE_EMPRESA_ONIBUS':{
      return {...state, ...action.payload};      
    }break;
    default:
      return state
  }
};

export default EmpresaOnibusReducer;