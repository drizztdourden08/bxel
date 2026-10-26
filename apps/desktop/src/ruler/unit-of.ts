/* @layer renderer-app @kind logic */
import { RULER_UNITS } from './ruler-unit.constants';
import type { RulerUnit } from './ruler-unit.type';

const unitOf = (value: unknown): RulerUnit => RULER_UNITS.find((unit) => unit === value) ?? 'pixels';

export { unitOf };
