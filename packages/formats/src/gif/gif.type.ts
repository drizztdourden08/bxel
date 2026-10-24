/* @layer core @kind types */
import type { DecodedFrame } from '../animation/animation.type';

type BitWriter = {
  readonly bytes: number[];
  acc: number;
  bits: number;
};

type LzwState = {
  readonly dict: Map<number, number>;
  next: number;
  width: number;
};

type ByteReader = {
  readonly bytes: Uint8Array;
  pos: number;
};

type GifScreen = {
  readonly width: number;
  readonly height: number;
  readonly table: Uint8Array | undefined;
};

type GifControl = {
  readonly disposal: number;
  readonly delayCs: number;
  readonly transparent: number;
};

type GifPending = {
  readonly method: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly backup: Uint8ClampedArray | undefined;
};

type GifDecodeState = {
  readonly screen: GifScreen;
  readonly canvas: Uint8ClampedArray;
  readonly frames: DecodedFrame[];
  loops: number;
  control: GifControl | undefined;
  pending: GifPending | undefined;
};

type GifDescriptor = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly interlaced: boolean;
  readonly table: Uint8Array | undefined;
};

type LzwTable = {
  readonly prefix: Uint16Array;
  readonly suffix: Uint8Array;
  readonly first: Uint8Array;
  readonly length: Uint16Array;
};

type LzwRun = {
  next: number;
  width: number;
  prev: number;
  written: number;
};

type LzwReader = {
  readonly data: Uint8Array;
  pos: number;
  acc: number;
  bits: number;
};

export type {
  BitWriter,
  ByteReader,
  GifControl,
  GifDecodeState,
  GifDescriptor,
  GifScreen,
  LzwReader,
  LzwRun,
  LzwState,
  LzwTable,
};
