/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { PRESET_TEXT } from './preset-list.constants';
import type { PresetOwnerChoice } from './preset-entry.type';

const presetPlace = (owner: PresetOwnerChoice, artwork: Artwork): string => {
  if ('sprite' in owner) return PRESET_TEXT.inSprite(artwork.sprites.find((sprite) => sprite.id === owner.sprite)?.name ?? '');
  if ('sheet' in owner) return PRESET_TEXT.inSheet(artwork.sheets.find((sheet) => sheet.id === owner.sheet)?.name ?? '');
  return PRESET_TEXT.inProject;
};

export { presetPlace };
