/* @layer renderer-app @kind logic */
import { splitAnimatedSprites } from '@bxel/document';
import type { AnimatedSplit, Artwork, AssetKey, IdSource } from '@bxel/document';
import { keyId } from './key-id';
import type { AnimatedMigration, MergedWorkspace } from './workspace.type';

const changedIn = <T extends { readonly id: string }>(before: readonly T[], after: readonly T[]): readonly T[] => {
  const was = new Map(before.map((item) => [item.id, item]));
  return after.filter((item) => was.get(item.id) !== item);
};

const touchedKeys = (before: Artwork, split: AnimatedSplit, inProject: boolean): readonly AssetKey[] => {
  const { artwork } = split;
  const presets = artwork.presets !== before.presets || artwork.coverSpriteId !== before.coverSpriteId;
  return [
    ...split.conversions.map((item): AssetKey => ({ kind: 'animation', id: item.animationId })),
    ...changedIn(before.sheets, artwork.sheets).map((item): AssetKey => ({ kind: 'sheet', id: item.id })),
    ...changedIn(before.tilesets, artwork.tilesets).map((item): AssetKey => ({ kind: 'tileset', id: item.id })),
    ...(inProject && presets ? [{ kind: 'project', id: artwork.id } satisfies AssetKey] : []),
  ];
};

const migrateAnimated = (merged: MergedWorkspace, ids: IdSource, inProject: boolean): MergedWorkspace => {
  const split = splitAnimatedSprites(merged.artwork, merged.paths, ids);
  if (split.notice === null) return merged;
  const paths = new Map(split.paths);
  const old: AssetKey[] = [];
  if (inProject) {
    for (const item of split.conversions) {
      if (item.spritePath === null) continue;
      paths.set(item.spriteId, item.spritePath);
      old.push({ kind: 'sprite', id: item.spriteId });
    }
  }
  const keys = [...touchedKeys(merged.artwork, split, inProject), ...old];
  const dirty = new Set([...merged.dirty, ...keys.map(keyId)]);
  const migration: AnimatedMigration = { notice: split.notice, conversions: split.conversions, keys };
  return { ...merged, artwork: split.artwork, paths, dirty, migration };
};

export { migrateAnimated };
