/* @layer core @kind logic */
import { celTransferSchema } from '../../schema/cel-transfer-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { moveCel } from './move-cel';
import { transferCels } from './transfer-cels';

const celMove = defineCommand({
  name: COMMAND_NAME.celMove,
  scope: 'sprites',
  schema: celTransferSchema,
  run: (draft, input) => {
    transferCels(draft, input, 'both', moveCel);
  },
});

export { celMove };
