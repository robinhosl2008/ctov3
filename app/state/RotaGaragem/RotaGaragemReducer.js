import util from '../../util/util';

const INITIAL_STATE = {
    // Lista de dados original
    data: [],
};

const RotaGaragemReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_ROTA_GARAGEM':{
        let newState = {...state, ...action.payload};
        return newState;
    }break;
    default:
      return state
  }
};

export default RotaGaragemReducer;