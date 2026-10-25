/* @layer core @kind logic */
import type { Wrap } from './wrap.type';

const isWrapped = (wrap: Wrap | undefined): boolean => wrap?.x === true || wrap?.y === true;

export { isWrapped };
