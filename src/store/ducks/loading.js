import { CALL_API } from 'redux-api-middleware';
import * as actionTypes from 'store/actionTypes';

import {
    loadSnippet,
} from 'store/ide';

import {
    loadExamples
} from 'store/examples';

import {
    loadThemes
} from 'store/themes';

function getTypeIfObject(typeOrObject) {
  if (typeof typeOrObject === 'object') {
    return typeOrObject.type;
  }

  return typeOrObject;
}

const loadingTypes = [
  loadSnippet('')[CALL_API].types.map(getTypeIfObject),
  loadExamples()[CALL_API].types.map(getTypeIfObject),
  loadThemes()[CALL_API].types.map(getTypeIfObject),
];

const initialState = 0;
export default function reducer(state = initialState, action) {
  for (let [start, finish, failure] of loadingTypes) {
    switch (action.type) {
    case start:
      return state + 1;
    case finish:
      return state - 1;
    case failure:
      return state - 1;
    }
  }

  return state;
}