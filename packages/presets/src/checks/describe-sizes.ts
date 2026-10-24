/* @layer core @kind logic */
import type { SizePair, SpriteSizeRule } from '../model/preset.type';

const label = (pair: SizePair): string => `${String(pair[0])}x${String(pair[1])}`;

const describeSizes = (rule: SpriteSizeRule): string[] => {
  switch (rule.kind) {
    case 'any':
      return ['any size'];
    case 'list':
      return rule.sizes.map(label);
    case 'groups':
      return rule.groups.map((group) => group.map(label).join(' with '));
    case 'steps':
      return [
        `multiples of ${label([rule.stepW, rule.stepH])} up to ${label([rule.maxW, rule.maxH])}`,
      ];
  }
};

export { describeSizes };
