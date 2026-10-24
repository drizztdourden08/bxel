/* @layer core @kind logic */
import type { ProjectDefaults } from '../defaults/asset-defaults.type';
import type { ProjectSettings } from '../manifest/manifest.type';

const migratedDefaults = (settings: ProjectSettings): ProjectDefaults =>
  settings.palette === null
    ? {}
    : { palette: { kind: 'file', folderId: settings.palette.folderId, path: settings.palette.path } };

export { migratedDefaults };
