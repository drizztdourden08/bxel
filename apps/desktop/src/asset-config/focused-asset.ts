/* @layer renderer-app @kind logic */
import { focusOf } from '../properties-subject/subject-focus';
import { readSubject } from '../properties-subject/read-subject';
import type { AssetFocus } from './asset-config.type';

const focusedAsset = (): AssetFocus | null => focusOf(readSubject());

export { focusedAsset };
