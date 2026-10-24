/* @layer renderer-app @kind component */
import { Button, Icon } from '@drizztdourden08/tessera';
import { openAssetSettings } from '../../../config-entry/open-asset-settings';
import { ActionHint } from '../../ActionHint';
import { CONFIG_HINT } from '../PalettePanel.constants';

const ConfigButton = () => (
  <ActionHint hint={CONFIG_HINT} placement="bottom">
    <Button size="xs" variant="tertiary" icon={<Icon name="settings" size={14} />} onClick={() => openAssetSettings('palette')}>
      {CONFIG_HINT.name}
    </Button>
  </ActionHint>
);

export { ConfigButton };
