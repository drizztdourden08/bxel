/* @layer core @kind logic */
import { checkRelPath } from '../paths/check-rel-path';
import { ASSETS_DIR } from './project-container.constants';

const isAssetEntry = (entry: string): boolean => entry.startsWith(ASSETS_DIR) && checkRelPath(entry.slice(ASSETS_DIR.length)).ok;

export { isAssetEntry };
