import * as React from 'react';
import connectField from 'uniforms/connectField';
import * as CheckboxTree from 'react-checkbox-tree';
import styled from 'styled-components';
import SimplSchema from 'simpl-schema';
import {IStyledComponent} from './IStyledComponent';
import {colors} from '../stylesheets/colors';
import {t} from 'c-3po';
import {debounce, union, flatten} from 'lodash';
import {isDefinitionTypeArray} from '../../both/lib/simpl-schema-filter';

type CheckBoxTreeNode = {
  value: string,
  searchText: string,
  label: React.ReactNode,
  children?: Array<CheckBoxTreeNode>,
  className?: string,
  disabled?: boolean,
  icon?: React.ReactNode,
}

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
        searchText: label.toLowerCase(),
        label: (
          <span className="array-node">
            <span className="tree-label">{label}</span>
            <span className="field-duration">2s</span>
          </span>
        ),
        children: deriveTreeFromSchema(schema, childSearchKey + '.$'),
      };
    }
    else {
      const children = deriveTreeFromSchema(schema, childSearchKey);
      return {
        value: definitionKey,
        searchText: label.toLowerCase(),
        label: (
          <span className={children && children.length > 0 ? 'object-node' : ''}>
            <span className="tree-label">{label}</span>
            <span className="field-duration">2s</span>
          </span>
        ),
        children,
      };
    }
  });
  return nodes;
};

type Props = {
  onChange?: (value: Array<string> | null) => void,
  name?: string,
  value?: Array<string>,
  schema: SimplSchema,
  expanded?: Array<string>,
} & IStyledComponent;

type State = {
  nodes: Array<CheckBoxTreeNode>,
  checked: Array<string>,
  expanded: Array<string>,
};

class SubSchemaChooser extends React.Component<Props, State> {
  public state: State = {
    nodes: [],
    checked: [],
    expanded: [],
  };

  private filterField: HTMLInputElement | null;

  constructor(props: Props) {
    super(props);
    this.state.nodes = deriveTreeFromSchema(props.schema);
    this.state.expanded = props.expanded || [];
    this.state.checked = props.value || [];
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.schema != nextProps.schema) {
      this.setState({nodes: deriveTreeFromSchema(nextProps.schema)});
    }
    this.setState({checked: nextProps.value || []});
  }

  public render() {
    return (
      <section className={this.props.className}>
        <input className="form-control"
               ref={(ref) => this.filterField = ref}
               type="text"
               placeholder={t`Filter`}
               onChange={this.onFilterChanged}/>
        <CheckboxTree
          nodes={this.state.nodes}
          checked={this.state.checked}
          expanded={this.state.expanded}
          onCheck={(checked: Array<string>) => {
            if (this.props.onChange) {
              this.props.onChange(checked);
            }
          }}
          onExpand={(expanded: Array<string>) => this.setState({expanded})}
        />
      </section>
    );
  }

  onFilterChanged = debounce((event) => {
    if (!this.filterField) {
      return;
    }

    let exactHits: Array<string> = [];
    const needle = this.filterField.value.trim().toLowerCase();
    const markSelection = (node): boolean => {
      let foundChild = false;
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          foundChild = markSelection(node.children[i]) || foundChild;
        }
      }
      if (!needle || needle.length == 0) {
        delete node.className;
        return false;
      } else {
        const found = node.searchText.indexOf(needle) >= 0;
        if (found) {
          exactHits.push(node.value);
        }
        node.className = found ? 'tree-filter-found' :
          (foundChild ? 'tree-filter-found-child' : 'tree-filter-not-found');
        return found || foundChild;
      }
    };
    this.state.nodes.forEach(markSelection);
    // open up any found nodes
    this.state.expanded = union(flatten(exactHits.map(SubSchemaChooser.buildPathToObject)), this.state.expanded);
    // we have to force update as we are manipulating the state object directly
    this.forceUpdate();
  });

  /// takes an object path like 'foo.bar.baz' and returns an array with all the paths to the full object
  ///  e.g. ['foo', 'foo.bar']
  static buildPathToObject(key: string): Array<string> {
    if (!key) {
      return [];
    }
    const parts = key.split('.');
    let last = parts[0];
    let results = [last];
    for (let i = 1; i < parts.length - 1; i++) {
      last = last + '.' + parts[i];
      if (parts[i] != '$') {
        results.push(last);
      }
    }
    return results;
  }
};

const SubSchemaChooserField = connectField(SubSchemaChooser);

export default styled<Props>(SubSchemaChooserField) `
input.form-control {
  margin: 15px;
  width: calc(100% - 30px); 
}

.react-checkbox-tree {
  label {
    font-weight: normal;
    display: flex;
    flex-grow: 1;
  }
  
  .rct-node {
    transform: scale(1, 1);
    transition: transform 200ms ease, opacity 200ms ease;
    transform-origin: top center;
    opacity: 1;
   
    .rct-text {
      // Tried a better height transitions, but really un-smooth. Reduced steps and added delay.
      // animating height still sucks
      transition: height 150ms steps(5);
      transition-delay: 50ms;
      height: 24px;
      overflow: hidden;
    }
  
    &.tree-filter-found > .rct-text {
    }
    &.tree-filter-found-child > .rct-text {      
      opacity: 0.5;
      label {
        pointer-events: none;
        cursor: unset;
      }
    }
    &.tree-filter-not-found {
      transform: scale(1, 0);
      opacity: 0;
      
      &> .rct-text {
        height: 0px;
      }
    }
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
  
  .rct-node-parent {
    .object-node .tree-label::after {      
      content: '…';
      color: #888;
    }
    
    .array-node .tree-label::after {      
      content: ' [ ]';
      color: #888;
      font-size: 0.8em;
      position: relative;
      bottom: 1px;
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
