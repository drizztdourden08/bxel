/* @layer renderer-app @kind component */
import type { ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { PresetBrowser } from '../../views/PresetBrowser';

const meta: ScreenMeta = { title: 'Platform presets', showHeader: true, icon: 'gamepad-2', order: 4.2, keywords: ['platform', 'preset', 'game boy', 'nes', 'snes', 'rules', 'colours'] };

const searchEntries: SearchEntrySeed[] = [{ label: 'Platform presets', keywords: ['platform', 'preset', 'rules', 'browse'] }];

const PresetsScreen = () => <PresetBrowser />;

export default PresetsScreen;
export { meta, searchEntries };
