/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import { currentTarget } from './current-target';
import type { EditorTarget } from './editor.type';
import { layerErrorText } from './layer-error-text';
import { layerIsSolo } from './layer-is-solo';
import { LAYER_LABEL } from './layer-text.constants';
import { soloMemory } from './solo-memory';
import { spriteScope } from './sprite-scope';

const visibleStep = (target: EditorTarget, layerId: string, visible: boolean): CommandStep => ({
  name: COMMAND_NAME.layerUpdate,
  targets: spriteScope(target),
  options: { layer: { by: 'id', id: layerId }, visible },
});

const wantedVisibility = (target: EditorTarget, layerId: string): Map<string, boolean> => {
  if (!layerIsSolo(target.sprite, layerId)) return new Map(target.sprite.layers.map((layer) => [layer.id, layer.id === layerId]));
  const earlier = soloMemory.get(target.sprite.id);
  return new Map(target.sprite.layers.map((layer) => [layer.id, earlier?.get(layer.id) ?? true]));
};

const soloLayer = (layerId?: string): void => {
  const target = currentTarget();
  const chosen = target?.sprite.layers.find((layer) => layer.id === (layerId ?? target.layerId));
  if (!target || !chosen) return;
  const wanted = wantedVisibility(target, chosen.id);
  if (!layerIsSolo(target.sprite, chosen.id)) soloMemory.set(target.sprite.id, new Map(target.sprite.layers.map((layer) => [layer.id, layer.visible])));
  const steps = target.sprite.layers.filter((layer) => layer.visible !== wanted.get(layer.id)).map((layer) => visibleStep(target, layer.id, wanted.get(layer.id) ?? true));
  if (steps.length === 0) return;
  const { host } = useDocumentStore.getState();
  const result = host.execute({ documentId: target.documentId, baseRevision: target.revision, mode: 'commit', origin: 'ui', label: LAYER_LABEL.solo, steps, previewPixels: 0 });
  if (!result.ok) useNoticeStore.getState().post(layerErrorText(result.error, target.sprite));
};

export { soloLayer };
