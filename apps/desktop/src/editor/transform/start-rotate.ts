/* @layer renderer-app @kind logic */
import { startTransform } from './start-transform';

const startRotate = (): boolean => startTransform('angle');

export { startRotate };
