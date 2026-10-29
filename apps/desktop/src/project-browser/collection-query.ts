/* @layer renderer-app @kind logic */
import { quotedToken } from './quoted-token';

const collectionQuery = (name: string): string => `collection:${quotedToken(name)}`;

export { collectionQuery };
