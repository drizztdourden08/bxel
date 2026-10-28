/* @layer renderer-app @kind component */
import { commands } from '@drizztdourden08/brock-react';
import { Button, EmptyState, Flex, Icon } from '@drizztdourden08/tessera';
import { FILE_COMMAND } from '../../../files/files.constants';
import { DIALOG_COMMAND } from '../../../keymap/dialog-command-id.constants';
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';

const NoPalette = () => (
  <EmptyState
    size="sm"
    icon={<Icon name="pixel-palette" size={20} />}
    message={PALETTE_PANEL_TEXT.empty}
    hint={PALETTE_PANEL_TEXT.emptyHint}
    action={
      <Flex gap="xs" justify="center">
        <Button size="sm" variant="secondary" onClick={() => commands.run(FILE_COMMAND.open)}>
          {PALETTE_PANEL_TEXT.open}
        </Button>
        <Button size="sm" variant="primary" onClick={() => commands.run(DIALOG_COMMAND.newSprite)}>
          {PALETTE_PANEL_TEXT.create}
        </Button>
      </Flex>
    }
  />
);

export { NoPalette };
