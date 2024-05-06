import util                         from './../../util/util';

const INITIAL_STATE = {
    
    // Lista de dados original
    data: [],

    //Lista de Pontos em Alerta
    pontos_em_alerta:[],

    //Estabelecimentos com Alertas
    estabelecimentos_com_alerta:[],

    // Parametros utilizados para filtrar a lista de pontos em alerta
    filter_params: {},

    // Lista que contém os pontos em alerta filtrados
    filter_items: [],

    // carregar estabelecimentos associadas ao funcionario
    array_estabelecimentos: [],

    // Lista que contém os dados de alertas não concluídos
    alertas_nao_concluidos:[],
    
    // Armazena o filtro de atuação do funcionário
    arr_filtro_atuacao: [] 

};

const OperacaoOOHReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_OOH_EM_ALERTA':{

        let newState = {...state, ...action.payload};

        // Atualiza automaticamente os itens filtrados
        newState.filter_items = auto_filter_apply(newState);
        newState.alertas_nao_concluidos = processarAtuação(newState.filter_items);

        return newState;

    }break;

    case 'FILTER_PARAM_OOH_EM_ALERTA': {

      // Extrai o index e o valor do payload
      let key   = Object.keys(action.payload);
      let value = action.payload[key];

      let newState = {...state};
      newState.filter_params[key] = value;

      // Atualiza automaticamente os itens filtrados
      newState.filter_items = auto_filter_apply(newState);
      newState.alertas_nao_concluidos = processarAtuação(newState.filter_items);

      return newState;

    }break;

    case 'DEL_FILTER_PARAM_OOH_EM_ALERTA': {
      
      let newState = {...state};
      newState.filter_params = [];
      // Atualiza automaticamente os itens filtrados
      newState.filter_items = auto_filter_apply(newState);
      newState.alertas_nao_concluidos = processarAtuação(newState.filter_items);

      return newState;

    }break;

    case 'UPDATE_OOH_FILTRO_ATUACAO': {

      let newState = {...state, ...action.payload};

      // Atualiza automaticamente os itens filtrados
      newState.filter_items = auto_filter_apply(newState);
      newState.alertas_nao_concluidos = processarAtuação(newState.filter_items);

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

      // Filtra os alertas que devem aparecer, com base no Filtro de Atuação do usuário
      /* let arr_alerta      = util.obj_to_array(item.arr_alerta);
      item['arr_alerta']  = arr_alerta.filter((alerta) => {
        if (state.arr_filtro_atuacao.includes(alerta.id_lib_em_alerta) && alerta['metadata'] === undefined){
          return alerta;
        }
      });

      if (item.arr_alerta.length == 0){
        hasChecked = false;
      } */

      //if(state.arrayGaragem)
      if("array_estabelecimentos" in state.filter_params){
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

function processarAtuação(lista){
  let alertasProcessados = [];
  /* lista.map(function(onibus){
    //console.log("ONIBUS: ");
    //console.log(onibus);
    onibus.arr_alerta.map(function(alerta){
        //console.log("ALERTA: ");
        //console.log(alerta);
        let realizadas = 0;
        let a_realizar = 0;
        let exibir = 0;
        if(alerta.metadata){
            //console.log("alerta concluido");
        }
        else{
            //console.log("alerta nao concluido");
            if(alerta.arr_atuacao){
                util.obj_to_array(alerta.arr_atuacao).map(function(atuacao){
                    if(atuacao.has_obrigatorio == 1){

                        a_realizar ++;
                        if(atuacao.metadata){
                            realizadas++;
                            exibir = 1;
                        }
                    }
                })
            }
        }
        if(exibir == 1){
            alertasProcessados.push({id_alerta: alerta.id_onibus_em_alerta, alerta_txt: alerta.alerta, num_onibus: onibus.numero_onibus, id_garagem: onibus.id_garagem, garagem: onibus.garagem, realizadas: realizadas, a_realizar: a_realizar, id_onibus: onibus.id_onibus});
        }

    })
  }); */
  //console.log("<br>Alertas Processados:");
  //console.log(alertasProcessados);
  return alertasProcessados;
}

export default OperacaoOOHReducer;