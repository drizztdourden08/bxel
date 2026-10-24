/* @layer renderer-app @kind logic */
import type { ArtworkId, AssetKind, BankId, IdSource, SpriteId, WorkspaceMeta } from '@bxel/document';
import { isSamePath } from '@bxel/project';
import type { ProjectCover, ProjectDocument, ResolvedFolder } from '@bxel/project';
import { NO_BANK_ID } from '../workspace/workspace.constants';
import type { DecodedFile } from '../workspace/workspace.type';
import { assetAt } from './asset-at';

const idAt = (sources: readonly DecodedFile[], folders: readonly ResolvedFolder[], location: ProjectCover | undefined, kind: AssetKind): string | null => {
  const path = location === undefined ? null : assetAt(folders, location);
  if (path === null) return null;
  return sources.find((source) => source.slice.kind === kind && isSamePath(source.path, path))?.slice.id ?? null;
};

const defaultPalette = (manifest: ProjectDocument): ProjectCover | undefined => {
  const palette = manifest.defaults.palette;
  return palette?.kind === 'file' ? palette : undefined;
};

const metaFromManifest = (manifest: ProjectDocument, folders: readonly ResolvedFolder[], ids: IdSource, sources: readonly DecodedFile[]): WorkspaceMeta => {
  const { platformId, platformStrict } = manifest.defaults;
  return {
    id: ids.next('art') as ArtworkId,
    name: manifest.name,
    defaultBankId: (idAt(sources, folders, defaultPalette(manifest), 'palette') ?? NO_BANK_ID) as BankId,
    coverSpriteId: idAt(sources, folders, manifest.cover, 'sprite') as SpriteId | null,
    ...(typeof platformId === 'string' ? { platformId } : {}),
    ...(platformStrict === true && typeof platformId === 'string' ? { platformStrict: true } : {}),
    presets: [],
  };
};

export { metaFromManifest };
