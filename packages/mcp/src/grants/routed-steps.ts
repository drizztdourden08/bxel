/* @layer core @kind logic */
import { bundleOfStep } from '../catalogue/bundle-of-step';
import { ROUTED_BUNDLES } from '../catalogue/step-bundle.constants';
import type { RoutedStep } from './routed-steps.type';

const fieldOf = (value: unknown, field: string): unknown => (typeof value === 'object' && value !== null ? Reflect.get(value, field) : undefined);

const routedSteps = (input: unknown): readonly RoutedStep[] => {
  const steps = fieldOf(input, 'steps');
  if (!Array.isArray(steps)) return [];
  return (steps as unknown[]).map((step, index) => {
    const raw = fieldOf(step, 'name');
    const name = typeof raw === 'string' ? raw : '';
    const bundle = bundleOfStep(name);
    return { index, name, bundles: bundle === null ? ROUTED_BUNDLES : [bundle] };
  });
};

export { routedSteps };
