/* @layer core @kind logic */
import { splitPrefix } from './split-prefix';

const pathSegments = (normalized: string): string[] =>
  (splitPrefix(normalized)?.rest ?? '').split('/').filter((segment) => segment !== '');

export { pathSegments };
