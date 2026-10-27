/* @layer renderer-app @kind logic */
import { ID_ALPHABET } from '@bxel/document';
import { toSlashes } from '../../workspace/to-slashes';
import { RECENT_ID_LENGTH } from './tools.constants';

const recentIdOf = (path: string): string => {
  let first = 0x811c9dc5;
  let second = 0x01000193;
  for (const char of toSlashes(path).toLowerCase()) {
    const code = char.codePointAt(0) ?? 0;
    first = Math.imul(first ^ code, 0x01000193) >>> 0;
    second = Math.imul(second ^ code, 0x5bd1e995) >>> 0;
  }
  let body = '';
  for (let at = 0; at < RECENT_ID_LENGTH; at += 1) {
    const source = at % 2 === 0 ? first : second;
    body += ID_ALPHABET.charAt((source >>> ((at >> 1) * 5)) & 31);
  }
  return `rcf_${body}`;
};

export { recentIdOf };
