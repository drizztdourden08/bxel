/* @layer renderer-app @kind constants */
const DEFAULT_PREFIX = 'app.default.';

const CANVAS_FIELDS = { surroundCustom: 'canvas.surroundCustom' } as const;

const APP_CONTROL_FIELDS: readonly string[] = [
  ...Object.values(CANVAS_FIELDS),
  'app.default.size',
  'app.default.colorLimit',
  'app.default.palette',
  'app.default.platformId',
  'app.default.platformStrict',
  'app.default.transparent',
  'app.default.frameDurationMs',
  'app.default.pixelGrid',
];

export { APP_CONTROL_FIELDS, CANVAS_FIELDS, DEFAULT_PREFIX };
