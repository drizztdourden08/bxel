/* @layer renderer-app @kind component */
import { Icon, IconButton } from '@drizztdourden08/tessera';
import { openAssetSettings } from '../../../config-entry/open-asset-settings';
import { ActionHint } from '../../ActionHint';
import { CONFIG_HINT } from '../PalettePanel.constants';

const ConfigButton = () => (
  <ActionHint hint={CONFIG_HINT} placement="bottom">
    <IconButton label={CONFIG_HINT.name} size="xs" variant="tertiary" onClick={() => openAssetSettings('palette')}>
      <Icon name="settings" size={14} />
    </IconButton>
  </ActionHint>
);

export { ConfigButton };
