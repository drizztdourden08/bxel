/* @layer renderer-app @kind types */
import type { RgbaImage } from '@bxel/formats';
import type { OverviewModel, SizeFields } from '../../asset-overview/asset-overview.type';

type OverviewPartProps = { readonly model: OverviewModel };

type PixelCanvasProps = {
  readonly image: RgbaImage;
  readonly label: string;
  readonly small?: boolean;
};

type SizeFormProps = OverviewPartProps & { readonly fields: SizeFields };

type NameDraft = {
  readonly draft: string;
  readonly error: string | null;
  readonly setDraft: (value: string) => void;
  readonly commit: (value: string) => void;
};

type SizeDraft = {
  readonly width: number;
  readonly height: number;
  readonly valid: boolean;
  readonly setWidth: (value: number) => void;
  readonly setHeight: (value: number) => void;
  readonly apply: () => void;
};

export type { NameDraft, OverviewPartProps, PixelCanvasProps, SizeDraft, SizeFormProps };
