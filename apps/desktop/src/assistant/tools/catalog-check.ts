/* @layer renderer-app @kind logic */
import type { CatalogControl } from '@drizztdourden08/brock-react';

const rangeProblem = (control: CatalogControl, value: unknown): string | null => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'The value must be a number.';
  if (control.min !== undefined && value < control.min) return `The value must be at least ${control.min}.`;
  return control.max !== undefined && value > control.max ? `The value must be at most ${control.max}.` : null;
};

const choiceProblem = (control: CatalogControl, value: unknown): string | null => {
  const choices = control.choices ?? [];
  if (choices.length === 0) return null;
  const found = choices.find((choice) => choice.value === value);
  return found === undefined ? `The value must be one of: ${choices.map((choice) => choice.value).join(', ')}.` : null;
};

const catalogCheck = (control: CatalogControl, value: unknown): string | null => {
  if (control.kind === 'toggle') return typeof value === 'boolean' ? null : 'The value must be true or false.';
  if (control.kind === 'number' || control.kind === 'range') return rangeProblem(control, value);
  if (control.kind === 'text') return typeof value === 'string' ? null : 'The value must be a string.';
  return choiceProblem(control, value);
};

export { catalogCheck };
