/* @layer core @kind types */
import type { AssetContent } from '../model/asset.type';
import type { ContentKey } from './content-key.type';

type ContentItem<K extends ContentKey> = NonNullable<AssetContent[K]>[number];

export type { ContentItem };
