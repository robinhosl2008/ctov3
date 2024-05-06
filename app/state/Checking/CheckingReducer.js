const INITIAL_STATE = {
    data:         [],
  
    // Parametros utilizados para filtrar a lista de checking
    filter_params: {},

    // Lista que contém os checkings filtrados
    filter_items: [],
};

const CheckingReducer = (state = INITIAL_STATE, action) => { 
  switch (action.type) {
    case 'UPDATE_CHECKING':{
      return {...state, ...action.payload};
    }break;

    case 'FILTER_PARAM_CHECKING': {

      // Extrai o index e o valor do payload
      let key   = Object.keys(action.payload);
      let value = action.payload[key];
      
      console.log("::: APLICANDO FILTRO DE CHECKING: ", key, value);

      let newState = {...state};
      newState.filter_params[key] = value;

      // Atualiza automaticamente os itens filtrados
      newState.filter_items = auto_filter_apply(newState);

      return newState;

    }break;

    case 'DEL_FILTER_PARAM_CHECKING': {
      
      let newState = {...state};
      newState.filter_params=[];

      // Atualiza automaticamente os itens filtrados
      newState.filter_items = auto_filter_apply(newState);

      return newState;

    }break;

    default:
      return state
  }
};

function auto_filter_apply(state){

  let clonedState   = JSON.parse(JSON.stringify(state));

  let filteredItems = clonedState.data.filter(item => {

      let hasChecked = true;

      // Caso haja, verifica de filtra por av, campanha ou cliente
      if(state.filter_params.texto_pesquisa){
        //if ("texto_pesquisa" in state.filter_params && (item.numero_onibus.startsWith(state.filter_params.numero_onibus)) === false){
        //  hasChecked = false;
        //}
        //if("texto_pesquisa" in state.filter_params && ( (item.id.startsWith(state.filter_params.texto_pesquisa)&&item.nome_campanha.startsWith(state.filter_params.texto_pesquisa)&&item.cliente.startsWith(state.filter_params.texto_pesquisa)) === false )){
        if("texto_pesquisa" in state.filter_params){
            console.log("Entrou na função de filtro");
            let avid = String(item.id);
            let avcampanha = item.nome_campanha.toLowerCase();
            let avcliente = item.cliente.toLowerCase();
            let filtrominusculo = state.filter_params.texto_pesquisa.toLowerCase();
            if(
              (avid.startsWith(state.filter_params.texto_pesquisa) === false) &&
              (avcampanha.indexOf(filtrominusculo)>-1 === false) &&
              (avcliente.indexOf(filtrominusculo)>-1 === false )
            ){
              hasChecked = false;
            }
            /* Usado para teste de desenvolvimento:
            console.log(avid);
            console.log(avcampanha);
            console.log(avcliente);
            console.log(state.filter_params.texto_pesquisa);
            if(avid.startsWith(state.filter_params.texto_pesquisa)){
              console.log("id da av vale");
            }
            if(avcampanha.indexOf(filtrominusculo)>-1){
              console.log("campanha vale")
            }
            if(avcliente.indexOf(filtrominusculo)>-1){
              console.log("cliente vale")
            }
            */
        }
      }
      
      // Caso haja, filtra por ônibus que estejam em Prioridade
      if ("prioridade" in state.filter_params && state.filter_params.prioridade === true ){
        if (item.prioridade != '1'){
          hasChecked = false;
        }
      }

      if (hasChecked){
          return item;
      }

  });

  return filteredItems;
}

export default CheckingReducer;