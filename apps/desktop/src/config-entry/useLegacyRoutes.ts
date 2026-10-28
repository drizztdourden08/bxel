/* @layer renderer-app @kind hook */
import { routeAliases } from '@drizztdourden08/brock-react';
import { useEffect } from 'react';
import { LEGACY_ROUTES } from './config-entry.constants';

const useLegacyRoutes = (): void => {
  useEffect(() => {
    const stops = Object.entries(LEGACY_ROUTES).map(([old, current]) => routeAliases.add(old, (params) => ({ active: current, params })));
    return () => {
      for (const stop of stops) stop();
    };
  }, []);
};

export { useLegacyRoutes };
