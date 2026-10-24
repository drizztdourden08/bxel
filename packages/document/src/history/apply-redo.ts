/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import { applyOps } from './apply-ops';
import type { HistoryEntry } from './history.type';

const applyRedo = (artwork: Artwork, entry: HistoryEntry): Artwork => applyOps(artwork, entry.ops, 'redo');

export { applyRedo };
