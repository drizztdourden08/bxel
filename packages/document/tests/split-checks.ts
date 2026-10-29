/* @layer core @kind test */
import type { Artwork, AssetKind, SliceSource, SplitFile, SplitPlan } from '@bxel/document';
import { counterIdSource, mergeSlices } from '@bxel/document';
import { expect } from 'vitest';
import { decodeFiles, encodeSlice } from './asset-bytes';

const byId = <T extends { readonly id: string }>(items: readonly T[]): T[] =>
  [...items].sort((left, right) => (left.id < right.id ? -1 : 1));

const normal = (artwork: Artwork): Artwork => ({
  ...artwork,
  banks: byId(artwork.banks),
  sprites: byId(artwork.sprites),
  sheets: byId(artwork.sheets),
  presets: byId(artwork.presets),
  tilesets: byId(artwork.tilesets),
  tilemaps: byId(artwork.tilemaps),
  animations: byId(artwork.animations),
});

const ofKind = (files: readonly SplitFile[], kind: AssetKind): SplitFile[] => files.filter((file) => file.key.kind === kind);

const expectMergedEqual = (sources: readonly SliceSource[], plan: SplitPlan, artwork: Artwork): void => {
  const merged = mergeSlices(sources, counterIdSource(5000), plan.project);
  expect(merged.issues).toEqual([]);
  expect(merged.rekeyed).toEqual([]);
  expect(normal(merged.artwork)).toEqual(normal(artwork));
};

const expectBytesRoundTrip = (plan: SplitPlan, artwork: Artwork): void => {
  const stored = plan.files.map((file) => ({ path: file.path, bytes: encodeSlice(file.slice) }));
  const { sources, reports } = decodeFiles(stored);
  expect(reports.map((report) => report.issues)).toEqual(reports.map(() => []));
  expect(reports.every((report) => report.outcome === 'ok')).toBe(true);
  expectMergedEqual(sources, plan, artwork);
  for (const [index, file] of plan.files.entries()) {
    const source = sources.find((item) => item.path === file.path);
    expect(source && encodeSlice(source.slice)).toEqual(stored[index]?.bytes);
  }
};

export { expectBytesRoundTrip, expectMergedEqual, ofKind };
