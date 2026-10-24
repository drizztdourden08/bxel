/* @layer renderer-app @kind component */
import { Checkbox } from '@drizztdourden08/tessera';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { ActionHint } from '../../ActionHint';
import { FILLED_MAP_HINT, TILE_BAR_TEXT } from './TileBar.constants';

const MapFilledOption = () => {
  const filled = useTilemapStore((state) => state.filled);
  const setFilled = useTilemapStore((state) => state.setFilled);
  return (
    <ActionHint hint={FILLED_MAP_HINT}>
      <Checkbox size="sm" label={TILE_BAR_TEXT.filled} checked={filled} onChange={setFilled} />
    </ActionHint>
  );
};

export { MapFilledOption };
