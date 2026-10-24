/* @layer renderer-app @kind component */
import { Flex } from '@drizztdourden08/tessera';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { useSpriteScene } from '../../../hooks/useSpriteScene';
import { scopeChipModel } from '../../../sheet/scope-chip-model';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { scopeChipList } from '../behavior/scope-chip-list';
import { CONTEXT_TEXT } from '../ContextBar.constants';
import { ScopeChip } from './ScopeChip';
import { ScopeMenus } from './ScopeMenus';

const ScopeChips = () => {
  const target = useEditorTarget();
  const model = useSpriteScene();
  const spritesScope = useSpriteStore((state) => state.spritesScope);
  const layerScope = useSpriteStore((state) => state.layerScope);
  const frameScope = useSpriteStore((state) => state.frameScope);
  if (!target || !model) return null;
  const chips = scopeChipModel(model.scene, target, { sprites: spritesScope, layers: layerScope, frames: frameScope });
  if (chips.multi) return <ScopeMenus chips={chips} />;
  return (
    <Flex gap="xs" align="center" role="group" aria-label={CONTEXT_TEXT.scope}>
      {scopeChipList(target).map((chip) => <ScopeChip key={chip.key} chip={chip} />)}
    </Flex>
  );
};

export { ScopeChips };
