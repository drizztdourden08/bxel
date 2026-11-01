/* @layer renderer-app @kind logic */
import { LABEL_PATTERN } from './assistant-presence.constants';

const presenceTextOf = (label: string): string | null => {
  const found = LABEL_PATTERN.exec(label);
  return found === null ? null : `${found[1]}: ${found[2]}`;
};

export { presenceTextOf };
