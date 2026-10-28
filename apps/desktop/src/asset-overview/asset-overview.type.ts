/* @layer renderer-app @kind types */
import type { AssetKey } from '@bxel/document';
import type { RgbaImage } from '@bxel/formats';
import type { AssetFocus } from '../asset-config/asset-config.type';

type PreviewFrame = {
  readonly id: string;
  readonly image: RgbaImage;
  readonly durationMs: number;
};

type PreviewColour = {
  readonly id: string;
  readonly rgb: string;
  readonly name: string;
  readonly transparent: boolean;
};

type OverviewPreview =
  | { readonly kind: 'frames'; readonly frames: readonly PreviewFrame[] }
  | { readonly kind: 'image'; readonly image: RgbaImage }
  | { readonly kind: 'swatches'; readonly colours: readonly PreviewColour[] }
  | { readonly kind: 'none' };

type OverviewFact = { readonly label: string; readonly value: string };

type LinkRelation = 'uses' | 'usedBy';

type OverviewLink = {
  readonly key: AssetKey;
  readonly name: string;
  readonly kindLabel: string;
  readonly relation: LinkRelation;
};

type FileFacts = {
  readonly path: string | null;
  readonly size: number | null;
  readonly modified: number | null;
};

type FileStat = { readonly size: number; readonly modified: number };

type FileFound = { readonly path: string; readonly stat: FileStat | null };

type OverviewModel = {
  readonly focus: AssetFocus;
  readonly name: string;
  readonly kindLabel: string;
  readonly preview: OverviewPreview;
  readonly facts: readonly OverviewFact[];
  readonly links: readonly OverviewLink[];
  readonly rename: (name: string) => string | null;
};

export type { FileFacts, FileFound, FileStat, LinkRelation, OverviewFact, OverviewLink, OverviewModel, OverviewPreview, PreviewColour, PreviewFrame };
