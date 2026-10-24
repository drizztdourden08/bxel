/* @layer renderer-app @kind component */
import { ButtonGroup, Flex, Tag } from '@drizztdourden08/tessera';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { flagsLabel } from '../behavior/flags-label';
import { FlagButton } from './FlagButton';
import { FLAG_ACTIONS, TILE_BAR_TEXT } from './TileBar.constants';

const MapFlagOptions = () => {
  const flags = useTilemapStore((state) => state.flags);
  return (
    <Flex gap="xs" align="center">
      <ButtonGroup aria-label={TILE_BAR_TEXT.flags}>
        {FLAG_ACTIONS.map((action) => (
          <FlagButton key={action.op} action={action} on={flags[action.flag]} />
        ))}
      </ButtonGroup>
      <Tag>{`${TILE_BAR_TEXT.turn}: ${flagsLabel(flags)}`}</Tag>
    </Flex>
  );
};

export { MapFlagOptions };
