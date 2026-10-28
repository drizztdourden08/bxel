/* @layer renderer-app @kind types */
import type { IconName } from '@drizztdourden08/tessera';
import type { ReactNode } from 'react';
import type { CanvasSurface } from '../../canvas-surface/canvas-surface.type';

interface ViewSectionProps {
  title: string;
  icon: IconName;
  children: ReactNode;
}

interface SurfaceProps {
  surface: CanvasSurface;
}

interface FixedProps {
  fixed: boolean;
}

interface LineSwatchProps {
  colour: string;
  opacity: number;
  gap: number;
  label: string;
}

interface OverlayRowProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  swatch?: LineSwatchProps;
  onChange: (checked: boolean) => void;
}

interface TiledGlyphProps {
  mode: string;
}

export type { FixedProps, LineSwatchProps, OverlayRowProps, SurfaceProps, TiledGlyphProps, ViewSectionProps };
