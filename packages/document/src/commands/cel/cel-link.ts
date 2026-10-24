/* @layer core @kind logic */
import { celTransferSchema } from '../../schema/cel-transfer-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { linkCel } from './link-cel';
import { transferCels } from './transfer-cels';

const celLink = defineCommand({
  name: COMMAND_NAME.celLink,
  scope: 'sprites',
  schema: celTransferSchema,
  run: (draft, input) => {
    transferCels(draft, input, 'target', linkCel);
  },
});

export { celLink };
