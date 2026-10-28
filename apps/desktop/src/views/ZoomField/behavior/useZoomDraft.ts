/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { zoomTo } from '../../../editor/zoom-to';
import { parsePercent } from '../../../view-zoom/parse-percent';

interface ZoomDraft {
  text: string;
  invalid: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

const useZoomDraft = (percent: number | null): ZoomDraft => {
  const [draft, setDraft] = useState<string | null>(null);
  const commit = (): void => {
    const next = draft === null ? null : parsePercent(draft);
    if (next !== null) zoomTo(next);
    setDraft(null);
  };
  return {
    text: draft ?? (percent === null ? '' : `${percent}%`),
    invalid: draft !== null && parsePercent(draft) === null,
    onChange: (event) => setDraft(event.target.value),
    onBlur: commit,
    onKeyDown: (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        commit();
      } else if (event.key === 'Escape' && draft !== null) {
        event.stopPropagation();
        setDraft(null);
      }
    },
  };
};

export type { ZoomDraft };
export { useZoomDraft };
