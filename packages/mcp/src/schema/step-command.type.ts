/* @layer core @kind types */
import type { z } from 'zod';

type StepCommand = {
  readonly name: string;
  readonly scope?: 'none' | 'sprite' | 'sprites' | 'cels';
  readonly schema: z.ZodType;
  readonly wire?: z.ZodType;
};

export type { StepCommand };
