/* @layer renderer-app @kind logic */
import type { GuideDrag, GuideLines } from '../../../guides/guide.type';

const shownGuides = (guides: GuideLines | undefined, drag: GuideDrag | null): { x: number[]; y: number[] } => {
  const lines = { x: [...(guides?.x ?? [])], y: [...(guides?.y ?? [])] };
  if (!drag) return lines;
  const line = lines[drag.axis];
  const kept = line.filter((at) => at !== drag.from);
  if (drag.position !== null) kept.push(drag.position);
  lines[drag.axis] = kept;
  return lines;
};

export { shownGuides };
