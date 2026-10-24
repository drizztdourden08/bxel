/* @layer renderer-app @kind logic */
import type { EditorTarget } from '../editor/editor.type';
import type { FrameScope, LayerScope, SpritesScope } from '../stores/sprite-store.type';
import { SHEET_TEXT } from './sheet.constants';
import type { ScopeChipModel, SpriteScene } from './sheet.type';

const layersLabel = (scope: LayerScope, target: EditorTarget): string => {
  const { layers } = target.sprite;
  if (scope === 'active') return SHEET_TEXT.activeLayerLabel(target.layer.name);
  if (scope === 'visible') return SHEET_TEXT.visibleLayersLabel(layers.filter((layer) => layer.visible).length);
  return SHEET_TEXT.allLayers(layers.length);
};

const framesLabel = (scope: FrameScope, scene: SpriteScene, target: EditorTarget): string => {
  const total = target.sprite.frames.length;
  const at = target.sprite.frames.findIndex((frame) => frame.id === target.frameId) + 1;
  const single = scene.selected.every((sprite) => sprite.frames.length === 1);
  return scope === 'current' || single ? SHEET_TEXT.currentFrame(at, total) : SHEET_TEXT.allFrames(total);
};

const scopeChipModel = (
  scene: SpriteScene,
  target: EditorTarget,
  scopes: { sprites: SpritesScope; layers: LayerScope; frames: FrameScope },
): ScopeChipModel => ({
  multi: scene.selected.length > 1,
  sprites: scopes.sprites === 'current' ? SHEET_TEXT.spriteChip(target.sprite.name) : SHEET_TEXT.spritesChip(scene.selected.length),
  layers: SHEET_TEXT.layersChip(layersLabel(scopes.layers, target)),
  frames: SHEET_TEXT.framesChip(framesLabel(scopes.frames, scene, target)),
});

export { scopeChipModel };
