const UPDATE_PATRIMONIO_ENCAMINHADO                      = "UPDATE_PATRIMONIO_ENCAMINHADO";
const FILTER_PARAM_EQUIPAMENTO_FUNCIONARIO_CONTROLE      = "FILTER_PARAM_EQUIPAMENTO_FUNCIONARIO_CONTROLE";
const DEL_FILTER_PARAM_EQUIPAMENTO_FUNCIONARIO_CONTROLE  = "DEL_FILTER_PARAM_EQUIPAMENTO_FUNCIONARIO_CONTROLE";
const ADD_PATRIMONIO_RECEBER                             = "ADD_PATRIMONIO_RECEBER";
const DEL_PATRIMONIO_RECEBER                             = "DEL_PATRIMONIO_RECEBER";
const ADD_DEL_PATRIMONIO_RECEBER                         = "ADD_DEL_PATRIMONIO_RECEBER";
const CLEAR_PATRIMONIO_RECEBER                           = "CLEAR_PATRIMONIO_RECEBER";

export const updatePatrimonioEncaminhado = payload => ({
   type: UPDATE_PATRIMONIO_ENCAMINHADO,
   payload
});

export const filterParam = payload => ({
   type: FILTER_PARAM_EQUIPAMENTO_FUNCIONARIO_CONTROLE,
   payload
});

export const delFilterParam = payload => ({
   type: DEL_FILTER_PARAM_EQUIPAMENTO_FUNCIONARIO_CONTROLE,
   payload
});

export const addPatrimonioReceber = payload => ({
   type: ADD_PATRIMONIO_RECEBER,
   payload
});

export const delPatrimonioReceber = payload => ({
   type: DEL_PATRIMONIO_RECEBER,
   payload
});

export const addDelPatrimonioReceber = payload => ({
   type: ADD_DEL_PATRIMONIO_RECEBER,
   payload
});

export const clearPatrimonioReceber = payload => ({
   type: CLEAR_PATRIMONIO_RECEBER,
   payload
});

