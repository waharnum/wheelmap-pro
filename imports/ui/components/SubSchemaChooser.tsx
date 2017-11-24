import * as React from 'react';
import connectField from 'uniforms/connectField';
import * as CheckboxTree from 'react-checkbox-tree';
import styled from 'styled-components';
import {IStyledComponent} from './IStyledComponent';
import {colors} from '../stylesheets/colors';

const nodes = [{
  value: 'mars',
  label: 'Mars',
  children: [
    {
      value: 'phobos', label: 'Phobos',
      children: [
        {value: 'phobos2', label: 'Phobos2'},
        {value: 'deimos2', label: 'Deimos2'},
      ],
    },
    {value: 'deimos', label: 'Deimos'},
  ],
}];

type Props = {
  onChange: (value: Array<string> | null) => void,
  value: Array<string>,
  schema: any /*SimplSchema*/,
} & IStyledComponent;

class SubSchemaChooser extends React.Component<Props> {
  public state = {
    checked: [],
    expanded: [],
  };

  public render() {
    console.log(this.props.schema);

    return (
      <section className={this.props.className}>
        <CheckboxTree
          nodes={nodes}
          checked={this.state.checked}
          expanded={this.state.expanded}
          onCheck={checked => this.setState({checked})}
          onExpand={expanded => this.setState({expanded})}
        />
      </section>
    );
  }
};

const SubSchemaChooserField = connectField(SubSchemaChooser);

export default styled(SubSchemaChooserField) `
.react-checkbox-tree {
  label {
    font-weight: normal;
  }
    
  .rct-icon {
    font-family: 'iconfield-v03';
  }
  .rct-icon-expand-close::before {
    content: 'Î'
  }
  .rct-icon-expand-open::before {
    content: 'Í'
  }
  .rct-icon-uncheck::before {
    content: 'C'
  }
  .rct-icon-half-check::before {
    content: 'o'
  }
  .rct-icon-check::before {
    content: 'c'
  }
  .rct-node-icon {
    .rct-icon-leaf::before {
      content: ''
    }
    //display: none;
    .rct-icon-parent-close::before {
      content: 'f'
    }
    .rct-icon-parent-open::before {
      content: 'F'
    }
  }
}
`;
