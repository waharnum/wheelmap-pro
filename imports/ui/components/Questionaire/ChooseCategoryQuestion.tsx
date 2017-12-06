import {t} from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import connectField from 'uniforms/connectField';
import {set} from 'lodash';

import {IStyledComponent} from '../IStyledComponent';
import {IAsyncDataProps, reactiveSubscription} from '../reactiveModelSubscription';
import {wrapDataComponent} from '../AsyncDataComponent';
import {IOrganization} from '../../../both/api/organizations/organizations';
import {Categories, ICategory} from '../../../both/api/categories/categories';
import {getUserLanguages} from '../../../../client/i18n';


type Props = {
  onChange: (value: string | null) => void,
  value: string;
  inputRef?: (ref: HTMLElement | null) => void,
} & IAsyncDataProps<ICategory[]>;

type State = {
  categoryTree: Array<Array<ICategory>>,
  selectedCategories: Array<ICategory>,
};


// gets the translations for a given category using the browser language
const getCategoryTranslation = (cat: ICategory): string => {
  for (const lang of getUserLanguages()) {
    if (cat.translations._id[lang]) {
      return cat.translations._id[lang];
    }
  }
  return cat._id;
};

// returns true when a category has a specific parent
const hasSameParent = (parentCategoryIdToCheck: string) => {
  return (cat: ICategory): boolean => {
    return !!(cat.parentIds && cat.parentIds.length > 0 && cat.parentIds.includes(parentCategoryIdToCheck));
  };
};

// returns true for a root category (one that has no parents, or just one null parent)
const isRoot = (cat: ICategory): boolean => {
  return !cat.parentIds || cat.parentIds.length === 0 || !cat.parentIds[0];
};

const CategoryChooserQuestion = class extends React.Component<IStyledComponent & Props, State> {
  state: State = {
    categoryTree: [],
    selectedCategories: [],
  };

  public componentWillMount() {
    this.modelChanged(this.props);
  }

  public componentDidMount() {
    this.fireInputRef();
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.modelChanged(nextProps);
  }

  public render() {
    let treeLevel = 0;
    return (
      <section>
        {this.state.categoryTree.map((level) => {
          const currentLevel = treeLevel++;
          const currentSelected = this.state.selectedCategories[currentLevel];
          const itemSelected = this.itemSelected.bind(this, currentLevel);
          return (
            <span key={currentLevel}
                  className="selectWrapper">
              <select className="form-control"
                      ref={`select-${currentLevel}`}
                      name="selectCategory"
                      value={currentSelected ? currentSelected._id : ''}
                      onChange={itemSelected}>
                <option value="" disabled>{t`Please select`}</option>
                {
                  level.map((category) => {
                    return (
                      <option key={category._id}
                              value={category._id}>
                        {getCategoryTranslation(category)}
                      </option>
                    );
                  })
                }
              </select>
            </span>
          );
        })}
      </section>
    );
  }

  itemSelected = (currentLevel, event) => {
    const selectedCategoryId = event.target.value;
    const childCategories = this.props.model.filter(hasSameParent(selectedCategoryId));

    // append next level to tree, make sure to remove old level
    const categoryTree = childCategories.length > 0 ?
      set(this.state.categoryTree.slice(0, currentLevel + 1), [currentLevel + 1], childCategories) :
      this.state.categoryTree.slice(0, currentLevel + 1);

    // update selection stack
    const selectedCategories = set(
      this.state.selectedCategories.slice(0, currentLevel), [currentLevel], selectedCategoryId);

    // set values on state
    this.setState({
      selectedCategories,
      categoryTree,
    }, this.fireInputRef);

    if (this.props.onChange) {
      this.props.onChange(selectedCategoryId);
    }
  };

  fireInputRef = () => {
    const treeSize = this.state.categoryTree.length - 1;
    if (this.refs && this.refs[`select-${treeSize}`] && this.state.categoryTree[treeSize].length > 0) {
      const mainSelectField = this.refs[`select-${treeSize}`] as HTMLSelectElement;
      if (this.props.inputRef) {
        this.props.inputRef(mainSelectField);
      }
    }
  };

  modelChanged(props: Props) {
    const categoryTree: Array<Array<ICategory>> = [];
    const selectedCategories: Array<ICategory> = [];
    if (props.value) {
      // find category in list
      const foundCategory = props.model.find((cat) => cat._id === props.value);
      if (foundCategory) {
        let parentCategory: ICategory | undefined = foundCategory;
        selectedCategories.unshift(foundCategory);
        while (parentCategory && parentCategory.parentIds && parentCategory.parentIds.length > 0 && parentCategory.parentIds[0]) {
          const parentId = parentCategory.parentIds[0];
          parentCategory = props.model.find((cat) => cat._id === parentId);
          if (parentCategory) {
            categoryTree.unshift(props.model.filter(hasSameParent(parentId)));
            selectedCategories.unshift(parentCategory);
          }
        }
      }
    }

    categoryTree.unshift(props.model.filter(isRoot));

    this.setState({
      selectedCategories,
      categoryTree,
    }, this.fireInputRef);
  }
};

const CategoryChooserQuestionField = connectField(CategoryChooserQuestion);

const ReactiveCategoryChooserQuestionField = reactiveSubscription(
  wrapDataComponent<ICategory[], Props & IAsyncDataProps<ICategory[] | null>,
    Props & IAsyncDataProps<IOrganization[]>>(CategoryChooserQuestionField),
  () => Categories.find({}, {fields: {parentIds: 1, translations: 1}}).fetch(),
  'categories.public');

export default styled(ReactiveCategoryChooserQuestionField) `
`;
