/* @layer renderer-app @kind types */
import type { DroppedFiles } from '@drizztdourden08/brock-react';
import type { DragAsset } from '../../../asset-drag/asset-drag.type';

type TrackPayload = DroppedFiles | readonly DragAsset[];

export type { TrackPayload };
