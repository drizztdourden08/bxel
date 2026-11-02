/* @layer renderer-app @kind types */
import type { IconName } from '@drizztdourden08/tessera';
import type { ReactNode } from 'react';
import type { ReferenceImage } from '../../asset-view/reference-image.type';
import type { GuideRow } from '../../guides/guide.type';
import type { PreviewScale } from '../../stores/preview-store.type';
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

interface PreviewCanvasProps {
  scale: PreviewScale;
}

interface ReferenceRowProps {
  image: ReferenceImage;
}

interface GuideRowProps {
  row: GuideRow;
}

interface TiledGlyphProps {
  mode: string;
}

export type { FixedProps, GuideRowProps, LineSwatchProps, PreviewCanvasProps, OverlayRowProps, ReferenceRowProps, SurfaceProps, TiledGlyphProps, ViewSectionProps };
