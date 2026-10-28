/* @layer renderer-app @kind logic */
import type { BxelContext } from './bxel-context.type';

const sameContext = (a: BxelContext, b: BxelContext): boolean =>
  (Object.keys(a) as (keyof BxelContext)[]).every((key) => a[key] === b[key]);

export { sameContext };
