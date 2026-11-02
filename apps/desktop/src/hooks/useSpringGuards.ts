/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { cancelSpring } from '../editor/tool-pick/cancel-spring';
import { springKeyUp } from '../editor/tool-pick/spring-key-up';
import { SPRING_DIALOG_SELECTOR } from '../editor/tool-pick/spring-keys.constants';

const useSpringGuards = (): void => {
  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') cancelSpring();
    };
    const watcher = new MutationObserver(() => {
      if (document.querySelector(SPRING_DIALOG_SELECTOR) !== null) cancelSpring();
    });
    const onBlur = (): void => springKeyUp();
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('blur', onBlur);
    watcher.observe(document.body, { childList: true, subtree: true });
    return () => {
      document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('blur', onBlur);
      watcher.disconnect();
    };
  }, []);
};

export { useSpringGuards };
