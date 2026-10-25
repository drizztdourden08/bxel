/* @layer renderer-app @kind logic */
import { resolveLinkPath } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { isSamePath } from '@bxel/project';
import { assetKeys } from './asset-keys';
import type { FileReport } from './workspace.type';

const keepMissingLinks = (paths: Map<string, string>, reports: readonly FileReport[], artwork: Artwork): void => {
  const present = new Set(assetKeys(artwork).map((key) => key.id));
  for (const { path, report } of reports) {
    for (const link of report.missingLinks) {
      const target = resolveLinkPath(path, link.path);
      const held = [...paths.values()].some((known) => isSamePath(known, target));
      if (!paths.has(link.id) && present.has(link.id) && !held) paths.set(link.id, target);
    }
  }
};

export { keepMissingLinks };
