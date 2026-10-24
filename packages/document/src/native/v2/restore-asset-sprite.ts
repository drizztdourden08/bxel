/* @layer core @kind logic */
import type { PaletteBank } from '../../model/palette.type';
import type { SpriteJson } from '../document-json.type';
import type { EntryCheck } from '../entry-check.type';
import { restoreSprite } from '../restore-sprite';
import type { RestoredSprite } from '../restored-sprite.type';

const restoreAssetSprite = (shell: SpriteJson, bank: PaletteBank, check: EntryCheck): RestoredSprite => {
  const { sprite, damage } = restoreSprite(shell, bank, check);
  const platform = {
    ...(shell.platformId === undefined ? {} : { platformId: shell.platformId }),
    ...(typeof shell.platformStrict === 'boolean' ? { platformStrict: shell.platformStrict } : {}),
    ...(shell.pixelGrid === undefined ? {} : { pixelGrid: shell.pixelGrid }),
  };
  return { sprite: { ...sprite, ...platform }, damage };
};

export { restoreAssetSprite };
