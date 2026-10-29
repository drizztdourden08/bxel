/* @layer renderer-app @kind types */
import type { Artwork } from '@bxel/document';
import type { PlannedFile } from '../../export/export.type';

type SheetPicture = {
  readonly artwork: Artwork;
  readonly revision: number;
  readonly sheetId: string;
  readonly scale: number;
  readonly hidden: ReadonlySet<string>;
  readonly exported?: boolean;
};

type SheetFiles = {
  readonly image: PlannedFile;
  readonly json: PlannedFile | undefined;
};

export type { SheetFiles, SheetPicture };
