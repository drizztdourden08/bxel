/* @layer core @kind logic */
import type { AssetDefaults, ProjectDefaults } from './asset-defaults.type';

const setFields = (project: ProjectDefaults): ProjectDefaults =>
  Object.fromEntries(Object.entries<unknown>(project).filter(([, value]) => value !== undefined));

const resolveDefaults = (app: AssetDefaults, project: ProjectDefaults): AssetDefaults => ({
  ...app,
  ...setFields(project),
});

export { resolveDefaults };
