/* @layer renderer-app @kind types */
import type { IconName } from '@drizztdourden08/tessera';
import type { ReactNode } from 'react';
import type { Surface } from '../../surface/surface.type';

interface ViewSectionProps {
  title: string;
  icon: IconName;
  children: ReactNode;
}

interface SurfaceProps {
  surface: Surface;
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

export type { LineSwatchProps, OverlayRowProps, SurfaceProps, TiledGlyphProps, ViewSectionProps };
