/* @layer renderer-app @kind logic */
import type { AnimationFacts, CurrentManager } from './manager.type';

const pickedAnimations = (manager: Pick<CurrentManager, 'animations' | 'picked'>): AnimationFacts[] =>
  manager.animations.filter((fact) => manager.picked.includes(fact.key));

export { pickedAnimations };
