/* @layer core @kind test */
import { splitIntoAssets } from '@bxel/document';
import { decodeArtwork, encodeArtwork } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { decodeFiles, encodeSlice } from './asset-bytes';
import { fixedClock, heartPreview } from './native-fixture';
import { apply, expectUndoRedo, plain, rejection, SHEET, sheetOf } from './sheet-engine';
import { heartEngine } from './heart-engine';
import { applySteps, buildWorld, checkOneUndoStep, mapOf, step } from './tile-engine';

const GUIDES = { x: [8, 16.5], y: [4] };

describe('guides of a tilemap', () => {
  it('are absent until set, are one undo step, and go away when emptied', () => {
    const world = buildWorld();
    expect(mapOf(world.engine).guides).toBeUndefined();
    checkOneUndoStep(world.engine, () => applySteps(world.engine, [step('tilemap.guides', { tilemap: world.map, guides: GUIDES })]));
    expect(mapOf(world.engine).guides).toEqual(GUIDES);
    applySteps(world.engine, [step('tilemap.guides', { tilemap: world.map, guides: { x: [], y: [] } })]);
    expect('guides' in mapOf(world.engine)).toBe(false);
  });

  it('are saved with the map and read back, and a file without them still loads', () => {
    const world = buildWorld();
    const bare = decodeArtwork(encodeArtwork(world.engine.state(), heartPreview, fixedClock));
    expect(bare.outcome).toBe('ok');
    expect(bare.artwork?.tilemaps.every((map) => map.guides === undefined)).toBe(true);
    applySteps(world.engine, [step('tilemap.guides', { tilemap: world.map, guides: GUIDES })]);
    const report = decodeArtwork(encodeArtwork(world.engine.state(), heartPreview, fixedClock));
    expect(report.outcome).toBe('ok');
    expect(report.artwork?.tilemaps.find((map) => map.id === world.map)?.guides).toEqual(GUIDES);
    expect(report.artwork).toEqual(world.engine.state().artwork);
  });
});

describe('guides of a sheet', () => {
  it('are absent until set, are one undo step, and refuse a position off the half pixel step', () => {
    const { engine } = heartEngine();
    expect(sheetOf(engine).guides).toBeUndefined();
    expectUndoRedo(engine, plain('sheet.guides', { sheet: SHEET, guides: GUIDES }));
    expect(sheetOf(engine).guides).toEqual(GUIDES);
    expect(rejection(engine, plain('sheet.guides', { sheet: SHEET, guides: { x: [1.3], y: [] } })).code).toBeTruthy();
    apply(engine, plain('sheet.guides', { sheet: SHEET, guides: { x: [], y: [] } }));
    expect('guides' in sheetOf(engine)).toBe(false);
  });

  it('are saved with the sheet and read back', () => {
    const { engine } = heartEngine();
    apply(engine, plain('sheet.guides', { sheet: SHEET, guides: GUIDES }));
    const report = decodeArtwork(encodeArtwork(engine.state(), heartPreview, fixedClock));
    expect(report.outcome).toBe('ok');
    expect(report.artwork?.sheets.find((sheet) => sheet.id === SHEET)?.guides).toEqual(GUIDES);
  });
});

describe('guides in the files of a split project', () => {
  it('travel in the map file and the sheet file and come back after a reload', () => {
    const world = buildWorld();
    applySteps(world.engine, [step('tilemap.guides', { tilemap: world.map, guides: GUIDES })]);
    const files = splitIntoAssets(world.engine.state().artwork).files.map((file) => ({ path: file.path, bytes: encodeSlice(file.slice) }));
    const loaded = decodeFiles(files).sources.map((source) => source.slice);
    const map = loaded.flatMap((slice) => slice.artwork.tilemaps ?? []).find((each) => each.id === world.map);
    expect(map?.guides).toEqual(GUIDES);
  });

  it('keep a sheet guide through its own file', () => {
    const { engine } = heartEngine();
    apply(engine, plain('sheet.guides', { sheet: SHEET, guides: GUIDES }));
    const files = splitIntoAssets(engine.state().artwork).files.map((file) => ({ path: file.path, bytes: encodeSlice(file.slice) }));
    const loaded = decodeFiles(files).sources.map((source) => source.slice);
    expect(loaded.flatMap((slice) => slice.artwork.sheets ?? []).find((each) => each.id === SHEET)?.guides).toEqual(GUIDES);
  });
});
