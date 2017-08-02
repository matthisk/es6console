import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import * as actionCreators from 'store/ide';

import JSConsole from './jsconsole';

import './Console.scss';

const CTRL_KEY = 'Ctrl';
const HELP_TEXT = [
  '`Welcome to the interactive ES6 console',
  ' :help  -  Show this help text',
  '',
  ' Console commands:',
  ' Up & Down  -  Navigate command history',
  ' Enter      -  Execute code',
  ` ${CTRL_KEY}-L     -  Clear console`,
  ` ${CTRL_KEY}-C     -  Cancel current command`,
  ` ${CTRL_KEY}-S     -  Save snippet\``,

].join('\n');

class _Console extends Component {
  componentDidMount() {
    let node = findDOMNode(this.refs['console-viewport']);

    this.jsconsole = new JSConsole(node, {
      mode: 'javascript',
      theme: 'default',
      evaluate: async (consoleCode) => this.props.runCode(this.props.es5code, consoleCode),
      commands: {
        'help': function() {
          this.print(HELP_TEXT);
        },
      }
    });

    setTimeout(() => {
      this.jsconsole.input.refresh();
      this.jsconsole.output.refresh();
    }, 0);

    this.jsconsole.print(HELP_TEXT);
  }

  componentDidUpdate(prevProps, prevState) {
    let buffer = this.props.logBuffer;

    if (buffer.length > 0) {
      let print = this.jsconsole.print.bind(this.jsconsole);

      buffer.forEach(l => print(l));

            // Remove these log items from the state
      this.props.flushBuffer();
    }

    if (this.props.out) {
      this.jsconsole.renderResult(this.props.in, this.props.out);
      this.props.flushResult();
    }

    this.jsconsole.output.refresh();
  }

  componentWillUnmount() {

  }

  focus(e) {
    if(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    this.jsconsole.input.focus();
  }

  render() {
    return (
            <div ref='console-viewport'
                 className='ide__console-console'
                 onClick={this.focus.bind(this)}>

            </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.ide.console,
    es5code: state.ide.editors.es5.code,
  };
}

export default connect(mapStateToProps, actionCreators)(_Console);