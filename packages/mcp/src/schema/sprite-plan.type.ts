/* @layer core @kind types */
import type { z } from 'zod';
import type { PLAN_INPUT_SCHEMA, PLAN_RESULT_SCHEMA } from './sprite-plan.constants';

type PlanInput = z.infer<typeof PLAN_INPUT_SCHEMA>;

type PlanResult = z.infer<typeof PLAN_RESULT_SCHEMA>;

type PlanOf<K extends PlanInput['kind']> = Omit<Extract<PlanInput, { kind: K }>, 'kind'>;

export type { PlanInput, PlanOf, PlanResult };
