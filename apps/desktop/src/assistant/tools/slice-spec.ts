/* @layer renderer-app @kind logic */
import type { PlanOf } from '@bxel/mcp';
import { SLICE_START } from '../../sheet-manager/compose.constants';
import type { SliceSpec } from '../../sheet-manager/compose.type';
import { definedOnly } from './defined-only';

const sliceSpec = (args: PlanOf<'slice'>): SliceSpec => {
  const { sprites: _sprites, ...rest } = args;
  return { ...SLICE_START, ...definedOnly(rest) };
};

export { sliceSpec };
