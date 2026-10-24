/* @layer renderer-app @kind types */
import type { ElectronApplication, Page } from 'playwright-core';

type Session = {
  readonly app: ElectronApplication;
  readonly page: Page;
  readonly dir: string;
  readonly close: () => Promise<void>;
};

type Cell = { readonly x: number; readonly y: number };

type SpriteSize = { readonly width: number; readonly height: number };

type CellMapper = (cell: Cell) => Cell;

type DialogAnswers = { readonly open: string | null; readonly save: string | null };

type Swatches = readonly (string | null)[];

export type { Cell, CellMapper, DialogAnswers, Session, SpriteSize, Swatches };
