import React from 'react';
import { connect } from 'react-redux';
import { IndexLink, Link } from 'react-router';
import './Header.scss';

import * as actionCreators from 'store/ide';

import Select from 'react-select';
import Toolbar from 'components/Toolbar';

import 'react-select/dist/react-select.css';

export const Header = ({
    code,
    transformCode,
    runCode,
    editorConfig,
    updateEditorConfig,
    availableThemes,
    saveSnippet,
    onChangeSelect = (key, fn) => (({ value }) => fn(key, value)),
    onChange = (key, fn) => ((event) => fn(key, event.target.checked)),
}) => (
    <div className='header'>
        <a href="/" title="es6console.com">
            <img src="/logo.svg" 
                 alt="ES6console.com" 
                className='header__logo' />
        </a>

        <Toolbar>
            <Toolbar.Item icon="video play outline"
                          onClick={e => runCode()}>
                Run
            </Toolbar.Item>
            <Toolbar.Item icon="save"
                          onClick={saveSnippet.bind(null, code)}>
                Save
            </Toolbar.Item>
            <Toolbar.Item icon="refresh"
                          onClick={transformCode}>
                Transform
            </Toolbar.Item>
        </Toolbar>

        <Toolbar right={true}>
            <Toolbar.DropDownItem title="Settings" icon="setting">
                <p>
                    <label>
                        <input type="checkbox" 
                               checked={editorConfig.lineWrapping}
                               onChange={onChange('lineWrapping', updateEditorConfig)} />
                        Wrap long lines
                    </label>
                </p>

                <p>
                    <label>
                        <input type="checkbox" 
                               checked={editorConfig.lineNumbers}
                               onChange={onChange('lineNumbers', updateEditorConfig)} />
                        Show Line Numbers
                    </label>
                </p>

                <br/>

                <label>
                    Theme:
                </label>
                <Select name="theme"
                        searchable={true}
                        clearable={false}
                        value={editorConfig.theme}
                        onChange={onChangeSelect('theme', updateEditorConfig)}
                        options={availableThemes.map(t => ({
                          value: t,
                          label: t,
                        }))} />

                <br/>

                <label>
                    Indent unit:
                </label>
                <Select name="theme"
                        searchable={true}
                        clearable={false}
                        value={editorConfig.indentUnit}
                        onChange={onChangeSelect('indentUnit', updateEditorConfig)}
                        options={[{
                          value: 2,
                          label: '2 spaces',
                        },{
                          value: 3,
                          label: '3 spaces',
                        },{
                          value: 4,
                          label: '4 spaces',
                        }]} />
            </Toolbar.DropDownItem>
        </Toolbar>
    </div>
);

function mapStateToProps(state, ownProps) {
  return {
    editorConfig: state.ide.editorConfig,
    code: state.ide.editors['es6'].code,
    availableThemes: ['default'].concat(state.themes.available),
  };
}

export default connect(mapStateToProps, actionCreators)(Header);
