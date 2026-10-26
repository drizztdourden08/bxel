/* @layer renderer-app @kind logic */
import { UNIT_SCALES } from './ruler-unit.constants';
import type { RulerUnit, UnitScale } from './ruler-unit.type';

const unitScale = (unit: RulerUnit, count: number, tile: number): UnitScale => UNIT_SCALES[unit](count, tile);

export { unitScale };
