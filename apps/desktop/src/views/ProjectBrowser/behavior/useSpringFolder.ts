/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { SPRING_OPEN_MS } from '../ProjectBrowser.constants';

const useSpringFolder = (folder: string | null, hovering: boolean): void => {
  useEffect(() => {
    if (!hovering || folder === null) return undefined;
    const timer = setTimeout(() => useBrowserStore.getState().goTo(folder), SPRING_OPEN_MS);
    return () => clearTimeout(timer);
  }, [folder, hovering]);
};

export { useSpringFolder };
