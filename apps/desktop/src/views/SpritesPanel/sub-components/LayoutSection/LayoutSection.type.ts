/* @layer renderer-app @kind types */
import type { Sheet } from '@bxel/document';

interface LayoutControlsProps {
  sheet: Sheet;
}

interface LayoutPagesProps {
  page: number;
  count: number;
}

interface StyleNumberProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onCommit: (value: number) => void;
}

export type { LayoutControlsProps, LayoutPagesProps, StyleNumberProps };
