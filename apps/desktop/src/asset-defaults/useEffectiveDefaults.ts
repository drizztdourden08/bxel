/* @layer renderer-app @kind hook */
import { resolveDefaults } from '@bxel/project';
import type { AssetDefaults } from '@bxel/project';
import { useMemo } from 'react';
import { useProjectStore } from '../stores/useProjectStore';
import { useAppDefaults } from './useAppDefaults';

const useEffectiveDefaults = (): AssetDefaults => {
  const app = useAppDefaults();
  const project = useProjectStore((state) => state.project?.manifest.defaults);
  return useMemo(() => resolveDefaults(app, project ?? {}), [app, project]);
};

export { useEffectiveDefaults };
