/* @layer renderer-app @kind logic */
import { tokensOf } from './tokens-of';

const withoutToken = (text: string, token: string): string => tokensOf(text).filter((each) => each.toLowerCase() !== token.toLowerCase()).join(' ');

export { withoutToken };
