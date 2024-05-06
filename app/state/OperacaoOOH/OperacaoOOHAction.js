const UPDATE_OOH_EM_ALERTA             = "UPDATE_OOH_EM_ALERTA";
const UPDATE_OOH_FILTRO_ATUACAO        = "UPDATE_OOH_FILTRO_ATUACAO";
const FILTER_PARAM_OOH_EM_ALERTA       = "FILTER_PARAM_OOH_EM_ALERTA";
const DEL_FILTER_PARAM_OOH_EM_ALERTA   = "DEL_FILTER_PARAM_OOH_EM_ALERTA";

export const updateOOHEmAlerta = payload => ({
   type: UPDATE_OOH_EM_ALERTA,
   payload
});

export const updateOOHFiltroAtuacao = payload => ({
   type: UPDATE_OOH_FILTRO_ATUACAO,
   payload
});

export const filterParamOOHEmAlerta = payload => ({
   type: FILTER_PARAM_OOH_EM_ALERTA,
   payload
});

export const delFilterParamOOHEmAlerta = payload => ({
   type: DEL_FILTER_PARAM_OOH_EM_ALERTA,
   payload
});

