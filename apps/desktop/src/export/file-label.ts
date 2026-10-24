/* @layer renderer-app @kind logic */
import type { LabelParts } from './export.type';
import { fillTemplate } from './fill-template';
import { safeName } from './safe-name';

const joined = ({ base, target, count, extra }: LabelParts): string => {
  const parts = [base];
  if (count > 1) parts.push(safeName(target.sprite.name));
  if (extra !== null) parts.push(extra);
  return parts.join('_');
};

const fileLabel = (label: LabelParts): string => {
  if (label.template === '') return joined(label);
  const filled = fillTemplate(label.template, { name: label.base, sprite: safeName(label.target.sprite.name), frame: label.extra ?? '' });
  return filled === '' ? joined(label) : filled;
};

export { fileLabel };
