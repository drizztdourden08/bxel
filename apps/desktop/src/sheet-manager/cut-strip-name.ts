/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';

const cutStripName = (typed: string, target: Sprite | null): string => (typed.trim() === '' ? (target?.name ?? '') : typed.trim());

export { cutStripName };
