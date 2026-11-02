/* @layer renderer-app @kind logic */
import { magnifyChoices } from './magnify-choices';
import { DEFAULT_ALGORITHM, MAGNIFY_ALGORITHMS } from './transform.constants';
import type { TransformSpec } from './transform.type';

const settleAlgorithm = (spec: TransformSpec): TransformSpec => {
  const magnifier = MAGNIFY_ALGORITHMS.includes(spec.algorithm);
  if (!magnifier || magnifyChoices(spec).includes(spec.algorithm)) return spec;
  return { ...spec, algorithm: DEFAULT_ALGORITHM };
};

export { settleAlgorithm };
