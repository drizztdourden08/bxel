/* @layer core @kind logic */
import { LOAD_ERROR } from '../load-error.constants';
import type { LoadIssue } from '../load-report.type';
import { makeIssue } from '../make-issue';
import type { AssetManifest } from './asset-manifest.type';
import type { TilesetFileJson } from './tileset-file.type';

const tilesetAnimationIssues = (file: TilesetFileJson, manifest: AssetManifest): readonly LoadIssue[] => {
  const linked = new Set(manifest.links.map((link) => link.id));
  return file.tileset.tiles.flatMap((tile, index) =>
    !tile.animation || linked.has(tile.animation.animationId)
      ? []
      : [
          makeIssue(
            LOAD_ERROR.REFERENCE_BROKEN,
            `Tile ${tile.key} plays animation ${tile.animation.animationId}, which the tileset does not link.`,
            `$.tileset.tiles[${index}].animation`,
          ),
        ],
  );
};

export { tilesetAnimationIssues };
