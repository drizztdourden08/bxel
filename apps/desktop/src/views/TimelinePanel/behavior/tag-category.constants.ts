/* @layer renderer-app @kind data */
import type { TagCategoryColor } from '@drizztdourden08/tessera';

const TAG_CATEGORIES: readonly TagCategoryColor[] = ['rose', 'blue', 'amber', 'teal', 'violet', 'orange', 'lime', 'cyan', 'pink', 'green'];
const FALLBACK_CATEGORY: TagCategoryColor = 'blue';

export { FALLBACK_CATEGORY, TAG_CATEGORIES };
