/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { ChoiceHint, HintSpec } from '../ActionHint.type';

const useChoiceHint = (specs: readonly HintSpec[]): ChoiceHint => {
  const [shown, setShown] = useState<{ label: string } | null>(null);
  const spec = shown === null ? undefined : specs.find((each) => each.name === shown.label);
  return { spec, onHint: setShown };
};

export { useChoiceHint };
