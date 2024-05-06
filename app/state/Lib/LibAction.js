const UPDATE_LIB_EQUIPAMENTO_STATUS             = "UPDATE_LIB_EQUIPAMENTO_STATUS";
const UPDATE_LIB_EM_ALERTA_ATUACAO              = "UPDATE_LIB_EM_ALERTA_ATUACAO";
const UPDATE_LIB_EQUIPAMENTO_MOTIVO_RETIRADA    = "UPDATE_LIB_EQUIPAMENTO_MOTIVO_RETIRADA";
const UPDATE_LIB_FILTRO_ATUACAO                 = "UPDATE_LIB_FILTRO_ATUACAO";

export const updateLibEquipamentoStatus = payload => ({
   type: UPDATE_LIB_EQUIPAMENTO_STATUS,
   payload
});
export const updateLibEmAlertaAtuacao = payload => ({
   type: UPDATE_LIB_EM_ALERTA_ATUACAO,
   payload
});
export const updateLibEquipamentoMotivoRetirada = payload => ({
   type: UPDATE_LIB_EQUIPAMENTO_MOTIVO_RETIRADA,
   payload
});
export const updateLibFiltroAtuacao = payload => ({
   type: UPDATE_LIB_FILTRO_ATUACAO,
   payload
});
