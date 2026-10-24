/* @layer renderer-app @kind constants */
import { PROJECT_EXPORT_LIMITS, TEMPLATE_PATTERN } from '@bxel/project';
import { PROJECT_CONFIG_TEXT } from './project-config.constants';
import type { FieldOutcome, ProjectField, ProjectFocus } from './project-config.type';
import { setProjectExport } from './set-project-export';

const SCALE_PLAIN = PROJECT_EXPORT_LIMITS.scaleMin;

const setScale = (focus: ProjectFocus, value: unknown): FieldOutcome => {
  if (typeof value !== 'number' || !Number.isInteger(value)) return null;
  if (value < PROJECT_EXPORT_LIMITS.scaleMin || value > PROJECT_EXPORT_LIMITS.scaleMax) return PROJECT_CONFIG_TEXT.badScale(PROJECT_EXPORT_LIMITS.scaleMax);
  return setProjectExport(focus, { scale: value === SCALE_PLAIN ? undefined : value });
};

const setTemplate = (focus: ProjectFocus, value: unknown): FieldOutcome => {
  if (typeof value !== 'string') return null;
  const template = value.trim();
  if (template === '') return setProjectExport(focus, { pathTemplate: undefined });
  if (template.length > PROJECT_EXPORT_LIMITS.templateMax || !TEMPLATE_PATTERN.test(template)) return PROJECT_CONFIG_TEXT.badTemplate;
  return setProjectExport(focus, { pathTemplate: template });
};

const PROJECT_EXPORT_FIELDS: Readonly<Record<string, ProjectField>> = {
  'project.export.scale': { read: (focus) => focus.project.manifest.export?.scale ?? SCALE_PLAIN, write: setScale, buffered: true },
  'project.export.pathTemplate': { read: (focus) => focus.project.manifest.export?.pathTemplate ?? '', write: setTemplate, buffered: true },
};

export { PROJECT_EXPORT_FIELDS };
