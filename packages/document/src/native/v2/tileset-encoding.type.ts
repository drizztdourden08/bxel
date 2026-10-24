/* @layer core @kind types */
import type { Sprite } from '../../model/sprite.type';
import type { TilesetFileJson } from './tileset-file.type';

type TilesetEncoding = { readonly file: TilesetFileJson; readonly sprites: readonly Sprite[] };

export type { TilesetEncoding };
