/* @layer renderer-app @kind hook */
import { getPlatform } from '@drizztdourden08/brock-react';
import { useEffect } from 'react';
import { refreshSystemClip } from '../editor/selection/refresh-system-clip';

const useSystemClipWatch = (): void => {
  useEffect(() => {
    void refreshSystemClip();
    const refresh = (): void => void refreshSystemClip();
    window.addEventListener('focus', refresh);
    const stop = getPlatform().clipboard?.onChange(refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      stop?.();
    };
  }, []);
};

export { useSystemClipWatch };
