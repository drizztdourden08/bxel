/* @layer core @kind logic */
import { ROOT_FOLDER_PATH } from '../manifest/manifest.constants';
import { normalizeAbsolute } from '../paths/normalize-absolute';
import { splitPrefix } from '../paths/split-prefix';

const resolveFolderPath = (rootNormalized: string, stored: string): string | undefined => {
  if (stored === ROOT_FOLDER_PATH) return rootNormalized;
  if (splitPrefix(stored) !== undefined) return normalizeAbsolute(stored);
  if (stored.includes(':') || stored.includes('\\')) return undefined;
  return normalizeAbsolute(`${rootNormalized}/${stored}`);
};

export { resolveFolderPath };
