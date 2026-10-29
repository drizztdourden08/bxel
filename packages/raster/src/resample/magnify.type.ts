/* @layer core @kind types */
import type { IndexImage, StepConfig } from './resample.type';

type Magnifier = { readonly factor: number; readonly run: (image: IndexImage, config: StepConfig) => IndexImage };

type Magnified = { readonly image: IndexImage; readonly factor: number };

export type { Magnified, Magnifier };
