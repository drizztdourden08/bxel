/* @layer renderer-app @kind constants */
import { REFERENCE_TEXT } from '../../../reference-image/reference-image.constants';

const PLACES = [
  { value: 'above', label: REFERENCE_TEXT.above },
  { value: 'below', label: REFERENCE_TEXT.below },
] as const;

export { PLACES };
