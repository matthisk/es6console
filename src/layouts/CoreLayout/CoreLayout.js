import React, { Component } from 'react'
import { connect } from 'react-redux'
import className from 'classnames'

import * as actionCreators from 'store/ide'
import * as exampleActionCreators from 'store/examples'

import compilers from 'compilers'
import Menu from 'components/Menu'
import Header from 'components/Header'
import Loading from 'components/Loading'
import './CoreLayout.scss'
import 'styles/core.scss'

import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon'


export const _Examples = ({
    examples,
    selected,
    showExample,
}) => (
    <div className='sidebar-dos'>
        { Object.keys(examples).map(group =>
            <Menu key={group} title={group}>
                { examples[group].map(example => 
                    <Menu.Item key={example} 
                               icon='code'
                               active={example === selected}
                               onClick={showExample.bind(null, group, example)}>
                        { example }
                    </Menu.Item>
                ) }
            </Menu>
        )}
    </div>
)

function mapStateToProps2(state) {
    return {
        examples: state.examples.available,
        selected: state.examples.selected,
    };
}

const Examples = connect(mapStateToProps2, exampleActionCreators)(_Examples);

export const _Toolbar = ({
    selectedCompiler, 
    compilers,
    editors,
    babelPresets,
    selectCompiler,
    transformCode,
    runCode,
    saveSnippet,
    toggleBabelPreset,
}) => (
    <div className='sidebar-dos'>
        <Menu title="Commands">
            <Menu.Item icon='save' 
                       shortcut='&#8984;+S'
                       onClick={saveSnippet.bind(null,
                                                 editors['es6'].code)
                   }>
                save code
            </Menu.Item>
            <Menu.Item icon='chevron circle right'
                       shortcut='&#8984;+Enter'
                       onClick={e => runCode()}>
                run
            </Menu.Item>
            <Menu.Item icon='refresh' 
                       shortcut='&#8984;+B'
                       onClick={transformCode}>
                transform
            </Menu.Item>
        </Menu>

        <Menu title="Compiler">
            { Object.keys(compilers).map(key => (
                <Menu.Item key={key}
                           icon='sort content ascending'
                           loading={compilers[ key ].loading}
                           shortcut=''
                           onClick={selectCompiler.bind(null, key)}
                           active={selectedCompiler == key}>
                    { key }
                </Menu.Item>    
                ))
            }
        </Menu>

        { selectedCompiler == 'Babel (6)' ?
        <Menu title="Presets" 
              helpHref="http://babeljs.io/docs/plugins/#presets">
            { Object.keys(babelPresets).map(key => 
                <Menu.Item key={key}
                           icon={
                                babelPresets[key].checked ?
                                'toggle on' :
                                'toggle off'
                            }
                           onClick={toggleBabelPreset.bind(null, key)}
                           >
                    { key }
                </Menu.Item>
            )}
        </Menu> : null
        }
    </div>
)


function mapStateToProps(state, ownProps) {
    return state.ide;
}

const Toolbar = connect(mapStateToProps, actionCreators)(_Toolbar);


class CoreLayout extends Component {
    state = {
        selected: 'toolbar',
    };

    componentDidMount() {
        let {
            id = null,
        } = this.props.params;

        if (id) {
            console.log("Load snippet", id);
            this.props.loadSnippet(id);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.params.id !== nextProps.params.id && nextProps.params.id) {
            this.props.loadSnippet(nextProps.params.id);
        }
    }

    render() {
        let { 
            children,
            loading,
        } = this.props;

        return (
// Start JSX 
<div className='core-layout__viewport'>
    <Loading visible={loading > 0} />

    <Header />
    <nav>    
        <div className='sidebar-uno'>
            <div className={className({
                    'button-round': true,
                    'active': this.state.selected == 'toolbar',
                })}
                 onClick={() => this.setState({
                    selected: 'toolbar'
                })}>
                <Icon name='code' />
            </div>
            <div className={className({
                    'button-round': true,
                    'active': this.state.selected == 'examples',
                })}
                 onClick={() => this.setState({ 
                    selected: 'examples'
                })}>
                <Icon name='book' />
            </div>

            <a className='sidebar-uno__bottom' href="//github.com/matthisk/es6console">
                <div className='button-round'>
                    <Icon name='github' />
                </div>
            </a>
        </div>
        { this.state.selected == 'toolbar' ?
          <Toolbar /> :
          null
        }
        { this.state.selected == 'examples' ?
          <Examples /> :
          null
        }
    </nav>
    <div className='content'>
        { children }
    </div>
</div>
        );
    }
}

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default connect(state => ({ loading: state.loading }), actionCreators)(CoreLayout)
