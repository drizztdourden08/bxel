/* @layer core @kind logic */
import type { Hood, SlopeRule } from './mmpx.type';

const sharesEdge = (rule: SlopeRule): boolean => rule.x === rule.mate && rule.x !== rule.others[0] && rule.x !== rule.others[1];

const notBrighter = (n: Hood, rule: SlopeRule): boolean => n.luma(n.e) >= n.luma(rule.x) || n.e === rule.corner;

const touchesCorner = (n: Hood, rule: SlopeRule): boolean => rule.reach.includes(n.e);

const notBump = (n: Hood, rule: SlopeRule): boolean =>
  n.luma(n.e) < n.luma(rule.x) || rule.corner !== rule.tail || n.e !== rule.far[0] || n.e !== rule.far[1];

const slopeHolds = (n: Hood, rule: SlopeRule): boolean => sharesEdge(rule) && notBrighter(n, rule) && touchesCorner(n, rule) && notBump(n, rule);

export { slopeHolds };
