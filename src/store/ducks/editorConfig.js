import * as actionTypes from 'store/actionTypes'

import { loadPersistedState} from 'store/middleware/localStorage'

let initialState = loadPersistedState('ide', 'editorConfig') || {
    lineWrapping: true,
    matchBrackets: true,
    lineNumbers: true,
    continueComments: true,
    indentUnit: 2,
    theme : "default",
};

if (initialState.theme !== 'default') {
    var ss = document.createElement("link");
    ss.type = "text/css";
    ss.rel = "stylesheet";
    ss.href = `${S3_SERVER_HOST}codemirror/theme/${initialState.theme}.css`;
    document.getElementsByTagName("head")[0].appendChild(ss);
}

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case actionTypes.UPDATE_EDITOR_CONFIG:
            return {
                ...state,
                [action.payload.key]: action.payload.value,
            };

        default:
            return state;
    }
}

