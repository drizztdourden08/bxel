/* @layer core @kind logic */
import { celTransferSchema } from '../../schema/cel-transfer-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { copyCel } from './copy-cel';
import { transferCels } from './transfer-cels';

const celCopy = defineCommand({
  name: COMMAND_NAME.celCopy,
  scope: 'sprites',
  schema: celTransferSchema,
  run: (draft, input) => {
    transferCels(draft, input, 'target', copyCel);
  },
});

export { celCopy };
