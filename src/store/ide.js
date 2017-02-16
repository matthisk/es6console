import fetch from 'isomorphic-fetch'
import { CALL_API } from 'redux-api-middleware'

import Compilers from 'compilers'
import { sandbox } from 'sandbox'

import { locationChange } from 'store/location'
import { browserHistory } from 'react-router'

// ------------------------------------
// Action Types
// ------------------------------------
const RUN_CODE = 'ide/RUN_CODE';
const SELECT_COMPILER = 'ide/SELECT_COMPILER';
const LOADED_COMPILER = 'ide/LOADED_COMPILER';
const TRANSFORMED_CODE = 'ide/TRANSFORMED_CODE';
const TRANSFORM_ON_TYPE = 'ide/TRANSFORM_ON_TYPE';
const UPDATE_CODE = 'ide/UPDATE_CODE';
const TOGGLE_EDITOR_DISPLAY = 'ide/TOGGLE_EDITOR_DISPLAY';
const TOGGLE_CONSOLE_DISPLAY = 'ide/TOGGLE_CONSOLE_DISPLAY';
const FLUSH_BUFFER = 'ide/FLUSH_BUFFER';
const TOGGLE_COMPILER_PRESET = 'ide/TOGGLE_COMPILER_PRESET';
const UPDATE_EDITOR_CONFIG = 'ide/UPDATE_EDITOR_CONFIG';
const SAVE_SUCCESS = 'ide/SAVE_SUCCESS';
const SAVE_FAILURE = 'ide/SAVE_FAILURE';
const SAVE_REQUEST = 'ide/SAVE_REQUEST';
const LOAD_SUCCESS = 'ide/LOAD_SUCCESS';
const LOAD_FAILURE = 'ide/LOAD_FAILURE';
const LOAD_REQUEST = 'ide/LOAD_REQUEST';

// ------------------------------------
// Actions
// ------------------------------------
export function runCode(code) {
    return {
        type    : RUN_CODE,
        payload : code,
    };
}

export function selectCompiler(key) {
    if (! Object.prototype.hasOwnProperty.call(Compilers, key)) {
        throw new Error(`Unexpected compiler ${key}`);
    }

    return dispatch => {
        dispatch({
            type    : SELECT_COMPILER,
            payload : key,
        });

        Compilers[ key ].future.then(() => {
                dispatch({
                    type    : LOADED_COMPILER,
                    payload : key,
                });
            });

        Compilers[ key ].initCompiler();
    };
}

export function transformCode() {
    return {
        type    : TRANSFORMED_CODE,
    };
}

export function transformOnType() {
    return {
        type    : TRANSFORM_ON_TYPE,
    };
}

export function updateCode(editorName, code) {
    return {
        type    : UPDATE_CODE,
        editor  : editorName,
        payload : {
            code: code
        }
    }
}

export function toggleEditorDisplay(editorName) {
    return {
        type    : TOGGLE_EDITOR_DISPLAY,
        payload : editorName,
    };
}

export function toggleConsoleDisplay() {
    return {
        type : TOGGLE_CONSOLE_DISPLAY,
    };
}

export function flushBuffer() {
    return {
        type : FLUSH_BUFFER,
    }
}

export function toggleBabelPreset(key) {
    return dispatch => {
        dispatch({
            type    : TOGGLE_COMPILER_PRESET,
            payload : key,
        });

        dispatch(transformCode());
    };
}

export function updateEditorConfig(key, value) {
    if (key === "theme") {
        var ss = document.createElement("link");
        ss.type = "text/css";
        ss.rel = "stylesheet";
        ss.href = `/codemirror/themes/${value}.css`;
        document.getElementsByTagName("head")[0].appendChild(ss);
    }

    return {
        type    : UPDATE_EDITOR_CONFIG,
        payload : {
            key, value
        }
    };
}

export function loadSnippet(id) {
    return {
        [CALL_API]: {
            endpoint: `/api/snippet/${id}`,
            method: 'GET',
            types: [LOAD_REQUEST, LOAD_SUCCESS, LOAD_FAILURE],
        }
    };
}

export function saveSnippet(code) {
    let body = JSON.stringify({ code: code });

    return dispatch => {
        dispatch({
            [CALL_API]: {
                endpoint: '/api/snippet/save/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
                types: [SAVE_REQUEST,
                        {
                            type    : SAVE_SUCCESS,
                            payload : (action, state, res) => {
                                return res.json()
                                    .then(res => {
                                        browserHistory.push(`/${res.id}/`);
                                        return res;
                                    });
                            }
                        },
                        SAVE_FAILURE],
            }
        });
    }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    console: {
        display: false,
        logBuffer: [],
    },
    editors: {
        'es6': {
            errors: [],
            code: '',
            display: true,
        },
        'es5': {
            errors: [],
            code: '',
            display: false,
        },
    },
    editorConfig: {
        lineWrapping: true,
        matchBrackets: true,
        lineNumbers: true,
        continueComments: true,
        indentUnit: 2,
        theme : "default",
    },
    compilers: (() => {
        const result = {};
        const keys = Object.keys(Compilers);

        for (let key of keys) {
            result[key] = {
                loading: false,
                initialized: false,
            };
        }

        return result;
    })(),
    selectedCompiler: 'Babel (6)',
    babelPresets: {
        'es2015': { checked: true },
        'es2016': { checked: false },
        'es2017': { checked: false },
        'react': { checked: false },
        'stage-0': { checked: false },
        'stage-1': { checked: false },
        'stage-2': { checked: false },
        'stage-3': { checked: false },
    },
};

