/* @layer renderer-app @kind component */
import { Button, DialogShell, Stack } from '@drizztdourden08/tessera';
import { PALETTE_SETTINGS_TEXT } from '../PaletteSettings.constants';
import type { SettingsDialogProps } from '../PaletteSettings.type';
import { BankRow } from './BankRow';
import { PlatformRow } from './PlatformRow';
import { SetLoader } from './SetLoader';

const SettingsDialog = ({ onClose }: SettingsDialogProps) => (
  <DialogShell
    open
    title={PALETTE_SETTINGS_TEXT.title}
    onClose={onClose}
    actions={
      <Button variant="primary" onClick={onClose}>
        {PALETTE_SETTINGS_TEXT.close}
      </Button>
    }
  >
    <Stack gap="md">
      <BankRow />
      <SetLoader />
      <PlatformRow />
    </Stack>
  </DialogShell>
);

export { SettingsDialog };
