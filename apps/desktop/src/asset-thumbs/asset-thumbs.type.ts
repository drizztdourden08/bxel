/* @layer renderer-app @kind types */
import type { Artwork, AssetKey } from '@bxel/document';

type ThumbJob = () => Promise<string | null> | string | null;

type ThumbEntry = {
  readonly signature: string;
  readonly url: string | null;
  readonly settled: boolean;
};

type ThumbRequest = {
  readonly key: string;
  readonly signature: string;
  readonly job: ThumbJob;
};

type ThumbStore = {
  readonly subscribe: (listener: () => void) => () => void;
  readonly read: (key: string) => ThumbEntry | undefined;
  readonly request: (request: ThumbRequest) => void;
  readonly setArtwork: (artwork: Artwork | undefined) => void;
  readonly artwork: () => Artwork | undefined;
};

type ThumbTarget = {
  readonly key: string;
  readonly kind: AssetKey['kind'] | 'image' | 'other' | 'legacy' | 'project';
  readonly assetId: string | null;
  readonly path: string;
  readonly modified: number;
  readonly size: number;
  readonly loaded: boolean;
};

export type { ThumbEntry, ThumbJob, ThumbRequest, ThumbStore, ThumbTarget };
