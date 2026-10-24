/* @layer renderer-app @kind constants */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, SpriteId } from '@bxel/document';
import { TRANSFORM_COMMAND } from '@bxel/raster';
import { idRef } from '../timeline/id-ref';
import { spritesTarget } from '../sheet/sprites-target';
import { ASSET_LABEL } from './asset-config.constants';
import type { AssetFields, AssetFocus, AssetOutcome } from './asset-config.type';
import { focusAssetOf } from './focus-asset-of';
import { gridEdit } from './grid-edit';
import type { GridCell } from './grid-edit.type';
import { runField } from './run-field';

const spriteOf = (focus: AssetFocus) => focusAssetOf(focus, 'sprite');

const stepFor = (focus: AssetFocus, name: string, options: unknown): CommandStep => ({
  name,
  targets: spritesTarget([focus.key.id as SpriteId]),
  options,
});

const whole = (value: unknown): number | null => (typeof value === 'number' && Number.isInteger(value) ? value : null);

const half = (value: unknown): number | null => (typeof value === 'number' && Number.isFinite(value) ? Math.round(value * 2) : null);

const rename = (focus: AssetFocus, value: unknown): AssetOutcome =>
  typeof value === 'string' ? runField(focus, ASSET_LABEL.rename, [stepFor(focus, COMMAND_NAME.spriteUpdate, { name: value.trim() })]) : null;

const resizeTo = (focus: AssetFocus, size: { width: number | null; height: number | null }): AssetOutcome => {
  const sprite = spriteOf(focus);
  const width = size.width ?? sprite?.width;
  const height = size.height ?? sprite?.height;
  if (!sprite || width === undefined || height === undefined || (width === sprite.width && height === sprite.height)) return null;
  return runField(focus, ASSET_LABEL.resize, [stepFor(focus, TRANSFORM_COMMAND.spriteResize, { width, height })]);
};

const pivotTo = (focus: AssetFocus, at: { x2?: number | null; y2?: number | null }): AssetOutcome => {
  const sprite = spriteOf(focus);
  if (!sprite) return null;
  const pivot = { x2: at.x2 ?? sprite.pivot.x2, y2: at.y2 ?? sprite.pivot.y2 };
  if (pivot.x2 === sprite.pivot.x2 && pivot.y2 === sprite.pivot.y2) return null;
  return runField(focus, ASSET_LABEL.pivot, [stepFor(focus, COMMAND_NAME.spriteUpdate, { pivot })]);
};

const gridTo = (focus: AssetFocus, cell: GridCell): AssetOutcome => {
  const sprite = spriteOf(focus);
  const pixelGrid = sprite ? gridEdit(sprite, cell) : undefined;
  return pixelGrid === undefined ? null : runField(focus, ASSET_LABEL.pixelGrid, [stepFor(focus, COMMAND_NAME.spriteUpdate, { pixelGrid })]);
};

const frameTime = (focus: AssetFocus, value: unknown): AssetOutcome => {
  const sprite = spriteOf(focus);
  const durationMs = whole(value);
  if (!sprite || durationMs === null) return null;
  const steps = sprite.frames
    .filter((frame) => frame.durationMs !== durationMs)
    .map((frame) => stepFor(focus, COMMAND_NAME.frameUpdate, { frame: idRef(frame.id), durationMs }));
  return runField(focus, ASSET_LABEL.frameTime, steps);
};

const SPRITE_FIELDS: AssetFields = {
  'sprite.name': { read: (focus) => spriteOf(focus)?.name ?? '', write: rename, buffered: true },
  'sprite.width': { read: (focus) => spriteOf(focus)?.width ?? 0, write: (focus, value) => resizeTo(focus, { width: whole(value), height: null }), buffered: true },
  'sprite.height': { read: (focus) => spriteOf(focus)?.height ?? 0, write: (focus, value) => resizeTo(focus, { width: null, height: whole(value) }), buffered: true },
  'sprite.pivotX': { read: (focus) => (spriteOf(focus)?.pivot.x2 ?? 0) / 2, write: (focus, value) => pivotTo(focus, { x2: half(value) }), buffered: true },
  'sprite.pivotY': { read: (focus) => (spriteOf(focus)?.pivot.y2 ?? 0) / 2, write: (focus, value) => pivotTo(focus, { y2: half(value) }), buffered: true },
  'sprite.gridWidth': { read: (focus) => spriteOf(focus)?.pixelGrid?.width ?? 1, write: (focus, value) => gridTo(focus, { width: whole(value) }), buffered: true },
  'sprite.gridHeight': { read: (focus) => spriteOf(focus)?.pixelGrid?.height ?? 1, write: (focus, value) => gridTo(focus, { height: whole(value) }), buffered: true },
  'sprite.frameMs': { read: (focus) => spriteOf(focus)?.frames[0]?.durationMs ?? 0, write: frameTime, buffered: true },
};

export { SPRITE_FIELDS };
