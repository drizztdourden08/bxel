/* @layer renderer-app @kind logic */
import type { KeyboardEvent } from 'react';
import { announce } from '@drizztdourden08/brock-react';
import { currentTarget } from '../../../editor/current-target';
import { pressCell } from '../../../editor/press-cell';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from '../../../editor/tools.constants';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import type { KeyContext } from './canvas-tools.type';

const pressKey = (event: KeyboardEvent<HTMLElement>, context: KeyContext): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const { width, height } = target.sprite;
  const at = useReadoutStore.getState().pointer ?? { x: Math.floor(width / 2), y: Math.floor(height / 2) };
  useReadoutStore.getState().setPointer(at);
  context.active.current = true;
  const button = event.key === 'Enter' ? SECONDARY_BUTTON : PRIMARY_BUTTON;
  const press = { button, altKey: false, shiftKey: event.shiftKey, ctrlKey: event.ctrlKey };
  announce(pressCell(at, press, context.anchor));
  context.viewport.current?.redraw();
  return true;
};

export { pressKey };
