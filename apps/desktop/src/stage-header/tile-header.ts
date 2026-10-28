/* @layer renderer-app @kind logic */
import { layerChips, layerCrumb } from './layer-parts';
import { HEADER_TEXT } from './stage-header.constants';
import type { HeaderActions, HeaderChip, HeaderInput, HeaderModel } from './stage-header.type';

const tileChip = (key: number | null, uses: number): HeaderChip => ({
  id: 'tile-uses',
  text: key === null ? HEADER_TEXT.tilePick : HEADER_TEXT.tileEditing(key, uses),
  tone: 'warning',
});

const tileHeader = (input: HeaderInput, actions: HeaderActions): HeaderModel => {
  const { tile, sprite } = input;
  if (!tile) return { crumbs: [], chips: [], actions: [] };
  const layer = sprite ? layerCrumb(sprite, actions) : null;
  return {
    crumbs: [
      { id: 'back', label: HEADER_TEXT.backToMap, icon: 'arrow-left', title: HEADER_TEXT.backToMapTitle, run: actions.placeTiles },
      { id: 'tile', label: HEADER_TEXT.tile(tile.key), icon: 'pixel-tileset', current: layer === null },
      ...(layer ? [layer] : []),
    ],
    chips: [tileChip(tile.key, tile.uses), ...(sprite ? layerChips(sprite, actions, input.readOnly) : [])],
    actions: [],
  };
};

export { tileHeader };
