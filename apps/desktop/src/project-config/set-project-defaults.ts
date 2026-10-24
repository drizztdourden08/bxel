/* @layer renderer-app @kind logic */
import type { ProjectDefaults } from '@bxel/project';
import { applyProjectChange } from './apply-project-change';
import { metaOfPatch } from './meta-of-patch';
import type { DefaultsPatch, ProjectFocus, ProjectOutcomeText } from './project-config.type';

const pruned = (defaults: Readonly<Record<string, unknown>>): ProjectDefaults => Object.fromEntries(Object.entries(defaults).filter(([, value]) => value !== undefined));

const setProjectDefaults = (focus: ProjectFocus, patch: DefaultsPatch): Promise<ProjectOutcomeText> => {
  const defaults = pruned({ ...focus.project.manifest.defaults, ...patch });
  return applyProjectChange(focus, { ...focus.project.manifest, defaults }, metaOfPatch(focus, patch));
};

export { setProjectDefaults };
