/* @layer renderer-app @kind logic */
import type { BundleId } from '@bxel/mcp';
import type { CommandEffect, ManifestEntry, ManifestExtra } from './manifest.type';

const rows = (area: BundleId, effect: CommandEffect, ids: readonly string[], extra: ManifestExtra = {}): [string, ManifestEntry][] =>
  ids.map((id) => [id, { area, effect, args: extra.args ?? null, dialog: extra.dialog ?? null, refuse: extra.refuse ?? null }]);

export { rows };
