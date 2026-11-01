/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import { currentManager } from '../../sheet-manager/current-manager';
import type { CurrentManager } from '../../sheet-manager/manager.type';
import type { Args } from './direct-commands.type';
import { NO_MANAGER } from './manager-direct.constants';
import { spriteTargets } from './sprite-targets';

const withTargets = (args: Args, run: (manager: CurrentManager, sprites: readonly Sprite[]) => string | null): string | null => {
  const manager = currentManager();
  if (manager === null) return NO_MANAGER;
  const wanted = Array.isArray(args.sprites) ? (args.sprites as string[]) : undefined;
  const found = spriteTargets(manager.artwork, wanted, manager.ids);
  return found.ok ? run(manager, found.sprites) : found.problem;
};

export { withTargets };
