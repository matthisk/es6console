import fetch from 'isomorphic-fetch'
import { CALL_API } from 'redux-api-middleware'

import { updateCode, transformCode } from 'store/ide'

// ------------------------------------
// Action Types
// ------------------------------------
const THEMES_REQUEST = 'examples/THEMES_REQUEST';
const THEMES_SUCCESS = 'examples/THEMES_SUCCESS';
const THEMES_FAILURE = 'examples/THEMES_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
export function loadThemes() {
    return {
        [CALL_API]: {
            endpoint : '/api/themes/',
            method   : 'GET',
            types    : [THEMES_REQUEST,
                        THEMES_SUCCESS,
                        THEMES_FAILURE],
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
        case THEMES_SUCCESS:
            return {
                ...state,
                available: action.payload.themes,
            };
        default:
            return state;
    }
}