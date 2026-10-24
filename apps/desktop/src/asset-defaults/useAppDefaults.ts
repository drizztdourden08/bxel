/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import type { AssetDefaults } from '@bxel/project';
import { useMemo } from 'react';
import type { AppSettings } from '../settings.type';
import { appAssetDefaults } from './app-asset-defaults';

const useAppDefaults = (): AssetDefaults => {
  const { settings } = useSettings<AppSettings>();
  return useMemo(() => appAssetDefaults(settings.assetDefaults), [settings.assetDefaults]);
};

export { useAppDefaults };
