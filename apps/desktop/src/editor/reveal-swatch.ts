/* @layer renderer-app @kind logic */
import type { SwatchArgs } from '../context-menu/menu-args.type';
import { swatchRef } from './swatch-ref';

const revealSwatch = (args: Partial<SwatchArgs>): void => {
  const index = swatchRef(args);
  const found = index === null ? null : document.querySelector<HTMLElement>(`[data-swatch-index="${index}"]`);
  found?.scrollIntoView({ block: 'nearest' });
  found?.focus();
};

export { revealSwatch };
