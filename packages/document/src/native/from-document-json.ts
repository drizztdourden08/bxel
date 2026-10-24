/* @layer core @kind logic */
import type { Sprite } from '../model/sprite.type';
import type { Tilemap } from '../model/tilemap.type';
import type { BuiltArtwork } from './built-artwork.type';
import type { DocumentJson } from './document-json.type';
import type { EntryCheck } from './entry-check.type';
import type { DamagedCel, DamagedMapLayer } from './load-report.type';
import { restoreSprite } from './restore-sprite';
import { restoreTilemap } from './restore-tilemap';

const fromDocumentJson = (document: DocumentJson, source: EntryCheck): BuiltArtwork => {
  const sprites: Sprite[] = [];
  const damage: DamagedCel[] = [];
  for (const shell of document.sprites) {
    const bank = document.banks.find((item) => item.id === shell.bankId);
    if (!bank) continue;
    const restored = restoreSprite(shell, bank, source);
    sprites.push(restored.sprite);
    damage.push(...restored.damage);
  }
  const tilemaps: Tilemap[] = [];
  const mapDamage: DamagedMapLayer[] = [];
  for (const shell of document.tilemaps) {
    const tileset = document.tilesets.find((item) => item.id === shell.tilesetId);
    if (!tileset) continue;
    const restored = restoreTilemap(shell, tileset, source);
    tilemaps.push(restored.tilemap);
    mapDamage.push(...restored.damage);
  }
  const artwork = {
    id: document.id,
    name: document.name,
    defaultBankId: document.defaultBankId,
    coverSpriteId: document.coverSpriteId,
    banks: document.banks,
    sprites,
    sheets: document.sheets,
    presets: document.presets,
    tilesets: document.tilesets,
    tilemaps,
  };
  return { artwork, damage, mapDamage };
};

export { fromDocumentJson };
