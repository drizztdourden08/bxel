/* @layer renderer-app @kind logic */
import type { CSSProperties } from 'react';
import { FILL_PERCENT } from './tag-look.constants';

const tagLook = (hex: string): CSSProperties =>
  ({ '--tag-line': hex, '--tag-fill': `color-mix(in srgb, ${hex} ${FILL_PERCENT}%, transparent)` }) as CSSProperties;

export { tagLook };
