import fetch from 'isomorphic-fetch'
import { CALL_API } from 'redux-api-middleware'

import { updateCode, transformCode } from 'store/ide'

// ------------------------------------
// Action Types
// ------------------------------------
const EXAMPLES_REQUEST = 'examples/EXAMPLES_REQUEST';
const EXAMPLES_SUCCESS = 'examples/EXAMPLES_SUCCESS';
const EXAMPLES_FAILURE = 'examples/EXAMPLES_FAILURE';
const FETCH_EXAMPLE = 'examples/FETCH_EXAMPLE';

// ------------------------------------
// Actions
// ------------------------------------
export function loadExamples() {
    return {
        [CALL_API]: {
            endpoint : '/api/examples/',
            method   : 'GET',
            types    : [EXAMPLES_REQUEST,
                        EXAMPLES_SUCCESS,
                        EXAMPLES_FAILURE],
        }
    }
}

export function showExample(group, example) {
    return dispatch => {
        fetch(`/examples/${group}/${example}`)
            .then(res => res.text())
            .then(code => {
                dispatch({
                    type    : FETCH_EXAMPLE,
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
        case EXAMPLES_SUCCESS:
            return {
                ...state,
                available: action.payload.examples,
            };
        case FETCH_EXAMPLE:
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