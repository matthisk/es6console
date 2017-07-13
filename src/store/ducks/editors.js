import * as actionTypes from 'store/actionTypes';

import { loadPersistedState } from 'store/middleware/localStorage';

let initialState = {
  'es6': {
    errors: [],
    code: loadPersistedState('ide', 'editors', 'es6', 'code') || '',
    display: true,
  },
  'es5': {
    errors: [],
    code: loadPersistedState('ide', 'editors', 'es6', 'code') || '',
    display: false,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case actionTypes.LOAD_SUCCESS:
    return {
      ...state,
      'es6': {
        ...state['es6'],
        code: action.payload,
      }
    };

  case actionTypes.UPDATE_CODE:
    return {
      ...state,
      [action.editor]: {
        ...state[action.editor],
        code: action.payload.code,
      },
    };

  case actionTypes.TOGGLE_EDITOR_DISPLAY:
    return {
      ...state,
      [action.payload]: {
        ...state[action.payload],
        display: !state[action.payload].display,
      }
    };

  default:
    return state;
  }
}