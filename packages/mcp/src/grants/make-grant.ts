/* @layer core @kind logic */
import { BUNDLE_IDS } from '../catalogue/bundle.constants';
import type { BundleId, Level } from '../catalogue/catalogue.type';
import type { Grant } from './grant.type';

const make = (base: Level, changes: Readonly<Partial<Record<BundleId, Level>>> = {}): Grant => ({
  v: 1,
  blocked: false,
  bundles: Object.fromEntries(BUNDLE_IDS.map((id) => [id, changes[id] ?? base])) as Record<BundleId, Level>,
  tools: {},
  special: { mayRestart: false },
});

export { make };
