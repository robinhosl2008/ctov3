const INITIAL_STATE = {
    // Lista original de Coletas
    data: null,
    // Lista de coletas filtrado pelo user
    arr_coleta: null,
    // Contagem de coletas ativas
    cont_coletas_ativas: null,
};

const ColetaReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'DEF_COLETA':{
      console.log(":::::::ATENCAO\n:::::::ATENCAO\n:::::::ATENCAO\nEntrou no definir coleta");
      return {...state, ...action.payload};
    }break;
    default:
      return state
  }
};

function auto_filter_apply(state){

  let clonedState   = JSON.parse(JSON.stringify(state));

  let filteredItems = clonedState.data.filter(item => {

      let hasChecked = true;

      // Filtra os alertas que devem aparecer, com base no Filtro de Atuação do usuário
      let arr_alerta      = util.obj_to_array(item.arr_alerta);
      item['arr_alerta']  = arr_alerta.filter((alerta) => {
        if (state.arr_filtro_atuacao.includes(alerta.id_lib_em_alerta) && alerta['metadata'] === undefined){
          return alerta;
        }
      });

      if (item.arr_alerta.length == 0){
        hasChecked = false;
      }

      //if(state.arrayGaragem)
      if("array_garagem" in state.filter_params){
        let controle = false;
        for(let garagem of state.filter_params.array_garagem){
          if(item.id_garagem == garagem.id_empresa_onibus){
            controle = true;
          }
          hasChecked = controle;
        }
      }

      // Caso haja, filtra pelo ID da Garagem
      if ("id_empresa_onibus" in state.filter_params && state.filter_params.id_empresa_onibus !== item.id_garagem ){
        hasChecked = false;
      }

      // Caso haja, filtra pelo Número do ônibus
      if(state.filter_params.numero_onibus){
        if ("numero_onibus" in state.filter_params && (item.numero_onibus.startsWith(state.filter_params.numero_onibus)) === false){
          hasChecked = false;
          console.log(item);
        }
      }
      
      // Caso haja, filtra por ônibus que estejam em Prioridade
      if ("prioridade" in state.filter_params && state.filter_params.prioridade === true ){
        if (item.prioridade != '1'){
          hasChecked = false;
        }
      }

      // Não devem ser listados carros que tenham "metadata"
      // Pois são carros que ainda não foram processados pela CGO
      //if (item['metadata'] !== undefined){
      //  hasChecked = false;
      //}


      if (hasChecked){
          return item;
      }

  });

  if(state.filter_params.ordenar){
    if(state.filter_params.ordenar == "data-asc"){
      return filteredItems.sort(function(b,a){
        return util.diff_in_days(b.em_alerta_at) - util.diff_in_days(a.em_alerta_at);
      });
    }
    else if(state.filter_params.ordenar == "data-desc"){
      return filteredItems.sort(function(a,b){
        return util.diff_in_days(b.em_alerta_at) - util.diff_in_days(a.em_alerta_at);
      });
    }
    else if(state.filter_params.ordenar == "numero"){
      return filteredItems.sort(function(b,a){
        return b.numero_onibus - a.numero_onibus;
      });
    }
  }

  return filteredItems.sort(function(a,b){
    return util.diff_in_days(b.em_alerta_at) - util.diff_in_days(a.em_alerta_at);
  });

  // return filteredItems;
}
export default ColetaReducer;