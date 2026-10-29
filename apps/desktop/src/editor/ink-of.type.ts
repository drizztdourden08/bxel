/* @layer renderer-app @kind types */
import type { Ink, Point } from '@bxel/raster';
import type { DrawingSettings } from '../stores/drawing-store.type';

type InkChoice = { readonly index: number; readonly ink: Ink | undefined };

type InkContext = { readonly other: number; readonly reversed: boolean; readonly drawing: DrawingSettings; readonly origin: Point };

type InkBuilder = (context: InkContext) => Ink | undefined;

export type { InkBuilder, InkChoice };
