/* @layer renderer-app @kind logic */
import type { TagCategoryColor } from '@drizztdourden08/tessera';
import { FALLBACK_CATEGORY, TAG_CATEGORIES } from './tag-category.constants';

const tagCategory = (colour: string): TagCategoryColor => TAG_CATEGORIES.find((category) => category === colour) ?? FALLBACK_CATEGORY;

export { tagCategory };
