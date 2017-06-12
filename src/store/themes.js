import fetch from 'isomorphic-fetch'
import { CALL_API } from 'redux-api-middleware'

import { updateCode, transformCode } from 'store/ide'
import * as actionTypes from 'store/actionTypes'

// ------------------------------------
// Actions
// ------------------------------------
export function loadThemes() {
    return {
        [CALL_API]: {
            endpoint : `${API_SERVER_HOST}themes/`,
            method   : 'GET',
            types    : [actionTypes.THEMES_REQUEST,
                        actionTypes.THEMES_SUCCESS,
                        actionTypes.THEMES_FAILURE],
        }
    }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    available: [],
};
export default function reducer(state = initialState, action) {
    switch(action.type) {
        case actionTypes.THEMES_SUCCESS:
            return {
                ...state,
                available: action.payload.themes,
            };
        default:
            return state;
    }
}