const INITIAL_STATE = {
  data:         []
};

const CheckingOnibusReducer = (state = INITIAL_STATE, action) => { 
  switch (action.type) {
    case 'UPDATE_CHECKING_ONIBUS':{
      return {...state, ...action.payload};
    }break;
    default:
      return state
  }
};

export default CheckingOnibusReducer;