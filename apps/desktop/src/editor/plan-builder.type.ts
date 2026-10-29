/* @layer renderer-app @kind types */
import type { ColourSlot, PressEvent, PressPlan } from './press-plan.type';

type PlanBuilder = (slot: ColourSlot, event: PressEvent) => PressPlan;

export type { PlanBuilder };
