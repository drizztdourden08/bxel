/* @layer core @kind types */
type IndexImage = { readonly width: number; readonly height: number; readonly pixels: Uint8Array };

type ResampleAlgorithm = 'nearest' | 'rotsprite' | 'cleanedge' | 'scale2x' | 'scale3x' | 'mmpx';

type BorderRule = 'clamp' | 'transparent';

type StepConfig = {
  readonly border: BorderRule;
  readonly same: (a: number, b: number) => boolean;
  readonly luma: (index: number) => number;
};

type ResampleOptions = {
  readonly luma?: readonly number[];
  readonly distance?: (a: number, b: number) => number;
  readonly similar?: number;
};

type Sampler = (u: number, v: number) => number;

type SamplerRequest = {
  readonly image: IndexImage;
  readonly algorithm: ResampleAlgorithm;
  readonly scale: number;
  readonly options: ResampleOptions;
};

export type { BorderRule, IndexImage, ResampleAlgorithm, ResampleOptions, Sampler, SamplerRequest, StepConfig };
