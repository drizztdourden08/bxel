/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { AcceptedSource } from './accepted-source.type';
import { gatherContent } from './gather-content';
import { mergeById } from './merge-by-id';
import { MERGE_ISSUE } from './merge-issue.constants';
import type { Composed } from './composed.type';
import type { MergeIssue } from './merge-result.type';
import { settleMeta } from './settle-meta';
import type { WorkspaceMeta } from './workspace-meta.type';

const divergentIssue = (id: string): MergeIssue => ({
  code: MERGE_ISSUE.BANK_COPY_DIFFERS,
  message: `Palette ${id} has different copies and no palette file; the first copy is used.`,
  path: null,
});

const composeArtwork = (accepted: readonly AcceptedSource[], meta: WorkspaceMeta): Composed => {
  const banks = gatherContent(accepted, 'banks');
  const sprites = gatherContent(accepted, 'sprites');
  const presets = mergeById([...gatherContent(accepted, 'presets').items, ...meta.presets], []);
  const settled = settleMeta(meta, banks.items, sprites.items);
  const { id, name, defaultBankId, coverSpriteId, platformId, platformStrict } = settled.meta;
  const artwork: Artwork = {
    id,
    name,
    defaultBankId,
    coverSpriteId,
    ...(platformId === undefined ? {} : { platformId }),
    ...(platformStrict === true ? { platformStrict: true } : {}),
    banks: banks.items,
    sprites: sprites.items,
    sheets: gatherContent(accepted, 'sheets').items,
    presets: presets.items,
    tilesets: gatherContent(accepted, 'tilesets').items,
    tilemaps: gatherContent(accepted, 'tilemaps').items,
    animations: [],
  };
  return { artwork, issues: [...banks.divergent.map(divergentIssue), ...settled.issues] };
};

export { composeArtwork };
