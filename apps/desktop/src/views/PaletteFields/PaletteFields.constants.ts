/* @layer renderer-app @kind constants */
import { LIMIT_PRESETS, LIMIT_TEXT } from '../../palette-limit/palette-limit.constants';

const LIMIT_OPTIONS = [
  ...LIMIT_PRESETS.map((each) => ({ value: String(each), label: String(each) })),
  { value: LIMIT_TEXT.custom, label: LIMIT_TEXT.custom },
];

export { LIMIT_OPTIONS };
