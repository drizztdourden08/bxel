/* @layer renderer-app @kind logic */
import type { DrawPlan, PressPlan } from '../../../editor/press-plan.type';

const isDrawPlan = (plan: PressPlan): plan is DrawPlan => plan.kind !== 'zoom' && plan.kind !== 'pick' && plan.kind !== 'fill';

export { isDrawPlan };
