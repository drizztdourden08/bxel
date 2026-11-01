/* @layer renderer-app @kind logic */
import type { PlanOf } from '@bxel/mcp';
import { COPY_TEXT } from '../../sheet-manager/copy-text.constants';
import { DEFAULT_PATTERN, FIRST_NUMBER } from '../../sheet-manager/manager.constants';
import type { RenameSpec } from '../../sheet-manager/manager.type';
import { definedOnly } from './defined-only';

const renameSpec = (args: PlanOf<'rename'>, copy: boolean): RenameSpec => ({
  pattern: copy ? `{name}${COPY_TEXT.suffix}` : DEFAULT_PATTERN,
  find: '',
  replace: '',
  start: FIRST_NUMBER,
  ...definedOnly({ pattern: args.pattern, find: args.find, replace: args.replace, start: args.start }),
});

export { renameSpec };
