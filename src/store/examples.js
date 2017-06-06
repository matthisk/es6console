import fetch from 'isomorphic-fetch'
import { CALL_API } from 'redux-api-middleware'

import { updateCode, transformCode } from 'store/ide'

import * as actionTypes from 'store/actionTypes' 

// ------------------------------------
// Actions
// ------------------------------------
export function loadExamples() {
    return {
        [CALL_API]: {
            endpoint : `${API_SERVER_HOST}api/examples/`,
            method   : 'GET',
            types    : [actionTypes.EXAMPLES_REQUEST,
                        actionTypes.EXAMPLES_SUCCESS,
                        actionTypes.EXAMPLES_FAILURE],
        }
    }
}

export function showExample(group, example) {
    return dispatch => {
        fetch(`${S3_SERVER_HOST}examples/${group}/${example}`)
            .then(res => res.text())
            .then(code => {
                dispatch({
                    type    : actionTypes.FETCH_EXAMPLE,
                    key     : example,
                    payload : code,
                });

                dispatch(updateCode('es6', code));

                dispatch(transformCode());
            });
    }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    available: {},
    examples: {},
    selected: null,
};
export default function reducer(state = initialState, action) {
    switch(action.type) {
        case actionTypes.EXAMPLES_SUCCESS:
            return {
                ...state,
                available: action.payload.examples,
            };
        case actionTypes.FETCH_EXAMPLE:
            return {
                ...state,
                selected: action.key,
                examples: {
                    ...state.examples,
                    [action.key]: action.payload,
                },
            };
        default:
            return state;
    }
}