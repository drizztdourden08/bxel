/* @layer renderer-app @kind constants */
import type { AssetDefaults } from '@bxel/project';
import { locateAsset } from '../project-meta/locate-asset';
import { withCover } from '../project-meta/with-cover';
import { applyProjectChange } from './apply-project-change';
import { isSaved } from './is-saved';
import { PROJECT_CONFIG_TEXT } from './project-config.constants';
import type { FieldOutcome, ProjectField, ProjectFocus } from './project-config.type';
import { setProjectDefaults } from './set-project-defaults';

const DEFAULT_KEYS: readonly (keyof AssetDefaults)[] = ['size', 'colorLimit', 'palette', 'platformId', 'platformStrict', 'transparent', 'frameDurationMs', 'pixelGrid'];

const BUFFERED: ReadonlySet<keyof AssetDefaults> = new Set<keyof AssetDefaults>(['size', 'colorLimit', 'frameDurationMs']);

const defaultField = (key: keyof AssetDefaults): ProjectField => ({
  read: (focus) => focus.project.manifest.defaults[key],
  write: (focus, value) => setProjectDefaults(focus, { [key]: value }),
  buffered: BUFFERED.has(key),
});

const rename = (focus: ProjectFocus, value: unknown): FieldOutcome => {
  if (typeof value !== 'string') return null;
  const name = value.trim();
  return applyProjectChange(focus, { ...focus.project.manifest, name }, { name });
};

const pickCover = (focus: ProjectFocus, value: unknown): FieldOutcome => {
  if (typeof value !== 'string') return null;
  const path = value === '' ? undefined : focus.paths.get(value);
  if (value !== '' && (path === undefined || !isSaved(focus.documentId, value))) return PROJECT_CONFIG_TEXT.unsavedCover;
  const cover = path === undefined ? null : locateAsset(focus.project.folders, path);
  return applyProjectChange(focus, withCover(focus.project.manifest, cover), { coverSpriteId: value === '' ? null : value });
};

const PROJECT_FIELDS: Readonly<Record<string, ProjectField>> = {
  'project.name': { read: (focus) => focus.project.manifest.name, write: rename, buffered: true },
  'project.cover': { read: (focus) => focus.artwork?.coverSpriteId ?? '', write: pickCover },
  ...Object.fromEntries(DEFAULT_KEYS.map((key) => [`project.default.${key}`, defaultField(key)])),
};

export { PROJECT_FIELDS };
