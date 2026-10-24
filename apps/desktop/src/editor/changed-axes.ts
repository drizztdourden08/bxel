/* @layer renderer-app @kind logic */
import type { SymmetryAxis } from '../stores/tool-store.type';
import { SYMMETRY_AXES } from './tools.constants';

const changedAxes = (before: readonly SymmetryAxis[], after: readonly SymmetryAxis[]): SymmetryAxis[] =>
  SYMMETRY_AXES.filter((axis) => before.includes(axis) !== after.includes(axis));

export { changedAxes };
