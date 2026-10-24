/* @layer renderer-app @kind logic */
import type { TerrainRules } from '@bxel/document';

const assignSlot = (rules: TerrainRules, index: number, key: number): TerrainRules => {
  const next = rules.keys[index] === key ? 0 : key;
  return { kind: rules.kind, keys: rules.keys.map((each, at) => (at === index ? next : each)) };
};

export { assignSlot };
