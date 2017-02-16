import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as actionCreators from 'store/ide'

import CodeMirrorInstance from 'codemirror'
import CodeMirror from 'react-codemirror'
import * as util from './utils'

import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/comment/continuecomment'

import './Editor.scss'
import './theme.scss'

const GUTTER_ID = "compiler-markers";
const KEYS = CodeMirrorInstance.keyNames;

class _Editor extends Component {

    /**
     * CONSTRUCTOR
     */
    
    constructor(...args) {
        super(...args);

        this.markers = [];
    }

    /**
     * GETTERS SETTERS
     */

    get editor() {
        return this.refs['editor'].getCodeMirror();
    }

    /**
     * LIFE CYCLE METHODS
     */

    componentDidMount() {
        setTimeout(() => {
            this.editor.refresh();
        }, 0);
    }

    componentDidUpdate(prevProps, prevState) {
        this.clearErrorMarkers();
        this.setErrorMarkers(this.props.errors);
    }

    /**
     * EVENT HANDLERS
     */

    onChange(...args) {
        this.props.updateCode(this.props.name, ...args);

        if (this.props.onChange) {
            this.props.onChange(...args);
        }
    }

    /**
     * METHODS
     */
    
    clearErrorMarkers() {
        this.editor.clearGutter(GUTTER_ID);
        this.markers.forEach(marker => marker.clear());
        this.markers = [];
    }

    setErrorMarkers(errors = []) {
        errors.forEach(error => this.setErrorMarker( error ));
    }

    setErrorMarker(error) {
        var loc = error.loc;

        if (!loc) {
            throw new Error(['Trying to set an error marker for',
                             'an error marker that has no loc prop']
                            .join(' '));
        }
        
        this.editor.setGutterMarker(error.loc.line - 1,
                                    GUTTER_ID,
                                    util.makeMarker(error.message));

        var offset;
        if (typeof loc.offset !== 'function') { 
            offset = {
                line: loc.line,
            };
        } else {
            offset = error.loc.offset();
        }

        var mark = this.editor.markText({
            line: loc.line-1,
            ch:loc.column
        },
        {
            line: offset.line-1,
            ch:isNaN(offset.column) ? null : offset.column
        },
        {
            className: 'compiler-error-mark'
        });

        this.markers.push(mark);
    }

    /**
     * RENDER METHOD
     */

    render() {
        let {
            runCode,
            transformCode,
        } = this.props;

        let options = {
            ...this.props.options,
            mode: 'javascript',
            viewportMargin : Infinity,
            gutters : [GUTTER_ID,'CodeMirror-linenumbers'],
            extraKeys: {
                'Cmd-Enter': cm => runCode(),
                'Cmd-B': cm => transformCode(),
            }
        };

        return (
            <CodeMirror
                ref='editor'
                value={this.props.code} 
                options={options}
                className={this.props.errors.length <= 0 ?
                           "no-errors" :
                           ""}
                onChange={this.onChange.bind(this)}
                codeMirrorInstance={CodeMirrorInstance}
                />
        );
    }
}

function mapStateToProps(state, ownProps) {
    const editorName = ownProps.name;
    const editors = state.ide.editors;

    if (! Object.prototype.hasOwnProperty.call(editors, editorName)) {
        throw new Error(`Unexpected editor name ${editorName}`);
    }

    return {
        ...editors[editorName],
        options: state.ide.editorConfig,
    };
}

const Editor = connect(mapStateToProps, actionCreators)(_Editor);

export default Editor;