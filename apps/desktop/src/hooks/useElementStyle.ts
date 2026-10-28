/* @layer renderer-app @kind hook */
import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';

type ElementStyle = Readonly<Record<string, string>>;

const useElementStyle = (target: RefObject<HTMLElement | null>, style: ElementStyle): void => {
  useLayoutEffect(() => {
    const element = target.current;
    if (!element) return;
    for (const [name, value] of Object.entries(style)) element.style.setProperty(name, value);
  });
};

export { useElementStyle };
