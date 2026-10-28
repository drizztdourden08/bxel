/* @layer renderer-app @kind types */
import type { RgbaImage } from '@bxel/formats';
import type { OverviewModel } from '../../asset-overview/asset-overview.type';

type OverviewPartProps = { readonly model: OverviewModel };

type PixelCanvasProps = {
  readonly image: RgbaImage;
  readonly label: string;
  readonly small?: boolean;
};

type NameDraft = {
  readonly draft: string;
  readonly error: string | null;
  readonly setDraft: (value: string) => void;
  readonly commit: (value: string) => void;
};

export type { NameDraft, OverviewPartProps, PixelCanvasProps };
