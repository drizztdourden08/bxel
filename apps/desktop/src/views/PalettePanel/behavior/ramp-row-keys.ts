/* @layer renderer-app @kind logic */
import type { Ramp } from '@bxel/document';
import type { KeyboardEvent } from 'react';
import type { PanelModel, RampReorder } from '../PalettePanel.type';
import { rampRowKeyDown } from './ramp-row-key-down';

const rampRowKeys = (panel: PanelModel, ramp: Ramp | null, reorder: RampReorder | undefined, position: number): ((event: KeyboardEvent<HTMLElement>) => void) | undefined => {
  if (!reorder || !ramp || panel.lock.locked) return undefined;
  return (event) => rampRowKeyDown(event, reorder, position);
};

export { rampRowKeys };
