/* @layer renderer-app @kind logic */
import type { ToolPreset } from './tool-preset.type';

const moveItem = (list: readonly ToolPreset[], id: string, delta: number): ToolPreset[] => {
  const from = list.findIndex((each) => each.id === id);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= list.length) return [...list];
  const next = [...list];
  const [item] = next.splice(from, 1);
  if (item) next.splice(to, 0, item);
  return next;
};

export { moveItem };
