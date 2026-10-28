/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { TreeHandle } from '@drizztdourden08/tessera';
import type { RevealRequest } from '../../../../../panel-browser/browser-state.type';
import { focusRow } from '../../../behavior/focus-row';

const useRevealRow = (request: RevealRequest | null, handle: RefObject<TreeHandle | null>): void => {
  const handled = useRef<RevealRequest | null>(null);

  useEffect(() => {
    if (request === null || handled.current === request) return undefined;
    handled.current = request;
    handle.current?.scrollToKey(request.key, 'nearest');
    if (!request.focus) return undefined;
    const frame = requestAnimationFrame(() => focusRow(request.key));
    return () => cancelAnimationFrame(frame);
  }, [request, handle]);
};

export { useRevealRow };
