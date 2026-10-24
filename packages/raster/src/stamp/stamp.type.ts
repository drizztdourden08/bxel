/* @layer core @kind types */
import type { BufferView, MaskView } from '../buffer.type';
import type { Point } from '../geometry.type';

type StampOptions = {
  readonly target: BufferView;
  readonly patch: BufferView;
  readonly points: readonly Point[];
  readonly anchor?: Point | null;
  readonly skipZero: boolean;
  readonly mask?: MaskView | null;
};

type StampPlace = {
  readonly options: StampOptions;
  readonly origin: Point;
};

export type { StampOptions, StampPlace };
