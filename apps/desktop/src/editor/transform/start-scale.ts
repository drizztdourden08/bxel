/* @layer renderer-app @kind logic */
import { startTransform } from './start-transform';

const startScale = (): boolean => startTransform('width');

export { startScale };
