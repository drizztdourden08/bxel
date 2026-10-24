/* @layer renderer-app @kind constants */
import type { RadioOption } from '@drizztdourden08/tessera';
import { SPLIT_TEXT } from '../../workspace/workspace.constants';
import type { SplitDestination } from '../../workspace/workspace.type';

const DESTINATIONS: RadioOption<SplitDestination>[] = [
  { value: 'beside', label: SPLIT_TEXT.beside },
  { value: 'project', label: SPLIT_TEXT.project },
];

export { DESTINATIONS };
