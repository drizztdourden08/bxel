/* @layer renderer-app @kind hook */
import { contextMenu } from '@drizztdourden08/brock-react';
import { useCallback, useEffect, useRef } from 'react';
import { NEW_KIND_LETTERS, OPEN_MENU_SELECTOR } from '../ProjectPanel.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';

const plain = (event: KeyboardEvent): boolean => !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey;

const useNewMenuLetters = ({ rowActions }: Pick<ProjectPanelModel, 'rowActions'>): (() => void) => {
  const armed = useRef(false);
  const { newAsset } = rowActions;

  useEffect(() => {
    const disarm = (): void => {
      armed.current = false;
    };
    const onKey = (event: KeyboardEvent): void => {
      if (!armed.current) return;
      if (document.querySelector(OPEN_MENU_SELECTOR) === null) {
        disarm();
        return;
      }
      const kind = plain(event) ? NEW_KIND_LETTERS[event.key.toLowerCase()] : undefined;
      if (kind === undefined) return;
      event.preventDefault();
      event.stopPropagation();
      disarm();
      contextMenu.close();
      newAsset(kind);
    };
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('pointerdown', disarm, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('pointerdown', disarm, true);
    };
  }, [newAsset]);

  return useCallback(() => {
    armed.current = true;
  }, []);
};

export { useNewMenuLetters };
