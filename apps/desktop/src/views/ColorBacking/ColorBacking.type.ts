/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';

interface ColorBackingProps {
  alpha: number;
  inline?: boolean;
  className?: string;
  children: ReactNode;
}

export type { ColorBackingProps };
