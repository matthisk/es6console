import * as actionTypes from 'store/actionTypes';

import Compilers from 'compilers';

export function getSelectedCompiler(compilers) {
  for (let key of Object.keys(compilers)) {
    if (compilers[key].selected) {
      return key;
    }
  }
}

const initialState = (() => {
  const result = {};
  const keys = Object.keys(Compilers);

  for (let key of keys) {
    result[key] = {
      loading: false,
      initialized: false,
      selected: false,
    };
  }

  return result;
})();
export default function reducer(state = initialState, action) {
  switch(action.type) {
  case actionTypes.LOADED_COMPILER:
    return {
      ...state,
      [action.payload]: {
        loading: false,
        initialized: true,
      },
    };

  case actionTypes.SELECT_COMPILER:
    return {
      ...state,
      [action.payload]: {
        selected: true,
        loading: true,
        initialized: false,
      },
    };

  default:
    return state;
  }
}