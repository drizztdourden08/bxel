/* @layer core @kind logic */
import type { SizePair, SpriteSizeRule } from '../model/preset.type';

const hasPair = (pairs: readonly SizePair[], width: number, height: number): boolean =>
  pairs.some((pair) => pair[0] === width && pair[1] === height);

const sizeAllowed = (rule: SpriteSizeRule, width: number, height: number): boolean => {
  switch (rule.kind) {
    case 'any':
      return true;
    case 'list':
      return hasPair(rule.sizes, width, height);
    case 'groups':
      return rule.groups.some((group) => hasPair(group, width, height));
    case 'steps':
      return (
        width % rule.stepW === 0 &&
        height % rule.stepH === 0 &&
        width <= rule.maxW &&
        height <= rule.maxH
      );
  }
};

export { sizeAllowed };
