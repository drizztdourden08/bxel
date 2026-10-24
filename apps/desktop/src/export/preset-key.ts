/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import type { PresetOwnerChoice } from './preset-entry.type';

const presetKey = (owner: PresetOwnerChoice, artwork: Artwork): AssetKey => {
  if ('sprite' in owner) return { kind: 'sprite', id: owner.sprite };
  if ('sheet' in owner) return { kind: 'sheet', id: owner.sheet };
  return { kind: 'project', id: artwork.id };
};

export { presetKey };
