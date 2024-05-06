const INITIAL_STATE = {
    user_auth: {},
    modal_loading: {
        visible: false
    }
}

const AppReducer = (state = INITIAL_STATE, action) => {
switch (action.type) {

    case 'APP_USER_AUTH':{

        let newState            = {...state};
        newState['user_auth']   = action.payload;

        console.info("::: DEFININDO OS DADOS DO USUÁRIO");
        console.info("::: DEFININDO OS DADOS DO USUÁRIO");
        console.info("::: DEFININDO OS DADOS DO USUÁRIO");
        console.info(newState);

        return newState;
        
    }break;

    case 'APP_MODAL_LOADING':{
        let newState = {...state, ...action.payload};
        return newState;
    }break;

    default:
        return state
    }
};

export default AppReducer;