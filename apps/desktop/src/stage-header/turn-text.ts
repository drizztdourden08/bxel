/* @layer renderer-app @kind logic */
import type { CellFlags } from '@bxel/document';

const turnText = (flags: CellFlags): string | null => {
  const parts = [flags.flipX ? 'X' : '', flags.flipY ? 'Y' : '', flags.diagonal ? 'Diagonal' : ''].filter(Boolean);
  return parts.length === 0 ? null : parts.join(' ');
};

export { turnText };
