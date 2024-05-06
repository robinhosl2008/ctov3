import { SET_ROUTE_NAME, TROCAR_FILTRO } from "./actions";
import { combineReducers } from "redux";
import { stat } from "react-native-fs";


const initialRouteState = {
    routeName: 'Central Técnica Onbus'
};


export default function routeReducer(state = initialRouteState,action){
    switch(action.type){
        case SET_ROUTE_NAME:
            return {
                ...state,
                newValue: action.newValue
            };
        default:
            return state;
        }
}

const checkingInitialState = {
    defaultRouteBoolean:[true, false],
}

export function checkingReducer(state = checkingInitialState,action){
    switch(action.type){
        case TROCAR_FILTRO:
            

            
    }
}
        
        
    