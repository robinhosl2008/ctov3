
const UPDATE_PATRIMONIO_RECEBIDO             = "UPDATE_PATRIMONIO_RECEBIDO";
const FILTER_PARAM_PATRIMONIO_RECEBIDO       = "FILTER_PARAM_PATRIMONIO_RECEBIDO";
const DEL_FILTER_PARAM_PATRIMONIO_RECEBIDO   = "DEL_FILTER_PARAM_PATRIMONIO_RECEBIDO";
const ADD_PATRIMONIO_RECEBIDO_ENVIAR         = "ADD_PATRIMONIO_RECEBIDO_ENVIAR";
const DEL_PATRIMONIO_RECEBIDO_ENVIAR         = "DEL_PATRIMONIO_RECEBIDO_ENVIAR";
const CLEAR_FILTER_PARAM_PATRIMONIO_RECEBIDO = "CLEAR_FILTER_PARAM_PATRIMONIO_RECEBIDO";
const ADD_DEL_PATRIMONIO_RECEBIDO_ENVIAR     = "ADD_DEL_PATRIMONIO_RECEBIDO_ENVIAR";
const ENVIO_PATRIMONIO_ADD_STATUS_INICIO     = "ENVIO_PATRIMONIO_ADD_STATUS_INICIO"; 
const ENVIO_PATRIMONIO_ADD_STATUS_DESTINO    = "ENVIO_PATRIMONIO_ADD_STATUS_DESTINO"; 
const ENVIO_PATRIMONIO_ADD_USUARIO_DESTINO   = "ENVIO_PATRIMONIO_ADD_USUARIO_DESTINO";
const ENVIO_PATRIMONIO_ADD_COLETADOR         = "ENVIO_PATRIMONIO_ADD_COLETADOR";
const LIMPAR_COLETADOR                       = "LIMPAR_COLETADOR";
const ENVIO_PATRIMONIO_ADD_OBSERVACAO        = "ENVIO_PATRIMONIO_ADD_OBSERVACAO";

export const updatePatrimonioRecebido = payload => ({
   type: UPDATE_PATRIMONIO_RECEBIDO,
   payload
});

export const filterParamPatrimonioRecebido = payload => ({
   type: FILTER_PARAM_PATRIMONIO_RECEBIDO,
   payload
});

export const delFilterParamPatrimonioRecebido = payload => ({
   type: DEL_FILTER_PARAM_PATRIMONIO_RECEBIDO,
   payload
});

export const clearFilterParamPatrimonioRecebido = payload => ({
   type: CLEAR_FILTER_PARAM_PATRIMONIO_RECEBIDO,
   payload
});

export const addPatrimonioRecebidoEnviar = payload => ({
   type: ADD_PATRIMONIO_RECEBIDO_ENVIAR,
   payload
});

export const delPatrimonioRecebidoEnviar = payload => ({
   type: DEL_PATRIMONIO_RECEBIDO_ENVIAR,
   payload
});

export const addDelPatrimonioRecebidoEnviar = payload => ({
   type: ADD_DEL_PATRIMONIO_RECEBIDO_ENVIAR,
   payload
});

export const envioPatrimonioAddStatusInicio = payload => ({
   type: ENVIO_PATRIMONIO_ADD_STATUS_INICIO,
   payload
});
 
export const envioPatrimonioAddStatusDestino = payload => ({
   type: ENVIO_PATRIMONIO_ADD_STATUS_DESTINO,
   payload
});

export const envioPatrimonioAddUsuarioDestino = payload => ({
   type: ENVIO_PATRIMONIO_ADD_USUARIO_DESTINO,
   payload
});

export const envioPatrimonioAddColetador = payload => ({
   type: ENVIO_PATRIMONIO_ADD_COLETADOR,
   payload
});

export const limparColetador = payload => ({
   type: LIMPAR_COLETADOR,
   payload
});

export const envioPatrimonioAddObservacao = payload => ({
   type: ENVIO_PATRIMONIO_ADD_OBSERVACAO,
   payload
});
