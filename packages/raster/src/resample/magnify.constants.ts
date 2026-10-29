/* @layer core @kind constants */
import { mmpx } from './mmpx';
import type { Magnifier } from './magnify.type';
import { scale2x } from './scale2x';
import { scale3x } from './scale3x';

const MAGNIFIERS: Readonly<Record<string, Magnifier>> = {
  scale2x: { factor: 2, run: scale2x },
  scale3x: { factor: 3, run: scale3x },
  mmpx: { factor: 2, run: mmpx },
};

export { MAGNIFIERS };
