/* @layer renderer-app @kind logic */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import type { OptionItems, OptionKind } from '../OptionsToolbar.type';

const joinOptions = (kinds: readonly OptionKind[], items: OptionItems): ToolbarItem[] =>
  kinds
    .filter((kind) => items[kind].length > 0)
    .flatMap((kind, at): ToolbarItem[] => [...(at > 0 ? [{ kind: 'separator' as const, id: `before-${kind}` }] : []), ...items[kind]]);

export { joinOptions };
