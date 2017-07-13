import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeView.scss';

import * as actionCreators from 'store/ide';

import className from 'classnames';

import Editor from 'components/Editor';

import Console from 'components/Console';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';


class _REPLConsole extends Component {

  render() {
    let {
            display,
            toggleConsoleDisplay,
        } = this.props;

    let cn = className({
      'ide__console': true,
      'collapsed': !display,
    });

    return (
            <div className={cn}>
                <div className='ide__console-title'
                    onClick={toggleConsoleDisplay}>
                    <span>Console</span>
                    {!display ?
                        <Icon name='chevron up' /> :
                        <Icon name='chevron down' />
                    }
                </div>

                <Console />
            </div>
    );
  }
}

function mapStateToProps2(state) {
  return state.ide.console;
}

const REPLConsole = connect(mapStateToProps2, actionCreators)(_REPLConsole);

class _IDEViewPort extends Component {
  columnStyle() {
    return {
      flex: this.props['es5'].display ? '1' : '0 0 25px',
    };
  }

  render() {
    return (
            <div className='ide__viewport'>
                <div className='ide__column'>
                    <div className='ide__column-gutter'>
                        <div className='title'>
                            <span>ES6</span>
                        </div>
                    </div>
                    <Editor name='es6'
                        onChange={this.props.transformOnType} />
                </div>

                <div className='ide__column'
                    style={this.columnStyle()}>
                    <div className='ide__column-gutter second'
                        onClick={this.props.toggleEditorDisplay.bind(null, 'es5')}>
                        <div className='title'>
                            <span>ES5</span>
                        </div>
                    </div>
                    <Editor name='es5' />
                </div>
            </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return state.ide.editors;
}

const IDEViewPort = connect(mapStateToProps, actionCreators)(_IDEViewPort);

export const HomeView = () => (
    <div className='ide'>
        <IDEViewPort />

        <REPLConsole />
    </div>
);

export default HomeView;