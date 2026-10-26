/* @layer renderer-app @kind component */
import { SettingsLayout, useSettings } from '@drizztdourden08/brock-react';
import { renderConfigControl } from '../../config-source/render-config-control';
import { DEFAULT_SETTINGS } from '../../settings.constants';
import type { AppSettings } from '../../settings.type';
import type { SettingsSplitProps } from './SettingsSplit.type';

const SettingsSplit = ({ sections, preview }: SettingsSplitProps) => {
  const { settings, patch } = useSettings<AppSettings>();
  return <SettingsLayout sections={sections} settings={settings} defaults={DEFAULT_SETTINGS} onChange={patch} renderControl={renderConfigControl} preview={preview} />;
};

export { SettingsSplit };
