/* @layer renderer-app @kind component */
import { Select } from '@drizztdourden08/tessera';
import type { ShapeSnap } from '../../../stores/tileset-view-store.type';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { SNAP_CHOICES } from '../behavior/shape-editor.constants';
import { TILESET_TEXT } from '../TilesetPanel.constants';

const ShapeSnapSelect = () => {
  const snap = useTilesetViewStore((state) => state.shapeSnap);
  const setSnap = useTilesetViewStore((state) => state.setShapeSnap);
  return <Select size="sm" aria-label={TILESET_TEXT.snap} options={[...SNAP_CHOICES]} value={snap} onChange={(value) => setSnap(value as ShapeSnap)} />;
};

export { ShapeSnapSelect };
