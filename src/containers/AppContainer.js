import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'

import { DEFAULT_COMPILER } from 'compilers'
import {
  selectCompiler,
} from 'store/ide'
import { loadExamples } from 'store/examples'
import { loadThemes } from 'store/themes'

class AppContainer extends Component {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  }

  componentDidMount() {
    const compiler = this.props.store.getState().ide.selectedCompiler;
    const selectCompilerAction = selectCompiler(compiler);
    const loadExamplesAction = loadExamples();
    const loadThemesAction = loadThemes();

    this.props.store.dispatch(selectCompilerAction);
    this.props.store.dispatch(loadExamplesAction);
    this.props.store.dispatch(loadThemesAction);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { routes, store } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={browserHistory} children={routes} />
        </div>
      </Provider>
    )
  }
}

export default AppContainer
