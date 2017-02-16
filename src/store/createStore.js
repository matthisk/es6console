import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { apiMiddleware } from 'redux-api-middleware'
import createLogger from 'redux-logger'
import { browserHistory } from 'react-router'
import makeRootReducer from './reducers'
import { updateLocation } from './location'
import localStorage from './middleware/localStorage'

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk, apiMiddleware, localStorage];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [];

  let composeEnhancers = compose

  if (__DEV__) {
    const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    if (typeof composeWithDevToolsExtension === 'function') {
      composeEnhancers = composeWithDevToolsExtension
    }
  }

  if (__DEV__) {
    const logger = createLogger();
    middleware.push(logger);
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = {}

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store))

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}