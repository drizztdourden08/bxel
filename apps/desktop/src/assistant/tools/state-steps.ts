/* @layer renderer-app @kind logic */
import type { AnimFrameId, LayerId, MapLayerId, SpriteId } from '@bxel/document';
import { currentTarget } from '../../editor/current-target';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { useTilemapStore } from '../../stores/useTilemapStore';
import { useTimelineStore } from '../../stores/useTimelineStore';
import { useToolStore } from '../../stores/useToolStore';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

const COLOUR_SLOTS = ['foreground', 'background', 'third', 'fourth'] as const;

const activeArtwork = () => {
  const { host, activeId } = useDocumentStore.getState();
  return activeId === null ? null : (host.view(activeId)?.state.artwork ?? null);
};

const selectStep: ViewStep = (patch) => {
  const { select } = patch;
  if (!select) return null;
  const artwork = activeArtwork();
  if (!artwork) return viewFail(APP_TOOL_TEXT.noSelectionTarget, 'select');
  const sprites = useSpriteStore.getState();
  if (select.sprite !== undefined) {
    if (!artwork.sprites.some((sprite) => sprite.id === select.sprite)) return viewFail(APP_TOOL_TEXT.noSprite, 'select.sprite');
    sprites.setActive(select.sprite as SpriteId);
    sprites.setSelection([select.sprite as SpriteId], select.sprite as SpriteId);
  }
  if (select.sprites !== undefined) {
    const known = new Set(artwork.sprites.map((sprite) => sprite.id as string));
    if (select.sprites.some((id) => !known.has(id))) return viewFail(APP_TOOL_TEXT.noSprite, 'select.sprites');
    sprites.setSelection(select.sprites as SpriteId[], (select.sprites[0] as SpriteId | undefined) ?? null);
  }
  if (select.layer !== undefined) {
    const layers = currentTarget()?.sprite.layers ?? [];
    if (!layers.some((layer) => layer.id === select.layer)) return viewFail(APP_TOOL_TEXT.noLayer, 'select.layer');
    useToolStore.getState().setLayer(select.layer as LayerId);
  }
  if (select.frames !== undefined) {
    useTimelineStore.getState().select({ frames: select.frames as AnimFrameId[], anchor: (select.frames[0] as AnimFrameId | undefined) ?? null }, (select.frames[0] as AnimFrameId | undefined) ?? null);
  }
  if (select.frame !== undefined) useTimelineStore.getState().setFrame(select.frame as AnimFrameId);
  if (select.mapLayer !== undefined) useTilemapStore.getState().setLayer(select.mapLayer as MapLayerId);
  if (select.tile !== undefined) useTilemapStore.getState().setStamp({ columns: 1, rows: 1, keys: [select.tile] });
  return null;
};

const toolStep: ViewStep = (patch) => {
  const { tool } = patch;
  if (!tool) return null;
  const store = useToolStore.getState();
  if (tool.id !== undefined) store.selectTool(tool.id);
  const options = tool.options;
  if (!options) return null;
  if (options.brushSize !== undefined) store.setBrushSize(options.brushSize);
  if (options.brushShape !== undefined) store.setBrushShape(options.brushShape);
  if (options.pixelPerfect !== undefined) store.setPixelPerfect(options.pixelPerfect);
  if (options.fillMode !== undefined) store.setFillMode(options.fillMode);
  if (options.connectivity !== undefined) store.setConnectivity(options.connectivity);
  if (options.shape !== undefined) store.setShape(options.shape);
  if (options.filled !== undefined) store.setFilled(options.filled);
  return null;
};

const coloursStep: ViewStep = (patch) => {
  const { colours } = patch;
  if (!colours) return null;
  const size = currentTarget()?.bank.slots.length ?? 256;
  for (const slot of COLOUR_SLOTS) {
    const index = colours[slot];
    if (index !== undefined && index >= size) return viewFail(`The palette has ${size} colours, so ${slot} cannot be ${index}.`, `colours.${slot}`);
  }
  const store = useToolStore.getState();
  for (const slot of COLOUR_SLOTS) {
    const index = colours[slot];
    if (index !== undefined) store.setColour(slot, index);
  }
  return null;
};

const symmetryStep: ViewStep = (patch) => {
  const { symmetry } = patch;
  if (!symmetry) return null;
  const store = useToolStore.getState();
  if (symmetry.x !== undefined && symmetry.x !== store.symmetryX) store.toggleSymmetry('x');
  if (symmetry.y !== undefined && symmetry.y !== useToolStore.getState().symmetryY) store.toggleSymmetry('y');
  if (symmetry.axisX !== undefined) store.setAxis('x', symmetry.axisX);
  if (symmetry.axisY !== undefined) store.setAxis('y', symmetry.axisY);
  return null;
};

export { coloursStep, selectStep, symmetryStep, toolStep };
