import * as actionTypes from 'store/actionTypes';

const initialState = {
  display: false,
  logBuffer: [],
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
  case actionTypes.TOGGLE_CONSOLE_DISPLAY:
    return {
      ...state,
      display: !state.display,
    };

  case actionTypes.FLUSH_BUFFER:
    return {
      ...state,
      logBuffer: [],
    };

  case actionTypes.FLUSH_RESULT:
    return {
      ...state,
      in: null,
      out: null,
    };

  default:
    return state;
  }
}
