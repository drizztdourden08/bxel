/* @layer renderer-app @kind types */
import type { RgbaImage } from '@bxel/formats';
import type { GuideLines } from '../../guides/guide.type';
import type { RenderOverlay } from './tool-input.type';

type OverlayInk = { readonly rgb: readonly [number, number, number]; readonly alpha: number };

type OverlayFit = { readonly applied: readonly RenderOverlay[]; readonly ignored: readonly RenderOverlay[] };

type ArtRect = { readonly x: number; readonly y: number; readonly width: number; readonly height: number };

type LineSet = { readonly ink: OverlayInk; readonly columns: readonly number[]; readonly rows: readonly number[] };

type ArtLines = { readonly width: number; readonly height: number; readonly scale: number; readonly guides: GuideLines | undefined };

type OverlayCanvas = { readonly image: RgbaImage; readonly scale: number };

export type { ArtLines, ArtRect, LineSet, OverlayCanvas, OverlayFit, OverlayInk };
