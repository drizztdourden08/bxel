/* @layer renderer-app @kind logic */
import { presetsOf } from '@bxel/document';
import type { ProjectDocument } from '@bxel/project';
import { exportWithPresets } from './export-with-presets';
import { manifestWithMeta } from './manifest-with-meta';
import type { MetaSource } from './project-meta.type';

const manifestForSplit = (manifest: ProjectDocument, source: MetaSource): ProjectDocument => {
  const merged = manifestWithMeta(manifest, source);
  const kept = manifest.export?.presets ?? [];
  const added = presetsOf(source.artwork, { kind: 'project', id: source.artwork.id }).filter((preset) => !kept.some((each) => each.id === preset.id));
  const { export: _replaced, ...rest } = merged;
  return {
    ...rest,
    name: manifest.name,
    ...(manifest.cover === undefined ? {} : { cover: manifest.cover }),
    defaults: { ...merged.defaults, ...manifest.defaults },
    ...exportWithPresets(manifest, [...kept, ...added]),
  };
};

export { manifestForSplit };
