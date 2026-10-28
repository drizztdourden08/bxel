/* @layer renderer-app @kind logic */
import { COMMAND_NAME, MAX_TARGET_SPRITES } from '@bxel/document';
import type { CommandStep, Sprite } from '@bxel/document';
import type { LayerFields } from '../editor/layer-lock.type';
import { layerRefusalText } from '../editor/layer-refusal-text';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import { runSteps } from '../transactions/run-steps';
import { spritesTarget } from './sprites-target';

const carriers = (sprites: readonly Sprite[], name: string): Sprite[] =>
  sprites.filter((sprite) => sprite.layers.some((layer) => layer.name.toLowerCase() === name.toLowerCase()));

const stepsFor = (sprites: readonly Sprite[], name: string, fields: LayerFields): CommandStep[] => {
  const options = { layer: { by: 'name', name }, ...Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined)) };
  const have = carriers(sprites, name);
  return Array.from({ length: Math.ceil(have.length / MAX_TARGET_SPRITES) }, (_, chunk) => ({
    name: COMMAND_NAME.layerUpdate,
    targets: spritesTarget(have.slice(chunk * MAX_TARGET_SPRITES, (chunk + 1) * MAX_TARGET_SPRITES).map((sprite) => sprite.id)),
    options,
  }));
};

/** Changes the layers of these names in every given sprite that has one, as one undo step. Returns why it was refused, or null. */
const tryUpdateSheetLayers = (sprites: readonly Sprite[], names: readonly string[], fields: LayerFields, label: string): string | null => {
  const { host, activeId } = useDocumentStore.getState();
  const steps = names.flatMap((name) => stepsFor(sprites, name, fields));
  if (activeId === null || steps.length === 0) return null;
  const result = runSteps(host, activeId, label, steps);
  return result.ok ? null : layerRefusalText(result.error);
};

/** The same, and a refusal shows as a notice. */
const updateSheetLayers = (sprites: readonly Sprite[], names: readonly string[], fields: LayerFields, label: string): void => {
  const refused = tryUpdateSheetLayers(sprites, names, fields, label);
  if (refused) useNoticeStore.getState().post(refused);
};

export { tryUpdateSheetLayers, updateSheetLayers };
