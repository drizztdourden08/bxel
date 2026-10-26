/* @layer core @kind types */
import type { Rgb } from '../model/palette.type';

type SwatchColorValue = { readonly rgb: Rgb; readonly alpha: number };

export type { SwatchColorValue };
