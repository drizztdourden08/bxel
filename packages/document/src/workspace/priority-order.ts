/* @layer core @kind logic */
import { nameKey } from '../validate/name-key';
import { fileStem } from './file-stem';
import type { SliceSource } from './slice-source.type';

const namesItsFile = ({ path, slice }: SliceSource): number => (nameKey(fileStem(path)) === nameKey(slice.name) ? 0 : 1);

const priorityOrder = (sources: readonly SliceSource[]): readonly number[] =>
  sources
    .map((source, index) => ({ index, rank: namesItsFile(source), path: source.path }))
    .sort((left, right) => left.rank - right.rank || (left.path < right.path ? -1 : 1))
    .map((item) => item.index);

export { priorityOrder };
