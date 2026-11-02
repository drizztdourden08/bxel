/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { pathDraft } from '../../../editor/path-draft';
import { dropVertex } from '../../../editor/drop-vertex';
import { dropSelectionVertex } from '../../../editor/selection/drop-selection-vertex';
import type { DraftKeys } from './useDraftKeys.type';

const typing = (event: KeyboardEvent): boolean => {
  const target = event.target;
  return target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
};

const claim = (event: KeyboardEvent): void => {
  event.preventDefault();
  event.stopPropagation();
};

const useDraftKeys = ({ finish, cancel, redraw }: DraftKeys): void => {
  useEffect(() => {
    const down = (event: KeyboardEvent): void => {
      if (typing(event)) return;
      if (event.key === 'Backspace' && dropSelectionVertex()) {
        claim(event);
        redraw();
        return;
      }
      const draft = pathDraft.current;
      if (!draft) return;
      if (event.key === 'Escape') {
        claim(event);
        cancel();
      } else if (event.key === 'Enter') {
        claim(event);
        finish();
      } else if (event.key === 'Backspace' && draft.tool === 'polygon') {
        claim(event);
        dropVertex(draft);
        redraw();
      }
    };
    window.addEventListener('keydown', down, true);
    return () => {
      window.removeEventListener('keydown', down, true);
    };
  }, [finish, cancel, redraw]);
};

export { useDraftKeys };
