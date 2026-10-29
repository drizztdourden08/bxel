/* @layer renderer-app @kind logic */
import { quotedToken } from './quoted-token';

const tagQuery = (tag: string): string => `tag:${quotedToken(tag)}`;

export { tagQuery };
