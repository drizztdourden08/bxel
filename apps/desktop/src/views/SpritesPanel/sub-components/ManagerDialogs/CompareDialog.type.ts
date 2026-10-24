/* @layer renderer-app @kind types */
import type { Artwork, Sprite } from '@bxel/document';
import type { SpriteComparison } from '../../../../sheet-manager/identical.type';

interface CompareSideProps {
  artwork: Artwork;
  sprite: Sprite;
}

interface CompareDiffProps {
  artwork: Artwork;
  first: Sprite;
  second: Sprite;
}

interface CompareVerdictProps {
  comparison: SpriteComparison;
  first: Sprite;
  second: Sprite;
}

export type { CompareDiffProps, CompareSideProps, CompareVerdictProps };
