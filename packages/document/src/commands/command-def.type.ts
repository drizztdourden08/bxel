/* @layer core @kind types */
import type { z } from 'zod';
import type { Draft } from '../draft/draft.type';
import type { SpriteId } from '../model/ids.type';
import type { ResolvedCel } from '../scope/resolved-scope.type';
import type { CommandName } from './transaction.type';

type CommandScope = 'none' | 'sprite' | 'sprites' | 'cels';
type LinkedCels = 'refuse' | 'allow';

type CommandInput<O = unknown> = {
  readonly options: O;
  readonly step: number;
  readonly ref: string | undefined;
  readonly sprites: readonly SpriteId[];
  readonly cels: readonly ResolvedCel[];
};

type CommandDef = {
  readonly name: CommandName;
  readonly scope: CommandScope;
  readonly linked: LinkedCels;
  readonly schema: z.ZodType;
  readonly run: (draft: Draft, input: CommandInput) => void;
};

type CommandSpec<S extends z.ZodType> = {
  readonly name: CommandName;
  readonly scope: CommandScope;
  readonly linked?: LinkedCels;
  readonly schema: S;
  readonly run: (draft: Draft, input: CommandInput<z.output<S>>) => void;
};

export type { CommandDef, CommandInput, CommandScope, CommandSpec, LinkedCels };
