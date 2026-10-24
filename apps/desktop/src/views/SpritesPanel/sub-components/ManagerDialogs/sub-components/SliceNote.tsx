/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import { COMPOSE_TEXT } from '../../../../../sheet-manager/compose-text.constants';
import type { SliceNoteProps } from '../ComposeDialogs.type';

const SliceNote = ({ plan }: SliceNoteProps) => (
  <>
    {plan.grid !== null && (
      <Text tone="dim">{COMPOSE_TEXT.sliceCount(plan.grid.columns * plan.grid.rows, plan.grid.cellWidth, plan.grid.cellHeight)}</Text>
    )}
    {plan.leftOut > 0 && <Text tone="dim">{COMPOSE_TEXT.sliceEdge(plan.leftOut)}</Text>}
  </>
);

export { SliceNote };
