/* @layer renderer-app @kind component */
import { Button, Icon } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { ActionHint } from '../ActionHint';
import { PALETTE_SETTINGS_TEXT, SETTINGS_HINT } from './PaletteSettings.constants';
import { SettingsDialog } from './sub-components/SettingsDialog';

const PaletteSettings = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ActionHint hint={SETTINGS_HINT} placement="bottom">
        <Button size="xs" variant="tertiary" icon={<Icon name="settings" size={14} />} aria-haspopup="dialog" onClick={() => setOpen(true)}>
          {PALETTE_SETTINGS_TEXT.open}
        </Button>
      </ActionHint>
      {open && <SettingsDialog onClose={() => setOpen(false)} />}
    </>
  );
};

export { PaletteSettings };
