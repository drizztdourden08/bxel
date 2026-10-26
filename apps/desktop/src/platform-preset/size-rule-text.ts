/* @layer renderer-app @kind logic */
import type { SpriteSizeRule } from '@bxel/presets';
import { pairText } from './pair-text';
import { FACT_TEXT } from './preset-facts.constants';

const sizeRuleText = (rule: SpriteSizeRule): string => {
  switch (rule.kind) {
    case 'any':
      return FACT_TEXT.anySize;
    case 'list':
      return rule.sizes.map(pairText).join(', ');
    case 'groups':
      return FACT_TEXT.groups(rule.groups.map((group) => group.map(pairText).join(' and ')).join('; '));
    case 'steps':
      return FACT_TEXT.steps(rule.stepW, rule.stepH, rule.maxW, rule.maxH);
  }
};

export { sizeRuleText };
