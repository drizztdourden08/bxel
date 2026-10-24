/* @layer renderer-app @kind component */
import { Flex, Tag } from '@drizztdourden08/tessera';
import { layerState } from '../../../editor/layer-state';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { useSpriteScene } from '../../../hooks/useSpriteScene';
import { scopeChipModel } from '../../../sheet/scope-chip-model';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { CONTEXT_TEXT } from '../ContextBar.constants';
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
  const { sprite, layer, frameId } = target;
  const state = layerState(layer);
  const frame = sprite.frames.findIndex((each) => each.id === frameId) + 1;
  const layerText = CONTEXT_TEXT.layer(layer.name, state);
  return (
    <Flex gap="xs" align="center" role="group" aria-label={CONTEXT_TEXT.scope}>
      <Tag>{CONTEXT_TEXT.sprite(sprite.name)}</Tag>
      {state === '' ? <Tag>{layerText}</Tag> : <Tag variant="urgency" color="danger">{layerText}</Tag>}
      <Tag>{CONTEXT_TEXT.frame(frame, sprite.frames.length)}</Tag>
    </Flex>
  );
};

export { ScopeChips };
