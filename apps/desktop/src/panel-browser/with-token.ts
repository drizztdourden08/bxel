/* @layer renderer-app @kind logic */
import { hasToken } from './has-token';

const withToken = (text: string, token: string): string => (hasToken(text, token) ? text : `${text.trim()} ${token}`.trim());

export { withToken };
