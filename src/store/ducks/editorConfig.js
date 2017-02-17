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

