/* @layer core @kind logic */
import { PLACEHOLDER_NAME_LENGTH } from './placeholder.constants';

const placeholderName = (path: string, fallback: string): string => {
  const file = path.split('/').pop() ?? '';
  const dot = file.lastIndexOf('.');
  const stem = (dot > 0 ? file.slice(0, dot) : file).replaceAll(/\p{Cc}/gu, '').trim();
  return stem.length > 0 ? stem.slice(0, PLACEHOLDER_NAME_LENGTH) : fallback;
};

export { placeholderName };
