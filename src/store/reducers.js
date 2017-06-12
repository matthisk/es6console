import { combineReducers } from 'redux'
import locationReducer from './location'
import ideReducer from './ide'
import examplesReducer from './examples'
import themeReducer from './themes'
import loadingReducer from './ducks/loading'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    ide: ideReducer,
    examples: examplesReducer,
    themes: themeReducer,
    loading: loadingReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer