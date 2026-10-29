/* @layer renderer-app @kind logic */
import { tokensOf } from './tokens-of';

const hasToken = (text: string, token: string): boolean => tokensOf(text).some((each) => each.toLowerCase() === token.toLowerCase());

export { hasToken };
