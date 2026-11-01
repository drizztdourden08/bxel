/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { describeText } from './describe-text';

const describeCanvas = (): void => announce(describeText());

export { describeCanvas };
