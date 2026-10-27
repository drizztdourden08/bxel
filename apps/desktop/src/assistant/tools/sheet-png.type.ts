/* @layer renderer-app @kind types */
import type { Artwork } from '@bxel/document';

type SheetPicture = {
  readonly artwork: Artwork;
  readonly revision: number;
  readonly sheetId: string;
  readonly scale: number;
  readonly hidden: ReadonlySet<string>;
};

export type { SheetPicture };