if (window.localStorage) {
    let oldState = localStorage.getItem('state', 'false');
    oldState = JSON.parse(oldState);
    oldState = oldState.ide;

    // Load several settings from the users previous
    // session
    if (oldState) {
        initialState.editors['es6'].code = oldState.editors['es6'].code;
        initialState.editors['es5'].code = oldState.editors['es5'].code;

        initialState.editorConfig = oldState.editorConfig;
        initialState.babelPresets = oldState.babelPresets;
        initialState.selectedCompiler = oldState.selectedCompiler;
    }
}

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case LOAD_SUCCESS:
            return {
                ...state,
                editors: {
                    ...state.editors,
                    'es6': {
                        ...state.editors['es6'],
                        code: action.payload.snippet,
                    }
                }
            };

        case LOADED_COMPILER:
            return {
                ...state,
                compilers: {
                    ...state.compilers,
                    [action.payload]: {
                        loading: false,
                        initialized: true,
                    },
                },
            };
        case UPDATE_CODE:
            return {
                ...state,
                editors: {
                    ...state.editors,
                    [action.editor]: {
                        ...state.editors[action.editor],
                        code: action.payload.code,
                    },
                },
            };
        case TOGGLE_EDITOR_DISPLAY:
            return {
                ...state,
                editors: {
                    ...state.editors,
                    [action.payload]: {
                        ...state.editors[action.payload],
                        display: ! state.editors[action.payload].display,
                    }
                }
            };
        case SELECT_COMPILER:
            return {
                ...state,
                selectedCompiler: action.payload,
                compilers: {
                    ...state.compilers,
                    [action.payload]: {
                        loading: true,
                        initialized: false,
                    },
                },
            };
        case TRANSFORMED_CODE:
            return reducers.transformCode(state, action);
        case TOGGLE_CONSOLE_DISPLAY:
            return {
                ...state,
                console: {
                    ...state.console,
                    display: ! state.console.display,
                }
            };
        case RUN_CODE:
            return reducers.runCode(state, action);
        case FLUSH_BUFFER:
            return {
                ...state,
                console: {
                    ...state.console,
                    logBuffer: [],
                }
            };
        case TOGGLE_COMPILER_PRESET:
            return {
                ...state,
                babelPresets: {
                    ...state.babelPresets,
                    [action.payload] : {
                        checked: ! state.babelPresets[action.payload].checked,
                    },
                }
            };
        case TRANSFORM_ON_TYPE:
            return reducers.transformOnType(state, action);
        case UPDATE_EDITOR_CONFIG:
            return {
                ...state,
                editorConfig: {
                    ...state.editorConfig,
                    [action.payload.key]: action.payload.value,
                }
            };
        default:
            return state;
    }
}

function transform(state, action) {
    let compiler = Compilers[ state.selectedCompiler ];

    if (! compiler) {
        throw new Error(`Unexpected compiler ${state.selectedCompiler}`);
    }

    let presets = Object.keys(state.babelPresets)
                        .map(p => [p, state.babelPresets[p].checked]);
    let options = {
        presets: presets.filter(([p, c]) => c)
                        .map(([p, c]) => p),
    };

    let code = compiler.compile( state.editors['es6'].code, options );
    
    if (code.errors.length == 0) {
        sandbox.updateUserCode(code.code, true);
    }

    return code;
}

const reducers = {
    transformCode(state, action) {
        let { errors = [], 
              code = '' } = transform(state, action);

        return {
            ...state,
            editors: {
                ...state.editors,
                'es6': {
                    ...state.editors['es6'],
                    errors: errors,
                },
                'es5': {
                    ...state.editors['es5'],
                    code: code,
                    display: true,
                },
            }
        }
    },

    transformOnType(state, action) {
        let { errors = [], 
              code = '' } = transform(state, action);

        return {
            ...state,
            editors: {
                ...state.editors,
                'es6': {
                    ...state.editors['es6'],
                    errors: errors,
                },
                'es5': {
                    ...state.editors['es5'],
                    code: code,
                },
            }
        }
    },

    runCode(state, action) {
        let out;

        if (action.payload) {
            out = sandbox.runCode(action.payload);
        } else {
            out = sandbox.runCode(state.editors['es6'].code);
        }

        return {
            ...state,
            console: {
                ...state.console,
                display: true,
                logBuffer: out.logBuffer,
            },
        };
    },
}