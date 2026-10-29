/* @layer renderer-app @kind component */
import { slotMask } from '@bxel/document';
import { Flex, Stack, Text } from '@drizztdourden08/tessera';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { setTerrainSets } from '../../../tilemap/set-terrain-sets';
import { isTurned } from '../../../tilemap/terrain/is-turned';
import { maskWords } from '../../../tilemap/terrain/mask-words';
import { TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import { updateSlot } from '../../../tilemap/terrain/update-slot';
import type { SlotChange, SlotDetailProps } from '../behavior/terrain-panel.type';
import { SlotButtons } from './SlotButtons';
import { SlotGlyph } from './SlotGlyph';
import { VariantRow } from './VariantRow';

const SlotDetail = ({ model, sets, set }: SlotDetailProps) => {
  const slot = useTilesetViewStore((state) => state.terrainSlot);
  if (slot === null) {
    return (
      <Text variant="caption" tone="muted">
        {TERRAIN_TEXT.pickSlot}
      </Text>
    );
  }
  const variants = set.slots[slot] ?? [];
  const mask = slotMask(set.kind, slot);
  const save = (change: SlotChange): void => {
    setTerrainSets(sets.map((each) => (each.id === set.id ? updateSlot(set, slot, change) : each)));
  };
  return (
    <Stack gap="xs" role="group" aria-label={TERRAIN_TEXT.detail}>
      <Flex gap="xs" align="center">
        <SlotGlyph mask={mask} big />
        <Text variant="caption">{`Slot ${slot + 1}, ${maskWords(mask)}`}</Text>
      </Flex>
      {variants.map((variant) => (
        <VariantRow
          key={`${variant.key}-${isTurned(variant) ? 't' : 'p'}`}
          model={model}
          variant={variant}
          onChange={(weight) => save((list) => list.map((each) => (each === variant ? { ...each, weight } : each)))}
          onRemove={() => save((list) => list.filter((each) => each !== variant))}
        />
      ))}
      <SlotButtons variants={variants} picked={model.pickedKey} onSave={save} />
    </Stack>
  );
};

export { SlotDetail };
