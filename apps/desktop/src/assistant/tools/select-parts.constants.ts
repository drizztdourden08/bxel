/* @layer renderer-app @kind constants */
import type { AnimFrameId, LayerId, MapLayerId, SpriteId } from '@bxel/document';
import { currentTarget } from '../../editor/current-target';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { useTilemapStore } from '../../stores/useTilemapStore';
import { useTimelineStore } from '../../stores/useTimelineStore';
import { useToolStore } from '../../stores/useToolStore';
import { APP_TOOL_TEXT } from './app-tool.constants';
import type { SelectPart } from './select-parts.type';
import { viewFail } from './view-fail';

const sprite: SelectPart = (select, artwork) => {
  if (select.sprite === undefined) return null;
  if (!artwork.sprites.some((each) => each.id === select.sprite)) return viewFail(APP_TOOL_TEXT.noSprite, 'select.sprite');
  useSpriteStore.getState().setActive(select.sprite as SpriteId);
  useSpriteStore.getState().setSelection([select.sprite as SpriteId], select.sprite as SpriteId);
  return null;
};

const sprites: SelectPart = (select, artwork) => {
  if (select.sprites === undefined) return null;
  const known = new Set(artwork.sprites.map((each) => each.id as string));
  if (select.sprites.some((id) => !known.has(id))) return viewFail(APP_TOOL_TEXT.noSprite, 'select.sprites');
  useSpriteStore.getState().setSelection(select.sprites as SpriteId[], (select.sprites[0] as SpriteId | undefined) ?? null);
  return null;
};

const layer: SelectPart = (select) => {
  if (select.layer === undefined) return null;
  if (!(currentTarget()?.sprite.layers ?? []).some((each) => each.id === select.layer)) return viewFail(APP_TOOL_TEXT.noLayer, 'select.layer');
  useToolStore.getState().setLayer(select.layer as LayerId);
  return null;
};

const timeline: SelectPart = (select) => {
  const first = select.frames?.[0] as AnimFrameId | undefined;
  if (select.frames !== undefined) useTimelineStore.getState().select({ frames: select.frames as AnimFrameId[], anchor: first ?? null }, first ?? null);
  if (select.frame !== undefined) useTimelineStore.getState().setFrame(select.frame as AnimFrameId);
  return null;
};

const tilemap: SelectPart = (select) => {
  if (select.mapLayer !== undefined) useTilemapStore.getState().setLayer(select.mapLayer as MapLayerId);
  if (select.tile !== undefined) useTilemapStore.getState().setStamp({ columns: 1, rows: 1, keys: [select.tile] });
  return null;
};

const SELECT_PARTS: readonly SelectPart[] = [sprite, sprites, layer, timeline, tilemap];

export { SELECT_PARTS };
