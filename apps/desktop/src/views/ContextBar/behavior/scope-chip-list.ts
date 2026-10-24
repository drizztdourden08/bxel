/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../../../editor/editor.type';
import { layerState } from '../../../editor/layer-state';
import { CONTEXT_TEXT } from '../ContextBar.constants';
import type { ScopeChipView } from '../ContextBar.type';

const scopeChipList = (target: EditorTarget): readonly ScopeChipView[] => {
  const { sprite, layer, frameId } = target;
  const state = layerState(layer);
  const frame = sprite.frames.findIndex((each) => each.id === frameId) + 1;
  const spriteText = CONTEXT_TEXT.sprite(sprite.name);
  const layerFull = CONTEXT_TEXT.layer(layer.name, state);
  const frameText = CONTEXT_TEXT.frame(frame, sprite.frames.length);
  return [
    { key: 'sprite', text: spriteText, full: spriteText, locked: false, danger: false },
    {
      key: 'layer',
      text: layer.locked ? CONTEXT_TEXT.layer(layer.name, '') : layerFull,
      full: layerFull,
      locked: layer.locked,
      danger: state !== '',
    },
    { key: 'frame', text: frameText, full: frameText, locked: false, danger: false },
  ];
};

export { scopeChipList };
