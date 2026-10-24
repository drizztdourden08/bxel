/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import type { ProjectCover, ProjectDefaults, ProjectDocument } from '@bxel/project';
import { locateAsset } from './locate-asset';
import type { MetaSource } from './project-meta.type';

const locationOf = (source: MetaSource, id: string | null): ProjectCover | null => {
  const path = id === null ? undefined : source.paths.get(id);
  return path === undefined ? null : locateAsset(source.folders, path);
};

const platformOf = (artwork: Artwork, defaults: ProjectDefaults): ProjectDefaults => {
  if (artwork.platformId !== undefined) return { platformId: artwork.platformId, ...(artwork.platformStrict === true ? { platformStrict: true } : {}) };
  return defaults.platformId === null ? { platformId: null } : {};
};

const paletteOf = (source: MetaSource, defaults: ProjectDefaults): ProjectDefaults => {
  const located = locationOf(source, source.artwork.defaultBankId);
  if (located !== null) return { palette: { kind: 'file', folderId: located.folderId, path: located.path } };
  return defaults.palette === undefined ? {} : { palette: defaults.palette };
};

const coverOf = (source: MetaSource, manifest: ProjectDocument): Pick<ProjectDocument, 'cover'> => {
  if (source.artwork.coverSpriteId === null) return {};
  const located = locationOf(source, source.artwork.coverSpriteId);
  const kept = located ?? manifest.cover;
  return kept === undefined ? {} : { cover: kept };
};

const keptDefaults = (defaults: ProjectDefaults): ProjectDefaults =>
  Object.fromEntries(Object.entries(defaults).filter(([key]) => key !== 'platformId' && key !== 'platformStrict' && key !== 'palette'));

const manifestWithMeta = (manifest: ProjectDocument, source: MetaSource): ProjectDocument => ({
  format: manifest.format,
  formatVersion: manifest.formatVersion,
  projectId: manifest.projectId,
  name: source.artwork.name,
  ...coverOf(source, manifest),
  folders: manifest.folders,
  defaults: { ...keptDefaults(manifest.defaults), ...paletteOf(source, manifest.defaults), ...platformOf(source.artwork, manifest.defaults) },
  ...(manifest.export === undefined ? {} : { export: manifest.export }),
  assistant: manifest.assistant,
});

export { manifestWithMeta };
