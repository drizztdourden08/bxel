/* @layer renderer-app @kind logic */
import { TEXT_DIGITS } from './ruler.constants';

const tickText = (value: number, suffix: string): string => `${Number(value.toFixed(TEXT_DIGITS))}${suffix}`;

export { tickText };
