/* @layer renderer-app @kind component */
import { Button, Flex } from '@drizztdourden08/tessera';
import { isTurned } from '../../../tilemap/terrain/is-turned';
import { TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import type { SlotButtonsProps } from '../behavior/terrain-panel.type';

const SlotButtons = ({ variants, picked, onSave }: SlotButtonsProps) => (
  <Flex gap="xs" wrap>
    <Button size="sm" variant="secondary" disabled={picked === null} title={picked === null ? TERRAIN_TEXT.noPick : undefined} onClick={() => picked !== null && onSave(() => [{ key: picked, weight: 1 }])}>
      {TERRAIN_TEXT.usePicked}
    </Button>
    <Button
      size="sm"
      variant="tertiary"
      disabled={picked === null}
      onClick={() => picked !== null && onSave((list) => (list.some((each) => each.key === picked && !isTurned(each)) ? list : [...list, { key: picked, weight: 1 }]))}
    >
      {TERRAIN_TEXT.addPicked}
    </Button>
    <Button size="sm" variant="tertiary" disabled={variants.length === 0} onClick={() => onSave(() => [])}>
      {TERRAIN_TEXT.clearSlot}
    </Button>
  </Flex>
);

export { SlotButtons };
