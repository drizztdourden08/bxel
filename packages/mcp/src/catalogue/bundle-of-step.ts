/* @layer core @kind logic */
import type { BundleId } from './catalogue.type';
import { STEP_BUNDLE } from './step-bundle.constants';

const bundleOfStep = (name: unknown): BundleId | null => {
  if (typeof name !== 'string') return null;
  const prefix = name.split('.')[0] ?? '';
  return Object.hasOwn(STEP_BUNDLE, prefix) ? (STEP_BUNDLE[prefix] ?? null) : null;
};

export { bundleOfStep };
