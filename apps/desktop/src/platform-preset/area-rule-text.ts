/* @layer renderer-app @kind logic */
import type { AreaRule } from '@bxel/presets';
import { FACT_TEXT } from './preset-facts.constants';

const areaRuleText = (rule: AreaRule): string => {
  const what = rule.kind === 'maxColoursPerArea' ? FACT_TEXT.limitedAreas(rule.limit) : FACT_TEXT.areaRules[rule.kind];
  return FACT_TEXT.area(rule.width, rule.height, what, FACT_TEXT.tiers[rule.tier]);
};

export { areaRuleText };
