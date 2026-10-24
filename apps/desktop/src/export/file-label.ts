/* @layer renderer-app @kind logic */
import type { Target } from './export.type';
import { safeName } from './safe-name';

const fileLabel = (base: string, target: Target, targetCount: number, extra: string | null): string => {
  const parts = [base];
  if (targetCount > 1) parts.push(safeName(target.sprite.name));
  if (extra !== null) parts.push(extra);
  return parts.join('_');
};

export { fileLabel };
