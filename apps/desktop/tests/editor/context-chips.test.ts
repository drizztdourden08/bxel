/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { currentTarget } from '../../src/editor/current-target';
import type { EditorTarget } from '../../src/editor/editor.type';
import { updateLayerFlag } from '../../src/editor/update-layer-flag';
import { PIXEL_ICON_SIZE, PIXEL_ICONS } from '../../src/icons/pixel-icon.constants';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { scopeChipList } from '../../src/views/ScopeBar/behavior/scope-chip-list';

const live = (): EditorTarget => {
  const target = currentTarget();
  if (!target) throw new Error('the store holds no document');
  return target;
};

const layerChip = () => {
  const chip = scopeChipList(live()).find((each) => each.key === 'layer');
  if (!chip) throw new Error('no layer chip');
  return chip;
};

beforeEach(() => {
  useToolStore.setState({ ...TOOL_DEFAULTS });
  createDefaultArtwork(useDocumentStore.getState().host);
});

describe('the scope chips of the scope bar', () => {
  it('lists the sprite, layer and frame chips in order', () => {
    expect(scopeChipList(live()).map((chip) => chip.key)).toEqual(['sprite', 'layer', 'frame']);
  });

  it('keeps the layer chip short and neutral for a normal layer', () => {
    expect(layerChip()).toEqual({ key: 'layer', text: 'Layer: Layer 1', full: 'Layer: Layer 1', locked: false, danger: false });
  });

  it('shows a locked layer with the icon flag, the same short text and the full text for the hint', () => {
    updateLayerFlag(live().layerId, 'locked', true);
    expect(layerChip()).toEqual({ key: 'layer', text: 'Layer: Layer 1', full: 'Layer: Layer 1 (locked)', locked: true, danger: true });
  });

  it('keeps the word for a hidden layer and uses the danger tone', () => {
    updateLayerFlag(live().layerId, 'visible', false);
    expect(layerChip()).toEqual({
      key: 'layer', text: 'Layer: Layer 1 (hidden)', full: 'Layer: Layer 1 (hidden)', locked: false, danger: true,
    });
  });

  it('gives the other chips the same text for the chip and the hint', () => {
    const others = scopeChipList(live()).filter((chip) => chip.key !== 'layer');
    expect(others.every((chip) => chip.text === chip.full && !chip.locked && !chip.danger)).toBe(true);
  });
});

describe('the lock icon', () => {
  it('is a 16 by 16 bitmap with ink', () => {
    const rows = PIXEL_ICONS.lock;
    expect(rows).toHaveLength(PIXEL_ICON_SIZE);
    expect(rows.every((row) => row.length === PIXEL_ICON_SIZE && /^[.#+]+$/.test(row))).toBe(true);
    expect(rows.join('')).toContain('#');
  });
});
