/* @layer renderer-app @kind constants */
import type { VirtualSize } from '@drizztdourden08/tessera';

const SIZE_STEPS: readonly { readonly token: VirtualSize; readonly px: number }[] = [
  { token: 'size-48', px: 48 },
  { token: 'size-56', px: 56 },
  { token: 'size-64', px: 64 },
  { token: 'size-80', px: 80 },
  { token: 'size-96', px: 96 },
  { token: 'size-128', px: 128 },
  { token: 'size-160', px: 160 },
  { token: 'size-192', px: 192 },
  { token: 'size-224', px: 224 },
  { token: 'size-256', px: 256 },
];

export { SIZE_STEPS };
