/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';
import type { RowText } from '../../config-source/config-source.type';

interface ConfigRowProps {
  field: string;
  children: ReactNode;
}

interface RowHeadingProps {
  text: RowText;
}

export type { ConfigRowProps, RowHeadingProps };
