/* @layer renderer-app @kind component */
import { Flex } from '@drizztdourden08/tessera';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { useSpriteScene } from '../../../hooks/useSpriteScene';
import { scopeChipModel } from '../../../sheet/scope-chip-model';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { scopeChipList } from '../behavior/scope-chip-list';
import { SCOPE_TEXT } from '../ScopeBar.constants';
import { ScopeChip } from './ScopeChip';
import { ScopeMenus } from './ScopeMenus';

const ScopeChips = () => {
  const target = useEditorTarget();
  const model = useSpriteScene();
  const spritesScope = useSpriteStore((state) => state.spritesScope);
  const layerScope = useSpriteStore((state) => state.layerScope);
  if (!target || !model) return null;
  const chips = scopeChipModel(model.scene, target, { sprites: spritesScope, layers: layerScope });
  if (chips.multi) return <ScopeMenus chips={chips} />;
  return (
    <Flex gap="xs" align="center" role="group" aria-label={SCOPE_TEXT.region}>
      {scopeChipList(target).map((chip) => <ScopeChip key={chip.key} chip={chip} />)}
    </Flex>
  );
};

export { ScopeChips };
