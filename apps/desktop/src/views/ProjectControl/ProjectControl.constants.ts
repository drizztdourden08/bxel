/* @layer renderer-app @kind constants */
const DEFAULT_PREFIX = 'project.default.';

const PROJECT_CONTROL_FIELDS: readonly string[] = [
  'project.cover',
  'project.folders',
  'project.default.size',
  'project.default.colorLimit',
  'project.default.palette',
  'project.default.platformId',
  'project.default.platformStrict',
  'project.default.transparent',
  'project.default.frameDurationMs',
  'project.default.pixelGrid',
];

export { DEFAULT_PREFIX, PROJECT_CONTROL_FIELDS };
