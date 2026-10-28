/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { currentMap } from '../tilemap/current-map';
import { feedSize } from './feed-size';
import type { GuideScope } from './guide.type';
import { persistedGuideScope } from './persisted-guide-scope';

const mapGuideScope = (): GuideScope | null => {
  const target = currentMap();
  if (!target) return null;
  const { tilemap, tileset } = target;
  return persistedGuideScope({
    lines: tilemap.guides,
    size: feedSize,
    step: (axis) => (axis === 'x' ? tileset.tileWidth : tileset.tileHeight),
    write: (label, guides) => void runDocument(label, [{ name: COMMAND_NAME.tilemapGuides, targets: null, options: { tilemap: tilemap.id, guides } }]),
  });
};

export { mapGuideScope };
