import React from 'react'
import './Menu.scss'

import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon'

const Menu = ({ children, title, helpHref = false }) => (
    <div>
        <div className='sidebar__header'>
            <span>{ title }</span>
            { helpHref ?
                <a href={helpHref}
                   className='sidebar__header-help'
                   target='_blank'>
                    help
                </a> :
                null
            }
        </div>
        <ul className='sidebar__menu'>
            { children }
        </ul>
    </div>
)

Menu.Item = ({ icon, children, shortcut, onClick, loading=false, active=false }) => (
    <li className={active ? 'active' : ''} onClick={onClick}>
        <div className='sidebar__menu-icon'><Icon name={icon}/></div>
        <div className='sidebar__menu-desc'>{ children }</div>
        <div className='sidebar__menu-shortcut'>
        {
            loading ? 
            <Icon name='refresh' loading /> :
            shortcut ? 
            shortcut :
            (active ?
            <Icon name='check' /> :
            null)
        }</div>
    </li>
);

export default Menu;