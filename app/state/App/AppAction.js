const APP_USER_AUTH                             = "APP_USER_AUTH";
const APP_MODAL_LOADING                         = "APP_MODAL_LOADING";

export const appModalLoading = payload => ({
    type: APP_MODAL_LOADING,
    payload
 });

 export const appUserAuth = payload => ({
    type: APP_USER_AUTH,
    payload
 });
 