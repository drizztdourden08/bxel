/* @layer core @kind logic */
import { BUNDLE_IDS } from '../catalogue/bundle.constants';
import type { BundleId, Level } from '../catalogue/catalogue.type';
import { LEVEL_SCHEMA, STORED_GRANT_SCHEMA, TOOL_ROW_IDS } from './grant-schema.constants';
import type { Grant } from './grant.type';

const levelOf = (raw: unknown, fallback: Level | null): Level | null => {
  const parsed = LEVEL_SCHEMA.safeParse(raw);
  return parsed.success ? parsed.data : fallback;
};

const readGrant = (raw: unknown): Grant | null => {
  const parsed = STORED_GRANT_SCHEMA.safeParse(raw);
  if (!parsed.success) return null;
  const { blocked, bundles, tools, special } = parsed.data;
  const toolEntries = TOOL_ROW_IDS.flatMap((id) => {
    const level = levelOf(tools[id], null);
    return level === null ? [] : [[id, level] as const];
  });
  return {
    v: 1,
    blocked,
    bundles: Object.fromEntries(BUNDLE_IDS.map((id) => [id, levelOf(bundles[id], 'read')])) as Record<BundleId, Level>,
    tools: Object.fromEntries(toolEntries),
    special,
  };
};

export { readGrant };
