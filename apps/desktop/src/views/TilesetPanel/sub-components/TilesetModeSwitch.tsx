/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { MODE_OPTIONS, TILESET_TEXT } from '../TilesetPanel.constants';

const TilesetModeSwitch = () => {
  const mode = useTilesetViewStore((state) => state.mode);
  const setMode = useTilesetViewStore((state) => state.setMode);
  return <SegmentedControl size="sm" aria-label={TILESET_TEXT.mode} value={mode} options={[...MODE_OPTIONS]} onChange={setMode} />;
};

export { TilesetModeSwitch };
