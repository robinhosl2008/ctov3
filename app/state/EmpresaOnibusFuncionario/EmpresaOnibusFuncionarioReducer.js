const INITIAL_STATE = {
  data: []
};

const EmpresaOnibusFuncionarioReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_EMPRESA_ONIBUS_FUNCIONARIO':{
      return {...state, ...action.payload};      
    }break;
    default:
      return state
  }
};

export default EmpresaOnibusFuncionarioReducer;