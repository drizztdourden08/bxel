/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { PickInput, PickResult } from './sheet.type';

const rangeBetween = (order: readonly SpriteId[], from: SpriteId, to: SpriteId): SpriteId[] => {
  const start = order.indexOf(from);
  const end = order.indexOf(to);
  if (start < 0 || end < 0) return [to];
  return order.slice(Math.min(start, end), Math.max(start, end) + 1);
};

const toggled = (input: PickInput): PickResult => {
  const { selected, id, active } = input;
  if (!selected.includes(id)) return { selected: [...selected, id], anchor: id, active: id };
  const rest = selected.filter((each) => each !== id);
  const last = rest.at(-1) ?? null;
  return { selected: rest, anchor: last, active: active === id ? (last ?? active) : active };
};

const pickSprite = (input: PickInput): PickResult => {
  const { how, id, order } = input;
  if (how === 'toggle') return toggled(input);
  if (how === 'range') {
    const from = input.anchor ?? input.active ?? id;
    return { selected: rangeBetween(order, from, id), anchor: from, active: id };
  }
  return { selected: [id], anchor: id, active: id };
};

export { pickSprite };
