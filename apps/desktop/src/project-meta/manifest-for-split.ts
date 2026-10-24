/* @layer renderer-app @kind logic */
import type { ProjectDocument } from '@bxel/project';
import { manifestWithMeta } from './manifest-with-meta';
import type { MetaSource } from './project-meta.type';

const manifestForSplit = (manifest: ProjectDocument, source: MetaSource): ProjectDocument => {
  const merged = manifestWithMeta(manifest, source);
  return {
    ...merged,
    name: manifest.name,
    ...(manifest.cover === undefined ? {} : { cover: manifest.cover }),
    defaults: { ...merged.defaults, ...manifest.defaults },
  };
};

export { manifestForSplit };
