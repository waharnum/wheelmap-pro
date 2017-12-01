import {Categories} from '../categories';
import {publishFields} from '../../../../server/publish';

const CategoriesPublicFields = {
  icon: 1,
  translations: 1,
  synonyms: 1,
  parentIds: 1,
};

publishFields('categories.public', Categories, CategoriesPublicFields);
