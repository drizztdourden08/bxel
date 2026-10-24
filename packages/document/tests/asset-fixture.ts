/* @layer core @kind test */
import type { AssetSlice, ExportPreset, PaletteBank, PresetId, Sprite, SpriteId } from '@bxel/document';
import { ASSET_KIND } from '@bxel/document';
import { brand, fixtureToArtwork } from './fixture-to-artwork';
import { heartPairFixture } from './heart-pair-fixture';

const assetPreview = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 9, 8, 7]);
const assetClock = (): number => Date.UTC(2026, 9, 24, 9, 30, 0);
const PALETTE_PATH = '../palettes/bxel-16.bxpalette';

const artwork = fixtureToArtwork(heartPairFixture);

const heartBank = (): PaletteBank => {
  const [bank] = artwork.banks;
  if (!bank) throw new Error('The fixture has a bank.');
  return bank;
};

const heartSprite = (): Sprite => {
  const sprite = artwork.sprites.find((item) => item.id === 'spr_000010');
  if (!sprite) throw new Error('The fixture has the heart.');
  return { ...sprite, platformId: 'game-boy', platformStrict: true };
};

const heartPreset = (): ExportPreset => ({
  id: brand<PresetId>('exp_000050'),
  name: 'Heart at 4x',
  format: 'png',
  scale: 4,
  scope: { sprites: [brand<SpriteId>('spr_000010')], layers: { by: 'all' }, frames: { by: 'all' } },
  sheetId: null,
  pathTemplate: '{sprite}-{frame}.png',
  settings: {},
});

const spriteSlice = (links: AssetSlice['links'] = [{ id: 'bnk_000002', path: PALETTE_PATH }]): AssetSlice => ({
  kind: ASSET_KIND.sprite,
  id: 'spr_000010',
  name: 'heart',
  artwork: { banks: [heartBank()], sprites: [heartSprite()], presets: [heartPreset()] },
  links,
});

const paletteSlice = (): AssetSlice => ({
  kind: ASSET_KIND.palette,
  id: 'bnk_000002',
  name: heartBank().name,
  artwork: { banks: [heartBank()] },
  links: [],
});

export { assetClock, assetPreview, heartBank, heartSprite, PALETTE_PATH, paletteSlice, spriteSlice };
