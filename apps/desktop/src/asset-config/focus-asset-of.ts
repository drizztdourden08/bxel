/* @layer renderer-app @kind logic */
import type { AssetFocus } from './asset-config.type';
import { FOCUS_PICKERS } from './asset-config.constants';
import type { Pickers } from './focus-asset-of.type';

const focusAssetOf = <K extends keyof Pickers>(focus: AssetFocus, kind: K): ReturnType<Pickers[K]> | undefined =>
  (focus.key.kind === kind ? (FOCUS_PICKERS[kind](focus.artwork, focus.key.id) as ReturnType<Pickers[K]>) : undefined);

export { focusAssetOf };
