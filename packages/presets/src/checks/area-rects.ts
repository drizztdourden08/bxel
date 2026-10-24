/* @layer core @kind logic */
import type { AreaRect } from '../model/area.type';
import type { AreaRule } from '../model/preset.type';
import type { SpriteSize } from '../model/sprite-size.type';

const areaRects = (size: SpriteSize, rule: AreaRule): AreaRect[] => {
  const columns = Math.ceil(size.width / rule.width);
  const rows = Math.ceil(size.height / rule.height);
  return Array.from({ length: columns * rows }, (_unused, cell) => {
    const x = (cell % columns) * rule.width;
    const y = Math.floor(cell / columns) * rule.height;
    return {
      x,
      y,
      width: Math.min(rule.width, size.width - x),
      height: Math.min(rule.height, size.height - y),
    };
  });
};

export { areaRects };
