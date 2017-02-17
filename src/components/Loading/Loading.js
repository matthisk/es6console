import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

import className from 'classnames'

import './semantic.scss'
import './Loading.scss'

export default class Loading extends Component {
    state = {
        'hidden': false,
    };

    componentDidMount() {
        let node = findDOMNode(this.refs['viewport']);

        node.addEventListener('transitionend', this.onHidden.bind(this));
    }

    componetWillUpdate(nextProps, nextState) {
        if (!this.props.visible && nextProps.visible) {
            this.setState({ hidden: false });
        }
    }

    onHidden(event) {
        this.setState({ hidden: ! this.props.visible });
    }

    render() {
        let {
            visible
        } = this.props;

        return (
            <div ref='viewport' className={className({
                "loading__viewport": true,
                "visible": visible,
                "hidden": this.state.hidden,
            })}>
                <div className="loading__viewport-wrapper">
                    <div className="ui loader large text">Loading</div>
                </div>
            </div>
        );
    }
}