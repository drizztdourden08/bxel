/* @layer renderer-app @kind logic */
import type { BundleId } from '@bxel/mcp';
import type { CommandEffect, ManifestEntry, ManifestExtra } from './manifest.type';
import { rows } from './manifest-rows';

const one = (id: string, area: BundleId, effect: CommandEffect, extra: ManifestExtra = {}): [string, ManifestEntry] => rows(area, effect, [id], extra)[0] as [string, ManifestEntry];

export { one };
