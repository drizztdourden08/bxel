/* @layer core @kind test */
import type { Artwork, AssetKey, ExportPreset } from '@bxel/document';
import { assetsTouched, ASSET_KIND, presetsOf, sliceAsset, splitIntoAssets } from '@bxel/document';
import { decodeSheet, decodeSprite, encodeSheet, encodeSprite } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { assetClock } from './asset-fixture';
import { heartEngine } from './heart-engine';
import { HEART, HEART_B, SHEET, apply, expectUndoRedo, plain, rejection } from './sheet-engine';

const SETTINGS = { kind: 'sprite', scale: 2 };

const add = (name: string, owner: unknown, extra: object = {}) => plain('preset.add', { name, owner, format: 'png', ...extra });

const presetNamed = (artwork: Artwork, name: string): ExportPreset => {
  const found = artwork.presets.find((preset) => preset.name === name);
  if (!found) throw new Error(`No preset ${name}.`);
  return found;
};

const keysOf = (keys: readonly AssetKey[]): string[] => keys.map((key) => `${key.kind}:${key.id}`);

describe('preset.add', () => {
  it('writes a sprite preset with the sprite as its owner, as one undo step', () => {
    const { engine } = heartEngine();
    const done = expectUndoRedo(engine, add('Web', { sprite: HEART }, { scale: 3, settings: SETTINGS }));
    expect(presetNamed(engine.state().artwork, 'Web')).toMatchObject({
      format: 'png',
      scale: 3,
      scope: { sprites: [HEART], layers: { by: 'all' }, frames: { by: 'all' } },
      sheetId: null,
      settings: SETTINGS,
    });
    expect(done.changes.presets).toHaveLength(1);
  });

  it('writes a sheet preset with the sheet and no sprite, and a project preset with neither', () => {
    const { engine } = heartEngine();
    apply(engine, add('Atlas', { sheet: SHEET }, { format: 'sheet' }), add('Everything', { project: true }));
    const { artwork } = engine.state();
    expect(presetNamed(artwork, 'Atlas')).toMatchObject({ sheetId: SHEET, scope: { sprites: [] }, format: 'sheet' });
    expect(presetNamed(artwork, 'Everything')).toMatchObject({ sheetId: null, scope: { sprites: [] }, scale: 1, pathTemplate: '{name}' });
  });

  it('reports the new preset by ref and lets a later step use it', () => {
    const { engine } = heartEngine();
    const done = apply(engine, { ...add('Web', { sprite: HEART }), ref: 'web' }, plain('preset.rename', { preset: { ref: 'web' }, name: 'Web 2x' }));
    expect(presetNamed(engine.state().artwork, 'Web 2x').id).toBe(done.created['web']);
  });

  it('may reuse a name for another owner, and refuses a taken or blank name for the same owner', () => {
    const { engine } = heartEngine();
    apply(engine, add('Web', { sprite: HEART }));
    apply(engine, add('web', { sprite: HEART_B }));
    expect(rejection(engine, add('WEB', { sprite: HEART })).code).toBe('NAME_TAKEN');
    expect(rejection(engine, add(' ', { sprite: HEART })).code).toBe('NAME_INVALID');
  });

  it('refuses an owner that does not exist', () => {
    const { engine } = heartEngine();
    expect(rejection(engine, add('Web', { sprite: 'spr_999999' })).code).toBe('TARGET_NOT_FOUND');
    expect(rejection(engine, add('Web', { sheet: 'sht_999999' })).code).toBe('TARGET_NOT_FOUND');
    expect(rejection(engine, add('Web', { sheet: { ref: 'nothing' } })).code).toBe('TARGET_NOT_FOUND');
  });
});

describe('preset.update, preset.rename and preset.delete', () => {
  it('replaces the settings and the scale and keeps the owner', () => {
    const { engine } = heartEngine();
    apply(engine, add('Web', { sprite: HEART }, { settings: SETTINGS }));
    const id = presetNamed(engine.state().artwork, 'Web').id;
    expectUndoRedo(engine, plain('preset.update', { preset: id, scale: 5, settings: { kind: 'frames' } }));
    expect(presetNamed(engine.state().artwork, 'Web')).toMatchObject({ scale: 5, settings: { kind: 'frames' }, scope: { sprites: [HEART] } });
  });

  it('refuses an update that changes nothing and a preset that is not there', () => {
    const { engine } = heartEngine();
    const id = presetNamed(engine.state().artwork, 'Hearts at 4x').id;
    expect(rejection(engine, plain('preset.update', { preset: id })).code).toBe('INVALID_OPTION');
    expect(rejection(engine, plain('preset.update', { preset: 'exp_999999', scale: 2 })).code).toBe('TARGET_NOT_FOUND');
  });

  it('renames a preset, keeps its place, and refuses a name another preset of its owner has', () => {
    const { engine } = heartEngine();
    apply(engine, add('One', { sprite: HEART }), add('Two', { sprite: HEART }));
    const one = presetNamed(engine.state().artwork, 'One').id;
    expectUndoRedo(engine, plain('preset.rename', { preset: one, name: ' Uno ' }));
    expect(engine.state().artwork.presets.map((preset) => preset.name)).toEqual(['Hearts at 4x', 'Uno', 'Two']);
    expect(rejection(engine, plain('preset.rename', { preset: one, name: 'two' })).code).toBe('NAME_TAKEN');
    apply(engine, plain('preset.rename', { preset: one, name: 'UNO' }));
    expect(presetNamed(engine.state().artwork, 'UNO').id).toBe(one);
  });

  it('deletes a preset as one undo step', () => {
    const { engine } = heartEngine();
    const id = presetNamed(engine.state().artwork, 'Hearts at 4x').id;
    expectUndoRedo(engine, plain('preset.delete', { preset: id }));
    expect(engine.state().artwork.presets).toEqual([]);
  });

  it('drops the presets of a deleted sprite and trims the ones that name several', () => {
    const { engine } = heartEngine();
    apply(engine, add('Web', { sprite: HEART_B }));
    apply(engine, { name: 'sprite.delete', targets: { sprites: [HEART_B], layers: { by: 'all' }, frames: { by: 'all' } }, options: {} });
    expect(engine.state().artwork.presets.map((preset) => [preset.name, preset.scope.sprites])).toEqual([['Hearts at 4x', [HEART]]]);
  });
});

