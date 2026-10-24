/* @layer renderer-app @kind hook */
import type { SegmentOption } from '@drizztdourden08/tessera';
import { SHEET_COMMAND } from '../../../keymap/sheet-command-id.constants';
import type { SpriteMode } from '../../../stores/sprite-store.type';
import { segmentOption, useCommandKeys } from '../../ActionHint';
import type { HintedOption } from '../../ActionHint';

const useModeSegments = (options: readonly HintedOption<SpriteMode>[]): SegmentOption<SpriteMode>[] => {
  const keys = {
    sprite: useCommandKeys(SHEET_COMMAND.modeSprite)[0],
    sheet: useCommandKeys(SHEET_COMMAND.modeSheet)[0],
    tilemap: useCommandKeys(SHEET_COMMAND.modeTilemap)[0],
  };
  return options.map((each) => segmentOption(each, keys[each.value]));
};

export { useModeSegments };
