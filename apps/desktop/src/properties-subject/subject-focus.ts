/* @layer renderer-app @kind logic */
import type { AssetFocus } from '../asset-config/asset-config.type';
import type { SubjectState } from './properties-subject.type';

const focusOf = (state: SubjectState): AssetFocus | null => (state.status === 'ready' ? state.subject.focus : null);

export { focusOf };
