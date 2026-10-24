/* @layer core @kind types */
import type { Artwork } from '../model/artwork.type';

type ContainerParts = {
  readonly artwork: Artwork;
  readonly savedAt: number;
  readonly documentBytes: Uint8Array;
  readonly preview: Uint8Array | null;
  readonly blobs: ReadonlyMap<string, Uint8Array>;
};

export type { ContainerParts };
