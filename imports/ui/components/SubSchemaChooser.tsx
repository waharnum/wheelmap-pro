import * as React from 'react';
import connectField from 'uniforms/connectField';
import * as CheckboxTree from 'react-checkbox-tree';
import styled from 'styled-components';
import SimplSchema from 'simpl-schema';
import {IStyledComponent} from './IStyledComponent';
import {colors} from '../stylesheets/colors';

type CheckBoxTreeNode = {
  value: string,
  label: React.ReactNode,
  children?: Array<CheckBoxTreeNode>,
  className?: string,
  disabled?: boolean,
  icon?: React.ReactNode,
}
const nodes: Array<CheckBoxTreeNode> = [{
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

const isDefinitionTypeArray = (types: any[]): boolean => {
  // Check whether we need to handle multiple definitions
  if (types[0] && types[0].type === Array) {
    return true;
  }

  return false;
};

const deriveTreeFromSchema = (schema: SimplSchema, prefix: string = ''): Array<CheckBoxTreeNode> => {
  const nodeNames: Array<string> = schema.objectKeys(prefix);

  if (!nodeNames) {
    console.log('Could not find nodes for', prefix);
    return [];
  }

  let valuePrefix = '';
  if (prefix.length > 0) {
    valuePrefix = `${prefix}.`;
  }

  const nodes = nodeNames.map((name) => {
    const definitionKey = `${valuePrefix}${name}`;
    const definition = schema.getDefinition(definitionKey);
    const label = schema.label(definitionKey);

    let childSearchKey = definitionKey;
    if (isDefinitionTypeArray(definition.type)) {
      return {
        value: definitionKey,
        label: (<span>{label} <span className="field-duration">2s</span></span>),
        children: deriveTreeFromSchema(schema, childSearchKey + '.$'),
        className: 'array-node',
      };
    }
    else {
      return {
        value: definitionKey,
        label: (<span>{label} <span className="field-duration">2s</span></span>),
        children: deriveTreeFromSchema(schema, childSearchKey),
      };
    }
  });
  return nodes;
};

type Props = {
  onChange: (value: Array<string> | null) => void,
  value: Array<string>,
  schema: SimplSchema,
} & IStyledComponent;

class SubSchemaChooser extends React.Component<Props> {
  public state = {
    checked: [],
    expanded: ['properties', 'properties.accessibility'],
  };

  public render() {
    const nodes = deriveTreeFromSchema(this.props.schema);
    console.log(nodes);

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
    display: flex;
    flex-grow: 1;
  }
  .rct-title {
    flex-grow: 1;
  
    &>span {  
      width: 100%;
      display: flex;
      justify-content: space-between;
       
      .field-duration {
        color: #ccc;
        margin-left: 20px;
      }
    }
  }
  
  .rct-node-icon {
    color: #ccc;
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
      content: ''
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
