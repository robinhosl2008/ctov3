const UPDATE_CHECKING             = "UPDATE_CHECKING";
const FILTER_PARAM_CHECKING       = "FILTER_PARAM_CHECKING";
const DEL_FILTER_PARAM_CHECKING   = "DEL_FILTER_PARAM_CHECKING";

export const updateChecking = payload => ({
   type: UPDATE_CHECKING,
   payload
});

export const filterParamChecking = payload => ({
   type: FILTER_PARAM_CHECKING,
   payload
});

export const delFilterParamChecking = payload => ({
   type: DEL_FILTER_PARAM_CHECKING,
   payload
});
