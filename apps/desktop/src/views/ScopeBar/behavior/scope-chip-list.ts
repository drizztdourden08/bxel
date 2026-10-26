/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../../../editor/editor.type';
import { layerState } from '../../../editor/layer-state';
import { SCOPE_TEXT } from '../ScopeBar.constants';
import type { ScopeChipView } from '../ScopeBar.type';

const scopeChipList = (target: EditorTarget): readonly ScopeChipView[] => {
  const { sprite, layer } = target;
  const state = layerState(layer);
  const spriteText = SCOPE_TEXT.sprite(sprite.name);
  const layerFull = SCOPE_TEXT.layer(layer.name, state);
  return [
    { key: 'sprite', text: spriteText, full: spriteText, locked: false, danger: false },
    {
      key: 'layer',
      text: layer.locked ? SCOPE_TEXT.layer(layer.name, '') : layerFull,
      full: layerFull,
      locked: layer.locked,
      danger: state !== '',
    },
  ];
};

export { scopeChipList };
