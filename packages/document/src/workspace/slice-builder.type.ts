/* @layer core @kind types */
import type { AssetSlice } from '../model/asset.type';
import type { SliceContext } from './slice-context.type';

type SliceBuilder = (context: SliceContext, id: string) => AssetSlice;

export type { SliceBuilder };
