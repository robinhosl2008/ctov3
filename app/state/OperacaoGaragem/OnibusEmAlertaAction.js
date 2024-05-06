const UPDATE_ONIBUS_EM_ALERTA             = "UPDATE_ONIBUS_EM_ALERTA";
const UPDATE_FILTRO_ATUACAO               = "UPDATE_FILTRO_ATUACAO";
const FILTER_PARAM_ONIBUS_EM_ALERTA       = "FILTER_PARAM_ONIBUS_EM_ALERTA";
const DEL_FILTER_PARAM_ONIBUS_EM_ALERTA   = "DEL_FILTER_PARAM_ONIBUS_EM_ALERTA";

export const updateOnibusEmAlerta = payload => ({
   type: UPDATE_ONIBUS_EM_ALERTA,
   payload
});

export const updateFiltroAtuacao = payload => ({
   type: UPDATE_FILTRO_ATUACAO,
   payload
});

export const filterParamOnibusEmAlerta = payload => ({
   type: FILTER_PARAM_ONIBUS_EM_ALERTA,
   payload
});

export const delFilterParamOnibusEmAlerta = payload => ({
   type: DEL_FILTER_PARAM_ONIBUS_EM_ALERTA,
   payload
});

