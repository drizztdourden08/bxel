/* @layer renderer-app @kind logic */
import { hasToken } from './has-token';
import { withToken } from './with-token';
import { withoutToken } from './without-token';

const toggledToken = (text: string, token: string): string => (hasToken(text, token) ? withoutToken(text, token) : `${withToken(text, token)} `);

export { toggledToken };
