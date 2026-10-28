/* @layer renderer-app @kind logic */
import { busy } from '../sheet/busy';
import { clearSpriteSelection } from '../sheet/clear-selection';
import type { PickHow } from '../sheet/sheet.type';
import { useManagerStore } from '../stores/useManagerStore';
import { nextPicks } from './next-picks';

const pickAnimation = (order: readonly string[], key: string, how: PickHow): void => {
  if (busy()) return;
  const { picked, patch } = useManagerStore.getState();
  if (how !== 'toggle') clearSpriteSelection();
  patch({ picked: nextPicks(order, picked, key, how) });
};

export { pickAnimation };
