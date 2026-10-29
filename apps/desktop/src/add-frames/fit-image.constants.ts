/* @layer renderer-app @kind constants */
import { FORM_BASE } from '../image-import/image-import.constants';
import type { ColorsForm } from '../image-import/image-import.type';

const EXACT: ColorsForm = { ...FORM_BASE, reduce: 'map', dither: 'none' };

export { EXACT };
