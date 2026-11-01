/* @layer renderer-app @kind types */
import type { ImportPlan } from './palette-import.type';

type PastePlan = { ok: true; plan: ImportPlan } | { ok: false; message: string };

export type { PastePlan };
