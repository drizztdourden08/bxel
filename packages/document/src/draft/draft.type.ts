/* @layer core @kind types */
import type { CommandWarning } from '../commands/result.type';
import type { UndoOp } from '../history/history.type';
import type { IdSource } from '../ids/id-source.type';
import type { BankId, CelId } from '../model/ids.type';
import type { Project } from '../model/project.type';

type Draft = {
  readonly base: Project;
  readonly ids: IdSource;
  readonly created: Record<string, string>;
  readonly warnings: CommandWarning[];
  readonly owned: Map<CelId, Uint8Array>;
  readonly baselines: Map<CelId, Uint8Array>;
  readonly ops: UndoOp[];
  project: Project;
  step: number;
};

type DraftInput = { readonly base: Project; readonly ids: IdSource };

type BankRemap = { readonly bankId: BankId; readonly forward: Uint8Array; readonly inverse: Uint8Array };

export type { BankRemap, Draft, DraftInput };
