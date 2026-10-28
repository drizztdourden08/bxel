/* @layer renderer-app @kind hook */
import { focusOf } from '../properties-subject/subject-focus';
import { useSubject } from '../properties-subject/useSubject';
import type { AssetFocus } from './asset-config.type';

const useAssetFocus = (): AssetFocus | null => focusOf(useSubject());

export { useAssetFocus };
