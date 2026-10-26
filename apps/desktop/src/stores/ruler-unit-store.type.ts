/* @layer renderer-app @kind types */
import type { RulerUnit } from '../ruler/ruler-unit.type';

type UnitWriter = (unit: RulerUnit) => void;

interface RulerUnitState {
  unit: RulerUnit;
  tile: number;
  writer: UnitWriter | null;
  sync: (unit: RulerUnit, tile: number) => void;
  setWriter: (writer: UnitWriter | null) => void;
  choose: (unit: RulerUnit) => void;
}

export type { RulerUnitState };
