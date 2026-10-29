/* @layer renderer-app @kind logic */
import type { AssetKind } from '@bxel/document';
import type { IconName } from '@drizztdourden08/tessera';
import { KIND_ICON } from '../asset-list/asset-list.constants';

const iconOfKind = (kind: AssetKind): IconName => (kind === 'project' ? 'folder' : KIND_ICON[kind]);

export { iconOfKind };
