export const SET_ROUTE_NAME = 'SET_ROUTE_NAME';
export const TROCAR_FILTRO = 'TROCAR_FILTRO';

export function setRouteName(name){
    return{
        type: SET_ROUTE_NAME,
        newValue: name
    }
}



