/* @layer renderer-app @kind component */
import { Box, Pressable } from '@drizztdourden08/tessera';
import { TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import type { TerrainSlotProps } from '../TilesetPanel.type';
import { SlotGlyph } from './SlotGlyph';
import { TileThumb } from './TileThumb';

const TerrainSlot = ({ index, mask, cell, artwork, onPick }: TerrainSlotProps) => (
  <Pressable
    type="button"
    className="tileset-panel__slot"
    aria-label={TERRAIN_TEXT.slot(index, cell?.tile.key ?? 0)}
    title={TERRAIN_TEXT.slot(index, cell?.tile.key ?? 0)}
    onClick={() => onPick(index)}
  >
    <SlotGlyph mask={mask} />
    {cell ? <TileThumb artwork={artwork} sprite={cell.sprite} /> : <Box className="tileset-panel__slot-empty" aria-hidden="true" />}
  </Pressable>
);

export { TerrainSlot };
