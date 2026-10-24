/* @layer renderer-app @kind logic */
import type { HintSpec } from '../ActionHint.type';

const hintOf = (spec: HintSpec): { label: string; description: string } => ({ label: spec.name, description: spec.description });

export { hintOf };
