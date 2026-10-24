/* @layer renderer-app @kind component */
import { DropdownMenu, Flex } from '@drizztdourden08/tessera';
import { framesGroups } from '../../../sheet/frames-groups';
import { layersGroups } from '../../../sheet/layers-groups';
import { SHEET_TEXT } from '../../../sheet/sheet.constants';
import { spritesGroups } from '../../../sheet/sprites-groups';
import { usePendingStore } from '../../../stores/usePendingStore';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { ActionHint } from '../../ActionHint';
import { SCOPE_HINTS } from '../ContextBar.constants';
import type { ScopeMenusProps } from '../ContextBar.type';

const ScopeMenus = ({ chips }: ScopeMenusProps) => {
  const scopes = useSpriteStore();
  const locked = usePendingStore((state) => state.pending !== null);
  return (
    <Flex gap="xs" align="center" role="group" aria-label={SHEET_TEXT.scopeLabel}>
      <ActionHint hint={SCOPE_HINTS.sprites}>
        <DropdownMenu size="sm" disabled={locked} trigger={{ label: chips.sprites }} groups={spritesGroups(scopes.spritesScope, scopes.setSpritesScope)} />
      </ActionHint>
      <ActionHint hint={SCOPE_HINTS.layers}>
        <DropdownMenu size="sm" disabled={locked} trigger={{ label: chips.layers }} groups={layersGroups(scopes.layerScope, scopes.setLayerScope)} />
      </ActionHint>
      <ActionHint hint={SCOPE_HINTS.frames}>
        <DropdownMenu size="sm" disabled={locked} trigger={{ label: chips.frames }} groups={framesGroups(scopes.frameScope, scopes.setFrameScope)} />
      </ActionHint>
    </Flex>
  );
};

export { ScopeMenus };
