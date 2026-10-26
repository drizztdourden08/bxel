/* @layer renderer-app @kind constants */
import { COMMAND_NAME } from '@bxel/document';
import type { Animation } from '@bxel/document';
import { ASSET_LABEL } from './asset-config.constants';
import type { AssetFields, AssetFocus, AssetOutcome } from './asset-config.type';
import { focusAssetOf } from './focus-asset-of';
import { runField } from './run-field';

const REPEAT_LIMIT = 255;

const animationOf = (focus: AssetFocus): Animation | undefined => focusAssetOf(focus, 'animation');

const update = (focus: AssetFocus, label: string, options: object): AssetOutcome => {
  const animation = animationOf(focus);
  if (!animation) return null;
  return runField(focus, label, [{ name: COMMAND_NAME.animationUpdate, targets: null, options: { animation: animation.id, ...options } }]);
};

const whole = (value: unknown): number | null => (typeof value === 'number' && Number.isInteger(value) ? value : null);

const half = (value: unknown): number | null => (typeof value === 'number' && Number.isFinite(value) ? Math.round(value * 2) : null);

const sizeTo = (focus: AssetFocus, key: 'width' | 'height', value: unknown): AssetOutcome => {
  const next = whole(value);
  const animation = animationOf(focus);
  return next === null || !animation || next === animation[key] ? null : update(focus, ASSET_LABEL.animationSize, { [key]: next });
};

const anchorTo = (focus: AssetFocus, key: 'x2' | 'y2', value: unknown): AssetOutcome => {
  const next = half(value);
  const animation = animationOf(focus);
  if (next === null || !animation || next === animation.anchor[key]) return null;
  return update(focus, ASSET_LABEL.anchor, { anchor: { ...animation.anchor, [key]: next } });
};

const loopDirection = (focus: AssetFocus, value: unknown): AssetOutcome =>
  typeof value === 'string' ? update(focus, ASSET_LABEL.loop, { loopDirection: value }) : null;

const loopRepeat = (focus: AssetFocus, value: unknown): AssetOutcome => {
  const next = whole(value);
  return next === null || next < 0 || next > REPEAT_LIMIT ? null : update(focus, ASSET_LABEL.loop, { loopRepeat: next });
};

const ANIMATION_FIELDS: AssetFields = {
  'animation.name': {
    read: (focus) => animationOf(focus)?.name ?? '',
    write: (focus, value) => (typeof value === 'string' ? update(focus, ASSET_LABEL.rename, { name: value.trim() }) : null),
    buffered: true,
  },
  'animation.width': { read: (focus) => animationOf(focus)?.width ?? 0, write: (focus, value) => sizeTo(focus, 'width', value), buffered: true },
  'animation.height': { read: (focus) => animationOf(focus)?.height ?? 0, write: (focus, value) => sizeTo(focus, 'height', value), buffered: true },
  'animation.anchorX': { read: (focus) => (animationOf(focus)?.anchor.x2 ?? 0) / 2, write: (focus, value) => anchorTo(focus, 'x2', value), buffered: true },
  'animation.anchorY': { read: (focus) => (animationOf(focus)?.anchor.y2 ?? 0) / 2, write: (focus, value) => anchorTo(focus, 'y2', value), buffered: true },
  'animation.loopDirection': { read: (focus) => animationOf(focus)?.loop.direction ?? 'forward', write: loopDirection },
  'animation.loopRepeat': { read: (focus) => animationOf(focus)?.loop.repeat ?? 0, write: loopRepeat, buffered: true },
};

export { ANIMATION_FIELDS };
