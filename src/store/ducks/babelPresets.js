import { loadPersistedState} from 'store/middleware/localStorage'

import * as actionTypes from 'store/actionTypes'

let initialState = loadPersistedState('ide', 'babelPresets') || {
    'es2015': { checked: true },
    'es2016': { checked: false },
    'es2017': { checked: false },
    'react': { checked: false },
    'stage-0': { checked: false },
    'stage-1': { checked: false },
    'stage-2': { checked: false },
    'stage-3': { checked: false },
};

export default function reducer(state = initialState, action) {
    switch(action.type) {

        case actionTypes.TOGGLE_COMPILER_PRESET:
            return {
                ...state,
                [action.payload] : {
                    checked: ! state[action.payload].checked,
                },
            };

        default:
            return state;
    }
}

