/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { rowText } from './row-text';

const readRow = (): void => announce(rowText());

export { readRow };
