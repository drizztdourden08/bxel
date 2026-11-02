/* @layer renderer-app @kind component */
import { Box, Pressable, Text } from '@drizztdourden08/tessera';
import { slotMask } from '@bxel/document';
import { useRef } from 'react';
import { useTerrainSlotDrop } from '../../../tile-drag/useTerrainSlotDrop';
import { maskWords } from '../../../tilemap/terrain/mask-words';
import { TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import type { TerrainSlotProps } from '../behavior/terrain-panel.type';
import { SlotGlyph } from './SlotGlyph';
import { TileThumb } from './TileThumb';

const TerrainSlot = ({ index, set, cell, view, selected, onPick }: TerrainSlotProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  useTerrainSlotDrop(ref, { slot: index, set: set.id });
  const variants = set.slots[index] ?? [];
  const mask = slotMask(set.kind, index);
  const label = TERRAIN_TEXT.slot(index, maskWords(mask), variants.length);
  return (
    <Pressable
      ref={ref}
      type="button"
      className="tileset-panel__slot"
      aria-label={label}
      title={label}
      aria-pressed={selected}
      data-terrain-slot={index}
      data-terrain-set={set.id}
      data-missing={variants.length === 0 ? '' : undefined}
      onClick={() => onPick(index)}
    >
      <SlotGlyph mask={mask} big />
      {cell ? <TileThumb view={view} cell={cell} /> : <Box className="tileset-panel__slot-empty" aria-hidden="true" />}
      {variants.length > 1 ? (
        <Text as="span" variant="caption" className="tileset-panel__variants" aria-hidden="true">
          {variants.length}
        </Text>
      ) : null}
    </Pressable>
  );
};

export { TerrainSlot };
