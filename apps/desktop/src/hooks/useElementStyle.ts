/* @layer renderer-app @kind hook */
import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';
import type { ElementStyle } from './element-style.type';

const useElementStyle = (target: RefObject<HTMLElement | null>, style: ElementStyle): void => {
  useLayoutEffect(() => {
    const element = target.current;
    if (!element) return;
    for (const [name, value] of Object.entries(style)) element.style.setProperty(name, value);
  });
};

export { useElementStyle };
