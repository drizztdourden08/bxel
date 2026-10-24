/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import { baseName } from './base-name';
import { buildRenamePlan } from './build-rename-plan';
import type { RenamePlan } from './manager.type';
import { normalizeFolder } from './normalize-folder';

const planFolder = (folder: string, targets: readonly Sprite[], others: readonly string[]): RenamePlan => {
  const path = normalizeFolder(folder);
  const finals = targets.map((sprite) => (path === '' ? baseName(sprite.name) : `${path}/${baseName(sprite.name)}`));
  return buildRenamePlan(targets, finals, others);
};

export { planFolder };
