const INITIAL_STATE = [];

const UsersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_USERS':{
      return action.payload;
    }break;
    default:
      return state
  }
};

export default UsersReducer;