/* @layer core @kind logic */
import { DRIVE_PREFIX_REGEX, EXTENDED_PREFIX_REGEX, UNC_PREFIX_REGEX } from './path.constants';
import type { PathParts } from './path.type';

const splitPrefix = (path: string): PathParts | undefined => {
  const text = path.replaceAll('\\', '/').replace(EXTENDED_PREFIX_REGEX, '');
  const drive = DRIVE_PREFIX_REGEX.exec(text);
  if (drive) return { prefix: drive[1] ?? '', rest: text.slice(drive[0].length) };
  const share = UNC_PREFIX_REGEX.exec(text);
  if (share) return { prefix: `//${share[1] ?? ''}/${share[2] ?? ''}`, rest: text.slice(share[0].length) };
  if (text.startsWith('//') || !text.startsWith('/')) return undefined;
  return { prefix: '', rest: text.slice(1) };
};

export { splitPrefix };
