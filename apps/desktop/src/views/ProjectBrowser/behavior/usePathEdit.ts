/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { useBrowserContext } from './useBrowserContext';
import type { PathEdit } from './usePathEdit.type';

const usePathEdit = (onClose: () => void): PathEdit => {
  const { model } = useBrowserContext();
  const [typed, setTyped] = useState(model.folder ?? '');
  const [invalid, setInvalid] = useState(false);
  const commit = (): void => {
    const wanted = typed.trim().replace(/\\/g, '/').replace(/\/$/, '');
    const found = wanted === '' ? null : model.folderPaths.find((path) => path.toLowerCase() === wanted.toLowerCase());
    if (wanted !== '' && found === undefined) {
      setInvalid(true);
      return;
    }
    useBrowserStore.getState().goTo(found ?? null);
    onClose();
  };
  return {
    typed,
    invalid,
    onChange: (event: ChangeEvent<HTMLInputElement>): void => {
      setTyped(event.target.value);
      setInvalid(false);
    },
    onKeyDown: (event: KeyboardEvent): void => {
      if (event.key === 'Enter') commit();
      if (event.key === 'Escape') onClose();
    },
  };
};

export { usePathEdit };