describe('where a preset is saved', () => {
  it('routes a change to the sprite, the sheet or the project that owns the preset', () => {
    const { engine } = heartEngine();
    const before = engine.state().artwork;
    const sprite = apply(engine, add('S', { sprite: HEART }));
    expect(keysOf(assetsTouched(sprite.changes, before, engine.state().artwork))).toEqual([`sprite:${HEART}`]);
    const afterSprite = engine.state().artwork;
    const sheet = apply(engine, add('H', { sheet: SHEET }));
    expect(keysOf(assetsTouched(sheet.changes, afterSprite, engine.state().artwork))).toEqual([`sheet:${SHEET}`]);
    const afterSheet = engine.state().artwork;
    const project = apply(engine, add('P', { project: true }));
    expect(keysOf(assetsTouched(project.changes, afterSheet, engine.state().artwork))).toEqual([`project:${afterSheet.id}`]);
  });

  it('routes a removed or renamed preset by the artwork it was in', () => {
    const { engine } = heartEngine();
    apply(engine, add('S', { sprite: HEART }));
    const before = engine.state().artwork;
    const id = presetNamed(before, 'S').id;
    const renamed = apply(engine, plain('preset.rename', { preset: id, name: 'T' }));
    expect(keysOf(assetsTouched(renamed.changes, before, engine.state().artwork))).toEqual([`sprite:${HEART}`]);
    const middle = engine.state().artwork;
    const removed = apply(engine, plain('preset.delete', { preset: id }));
    expect(keysOf(assetsTouched(removed.changes, middle, engine.state().artwork))).toEqual([`sprite:${HEART}`]);
  });

  it('lists the presets of one asset, and of the project', () => {
    const { engine } = heartEngine();
    apply(engine, add('S', { sprite: HEART }), add('H', { sheet: SHEET }), add('P', { project: true }));
    const { artwork } = engine.state();
    const names = (key: AssetKey): string[] => presetsOf(artwork, key).map((preset) => preset.name);
    expect(names({ kind: ASSET_KIND.sprite, id: HEART })).toEqual(['S']);
    expect(names({ kind: ASSET_KIND.sheet, id: SHEET })).toEqual(['H']);
    expect(names({ kind: ASSET_KIND.project, id: artwork.id })).toEqual(['Hearts at 4x', 'P']);
  });
});

describe('saving the presets with the assets', () => {
  const paths = (artwork: Artwork): Map<string, string> =>
    new Map<string, string>([
      ...artwork.banks.map((bank): [string, string] => [bank.id, 'palettes/palette.bxpalette']),
      ...artwork.sprites.map((sprite): [string, string] => [sprite.id, `sprites/${sprite.name}.bxsprite`]),
      ...artwork.sheets.map((sheet): [string, string] => [sheet.id, `sheets/${sheet.name}.bxsheet`]),
    ]);

  it('carries a sprite preset through the sprite file and a sheet preset through the sheet file', () => {
    const { engine } = heartEngine();
    apply(engine, add('S', { sprite: HEART }, { settings: SETTINGS }), add('H', { sheet: SHEET }, { format: 'sheet', settings: { kind: 'sheet' } }));
    const { artwork } = engine.state();
    const spriteSlice = sliceAsset(artwork, { kind: ASSET_KIND.sprite, id: HEART }, paths(artwork));
    expect(spriteSlice.artwork.presets?.map((preset) => preset.name)).toEqual(['S']);
    const palette = sliceAsset(artwork, { kind: ASSET_KIND.palette, id: artwork.defaultBankId }, paths(artwork));
    const spriteReport = decodeSprite(encodeSprite(spriteSlice, null, assetClock), palette);
    expect(spriteReport.slice?.artwork.presets).toEqual(spriteSlice.artwork.presets);
    const sheetSlice = sliceAsset(artwork, { kind: ASSET_KIND.sheet, id: SHEET }, paths(artwork));
    const sprites = artwork.sprites.map((sprite) => sliceAsset(artwork, { kind: ASSET_KIND.sprite, id: sprite.id }, paths(artwork)));
    const sheetReport = decodeSheet(encodeSheet(sheetSlice, null, assetClock), sprites);
    expect(sheetReport.outcome).toBe('ok');
    expect(sheetReport.slice?.artwork.presets).toEqual(sheetSlice.artwork.presets);
  });

  it('puts the project presets in the project part of a split', () => {
    const { engine } = heartEngine();
    apply(engine, add('P', { project: true }), add('S', { sprite: HEART }));
    const plan = splitIntoAssets(engine.state().artwork);
    expect(plan.project.presets.map((preset) => preset.name)).toEqual(['Hearts at 4x', 'P']);
  });
});
