/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { SHEET_COMMAND } from '../../../keymap/sheet-command-id.constants';
import { useCommandKeys } from '../../ActionHint';
import { modeItems } from './mode-items';
import { useModeModel } from './useModeModel';

const useModeItems = (): ToolbarItem[] => {
  const bar = useModeModel();
  const keys = {
    sprite: useCommandKeys(SHEET_COMMAND.modeSprite)[0],
    sheet: useCommandKeys(SHEET_COMMAND.modeSheet)[0],
    tilemap: useCommandKeys(SHEET_COMMAND.modeTilemap)[0],
  };
  return modeItems(bar, keys);
};

export { useModeItems };
