import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

import className from 'classnames'
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon'

import './Toolbar.scss'

const Toolbar = ({ children, right = false }) => (
    <ul className={className({
        "toolbar": true,
        "right": right,
    })}>
        { children }
    </ul>
);

const DropDown = ({ 
    children, 
    open = false,
    onMouseDown,
    onMouseUp,
}) => (
    <div className={className({
        "dropdown": true,
        "open": open 
    })}
         onMouseDown={onMouseDown}
         onMouseUp={onMouseUp}>
        <div className="dropdown__wrapper">
            { children }
        </div>
    </div>
);

const Item = ({ icon, children, onClick }) => (
    <li onClick={onClick}>
        <Icon name={icon} />
        &nbsp;
        { children }
    </li>
);

class DropDownItem extends Component {
    state = {
        open: false,
    };

    componentDidMount() {
        this.mouseDown = this.mouseDown.bind(this);

        document.addEventListener("click", this.mouseDown, false);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.mouseDown, false);
    }

    onToggle(event) {
        this.setState({
            open: ! this.state.open,
        });
    }

    mouseDown(event) {
        if(findDOMNode(this).contains(event.target)) {
            return;
        }

        this.setState({
            open: false
        });
    }

    render() {
        let {
            icon,
            children,
            title,
        } = this.props;

        let {
            open,
        } = this.state;

        return <li>
            <a onClick={this.onToggle.bind(this)}>
                <Icon name={icon} />
                &nbsp;
                { title }
            </a>
            <DropDown open={open}>
                { children }
            </DropDown>
        </li>;
    }
}

Toolbar.Item = Item;
Toolbar.DropDownItem = DropDownItem;

export default Toolbar;