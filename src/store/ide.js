import { combineReducers } from 'redux'

import fetch from 'isomorphic-fetch'
import { CALL_API } from 'redux-api-middleware'

import Compilers, { getCompiler, DEFAULT_COMPILER } from 'compilers'
import { sandbox } from 'sandbox'

import { locationChange } from 'store/location'
import { browserHistory } from 'react-router'
import { loadPersistedState } from 'store/middleware/localStorage'

import * as actionTypes from './actionTypes'

import {
    babelPresetsReducer,
    compilersReducer,
    consoleReducer,
    editorConfigReducer,
    editorsReducer,
} from 'store/ducks'

// ------------------------------------
// Actions
// ------------------------------------
export function runCode(code) {
    return {
        type: actionTypes.RUN_CODE,
        payload: code,
    };
}

export function selectCompiler(key) {
    if (!Object.prototype.hasOwnProperty.call(Compilers, key)) {
        throw new Error(`Unexpected compiler ${key}`);
    }

    return dispatch => {
        dispatch({
            type: actionTypes.SELECT_COMPILER,
            payload: key,
        });

        Compilers[key].future.then(() => {
            dispatch({
                type: actionTypes.LOADED_COMPILER,
                payload: key,
            });
        });

        Compilers[key].initCompiler();
    };
}

export function transformCode() {
    return {
        type: actionTypes.TRANSFORMED_CODE,
    };
}

export function transformOnType() {
    return {
        type: actionTypes.TRANSFORM_ON_TYPE,
    };
}

export function updateCode(editorName, code) {
    return {
        type: actionTypes.UPDATE_CODE,
        editor: editorName,
        payload: {
            code: code
        }
    }
}

export function toggleEditorDisplay(editorName) {
    return {
        type: actionTypes.TOGGLE_EDITOR_DISPLAY,
        payload: editorName,
    };
}

export function toggleConsoleDisplay() {
    return {
        type: actionTypes.TOGGLE_CONSOLE_DISPLAY,
    };
}

export function flushBuffer() {
    return {
        type: actionTypes.FLUSH_BUFFER,
    }
}

export function toggleBabelPreset(key) {
    return dispatch => {
        dispatch({
            type: actionTypes.TOGGLE_COMPILER_PRESET,
            payload: key,
        });

        dispatch(transformCode());
    };
}

export function updateEditorConfig(key, value) {
    if (key === "theme") {
        var ss = document.createElement("link");
        ss.type = "text/css";
        ss.rel = "stylesheet";
        ss.href = `/codemirror/theme/${value}.css`;
        document.getElementsByTagName("head")[0].appendChild(ss);
    }

    return {
        type: actionTypes.UPDATE_EDITOR_CONFIG,
        payload: {
            key, value
        }
    };
}

export function loadSnippet(id) {
    return {
        [CALL_API]: {
            endpoint: `${API_SERVER_HOST}snippet/${id}/`,
            method: 'GET',
            types: [actionTypes.LOAD_REQUEST, 
                    actionTypes.LOAD_SUCCESS, 
                    actionTypes.LOAD_FAILURE],
        }
    };
}

export function saveSnippet(code) {
    let body = JSON.stringify({ code: code });

    return dispatch => {
        dispatch({
            [CALL_API]: {
                endpoint: `${API_SERVER_HOST}snippet/save/`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
                types: [actionTypes.SAVE_REQUEST,
                {
                    type: actionTypes.SAVE_SUCCESS,
                    payload: (action, state, res) => {
                        return res.json()
                            .then(res => {
                                browserHistory.push(`/${res.id}/`);
                                return res;
                            });
                    }
                },
                actionTypes.SAVE_FAILURE],
            }
        });
    }
}

// ------------------------------------
// Reducer
// ------------------------------------
let initialCompiler = loadPersistedState('selectedCompiler') || DEFAULT_COMPILER;
export function selectedCompilerReducer(state = initialCompiler, action) {
    switch (action.type) {
        case actionTypes.SELECT_COMPILER:
            return action.payload;
        default:
            return state;
    }
}

function transformReducer(state, action) {
    let compiler = getCompiler(state.selectedCompiler);

    if (!compiler) {
        throw new Error(`Unexpected compiler ${state.selectedCompiler}`);
    }

    let presets = Object.keys(state.babelPresets)
        .map(p => [p, state.babelPresets[p].checked]);
    let options = {
        presets: presets.filter(([p, c]) => c)
            .map(([p, c]) => p),
    };

    let code = compiler.compile(state.editors['es6'].code, options);

    if (code.errors.length == 0) {
        sandbox.updateUserCode(code.code, true);
    }

    return code;
}

function transformCodeReducer(state, action) {
    let { errors = [],
        code = '' } = transformReducer(state, action);

    let { editors } = state;

    return {
        ...editors,
        'es6': {
            ...editors['es6'],
            errors: errors,
        },
        'es5': {
            ...editors['es5'],
            code: code,
            display: true,
        },
    };
}

function transformOnTypeReducer(state, action) {
    let {
        errors = [],
        code = ''
    } = transformReducer(state, action);

    let { editors } = state;

    return {
        ...editors,
        'es6': {
            ...editors['es6'],
            errors: errors,
        },
        'es5': {
            ...editors['es5'],
            code: code,
        },
    }
}

function runCodeReducer(state, action) {
    let out;
    let { console } = state;

    if (action.payload) {
        out = sandbox.runCode(action.payload);
    } else {
        out = sandbox.runCode(state.editors['es6'].code);
    }

    return {
        ...console,
        display: true,
        completionValue: out.completionValue,
        logBuffer: out.logBuffer,
    };
}

const baseReducer = combineReducers({
    editors: editorsReducer,
    babelPresets: babelPresetsReducer,
    console: consoleReducer,
    editorConfig: editorConfigReducer,
    compilers: compilersReducer,
    selectedCompiler: selectedCompilerReducer,
});

export default function reducer(state, action) {
    state = baseReducer(state, action);

    switch (action.type) {
        case actionTypes.RUN_CODE:
            return {
                ...state,
                console: runCodeReducer(state, action)
            };

        case actionTypes.TRANSFORM_ON_TYPE:
            return {
                ...state,
                editors: transformOnTypeReducer(state, action),
            };

        case actionTypes.TRANSFORMED_CODE:
            return {
                ...state,
                editors: transformCodeReducer(state, action),
            };

        default:
            return state;
    }
}