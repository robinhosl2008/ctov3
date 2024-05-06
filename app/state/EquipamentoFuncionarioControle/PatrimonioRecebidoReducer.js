
const INITIAL_STATE = {

    // Armazena o total de patrimonios em mãos (Do usuário logado)
    total_patrimonio_recebido: 0,

    // Armazena o total de patrimonio recebido, por status
    arr_status_qtd: [],

    // Lista original dos patrimonios
    data: [],

    // Parametros utilizados para filtrar a lista de patrimonios
    filter_params: {},

    // Lista que contém os patrimonios filtrados
    filter_items: [],

    // Propriedade que armazena os dados para envio de Patrimônio
    envio_patrimonio: {
        id_status_inicio:           null,
        id_status_destino:          null,
        status_inicio:              null,
        status_destino:             null,
        id_destinatario:            null,
        destinatario:               null,
        id_coletador:               null,
        coletador:                  null,
        observacao:                 null,
        arr_id_patrimonio_enviar:   []
    }

};

const PatrimonioRecebidoReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
    case 'UPDATE_PATRIMONIO_RECEBIDO': {

        let newState = {...state, ...action.payload};

        // Atualiza automaticamente os itens filtrados
        newState.filter_items = auto_filter_apply(newState);

        return newState;

    }break;
    case 'FILTER_PARAM_PATRIMONIO_RECEBIDO': {

        // Extrai o index e o valor do payload
        let key   = Object.keys(action.payload);
        let value = action.payload[key];
        
        let newState = {...state};
        newState.filter_params[key] = value;

        // Atualiza automaticamente os itens filtrados
        newState.filter_items = auto_filter_apply(newState);

        return newState;

    }break;
    case 'DEL_FILTER_PARAM_PATRIMONIO_RECEBIDO': {
        
        let newState = {...state};
        delete newState.filter_params[action.payload];

        // Atualiza automaticamente os itens filtrados
        newState.filter_items = auto_filter_apply(newState);

        return newState;

    }break;
    case 'CLEAR_FILTER_PARAM_PATRIMONIO_RECEBIDO':{

        let newState = {...state};

        // 1. Limpa todos os parametros de filtro
        newState.filter_params = {};

        // 2. Atualiza automaticamente os itens filtrados
        newState.filter_items = auto_filter_apply(newState);

        return newState;

    }break;
    case 'ADD_PATRIMONIO_RECEBIDO_ENVIAR':{

        let newState = {...state};

        // Apenas adiciona ao array se o ID do Equipamento ainda não foi vinculado
        if (newState.arr_id_patrimonio_enviar.indexOf(action.payload) == -1){
        newState.envio_patrimonio.arr_id_patrimonio_enviar.push(action.payload);
        }

        return newState;

    }break;
    case 'DEL_PATRIMONIO_RECEBIDO_ENVIAR':{

        let newState  = {...state};
        let idx       = newState.envio_patrimonio.arr_id_patrimonio_enviar.indexOf(action.payload);

        if (idx > -1){
            newState.envio_patrimonio.arr_id_patrimonio_enviar.splice(idx, 1);
        }

        return newState;

    }break;
    case 'ADD_DEL_PATRIMONIO_RECEBIDO_ENVIAR': {

        let newState  = {...state};
        let idx       = newState.envio_patrimonio.arr_id_patrimonio_enviar.indexOf(action.payload);

        if (idx == -1){
            newState.envio_patrimonio.arr_id_patrimonio_enviar.push(action.payload);
        } else {
            newState.envio_patrimonio.arr_id_patrimonio_enviar.splice(idx, 1);
        }

        return newState;

    }break;
    case 'ENVIO_PATRIMONIO_ADD_STATUS_INICIO': {
        
        let newState                                = {...state};

        // 1. Define o status de origem
        newState.envio_patrimonio.id_status_inicio  = action.payload.id_status_inicio;
        newState.envio_patrimonio.status_inicio     = action.payload.status_inicio;

        // 2. Como estamos na primeira etapa para envio de patrimonio
        //    Precisamos limpar os demais parametros de envio, para evitar restícios de etapas anteriores
        newState.envio_patrimonio.status_destino    =           null;
        newState.envio_patrimonio.id_status_destino =           null;
        newState.envio_patrimonio.id_destinatario   =           null;
        newState.envio_patrimonio.destinatario      =           null;
        newState.envio_patrimonio.id_coletador      =           null;
        newState.envio_patrimonio.coletador         =           null;
        newState.envio_patrimonio.observacao        =           null;

        newState.envio_patrimonio.arr_id_patrimonio_enviar =    [];

        return newState;

    }break;
    case 'ENVIO_PATRIMONIO_ADD_STATUS_DESTINO': {
        let newState                                = {...state};
        newState.envio_patrimonio.id_status_destino = action.payload.id_status_destino;
        newState.envio_patrimonio.status_destino    = action.payload.status_destino;
        return newState;
    }break;
    case 'ENVIO_PATRIMONIO_ADD_USUARIO_DESTINO': {
        let newState                                = {...state};
        newState.envio_patrimonio.id_destinatario   = action.payload.id_destinatario;
        newState.envio_patrimonio.destinatario      = action.payload.destinatario;
        return newState;
    }break;
    case 'ENVIO_PATRIMONIO_ADD_COLETADOR': {
        let newState                                = {...state};
        newState.envio_patrimonio.id_coletador   = action.payload.id_coletador;
        newState.envio_patrimonio.coletador      = action.payload.coletador;
        return newState;
    }break;
    case 'LIMPAR_COLETADOR': {
        let newState                                = {...state};
        newState.envio_patrimonio.id_coletador      = null;
        newState.envio_patrimonio.coletador         = null;
        newState.observacao                         = null;
        return newState;
    }
    case 'ENVIO_PATRIMONIO_ADD_OBSERVACAO': {
        let newState                                = {...state};
        newState.envio_patrimonio.observacao        = action.payload.observacao;
        return newState;
    }
    default:
        return state;
    };
}

function auto_filter_apply(state){

    let filteredItems = state.data.filter(item => {

        let hasChecked = true;

        // Caso haja, filtra pelo Status do Patrimonio
        if ("id_equipamento_status" in state.filter_params && state.filter_params.id_equipamento_status !== item.id_equipamento_status ){
            hasChecked = false;
        }

        // Caso haja, filtra pelo Tipo de Patrimonio
        if ("id_lib_equipamento_tipo" in state.filter_params && state.filter_params.id_lib_equipamento_tipo !== item.id_lib_equipamento_tipo ){
            hasChecked = false;
        }

        // Caso haja, filtra pelo Nº do Patrimonio
        if ("patrimonio" in state.filter_params && state.filter_params.patrimonio && !item.patrimonio.includes(state.filter_params.patrimonio)){
            hasChecked = false;
        }
  
        if (hasChecked){
            return item;
        }

    });

    return filteredItems;
}

export default PatrimonioRecebidoReducer;
