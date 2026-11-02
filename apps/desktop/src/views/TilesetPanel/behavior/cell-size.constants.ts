/* @layer renderer-app @kind constants */
import type { VirtualSize } from '@drizztdourden08/tessera';
import { SIZE_STEPS } from '../../../size-steps/size-steps.constants';

const CELL_STEPS: readonly { readonly token: VirtualSize; readonly px: number }[] = [
  { token: 'size-24', px: 24 },
  { token: 'size-28', px: 28 },
  { token: 'size-32', px: 32 },
  { token: 'size-40', px: 40 },
  ...SIZE_STEPS,
];

const CELL_LARGEST = 256;

export { CELL_LARGEST, CELL_STEPS };
