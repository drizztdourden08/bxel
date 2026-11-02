/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { useToolStore } from '../../stores/useToolStore';
import { currentSurface } from '../tool-catalogue/current-surface';
import { labelOfTool } from '../tool-catalogue/label-of-tool';
import { useSpringStore } from './behavior/useSpringStore';
import { springKeyHeld } from './spring-key-held';
import { springKeyTool } from './spring-key-tool';
import { springKeyUp } from './spring-key-up';
import { SPRING_KEY_NOTICE, SPRING_PASSIVE_KEYS } from './spring-keys.constants';
import { strokeActive } from './stroke-active';

const springKeyDown = (event: Pick<KeyboardEvent, 'key' | 'repeat'>): void => {
  if (event.repeat || SPRING_PASSIVE_KEYS.includes(event.key)) return;
  const current = useToolStore.getState().tool;
  const tool = springKeyTool(event.key, current);
  if (tool === null) {
    if (springKeyHeld.key !== event.key) springKeyUp();
    return;
  }
  if (useSpringStore.getState().borrowed !== null || strokeActive()) return;
  springKeyHeld.key = event.key;
  useSpringStore.getState().borrow(current, tool);
  announce(SPRING_KEY_NOTICE(labelOfTool(currentSurface(), tool)));
};

export { springKeyDown };
