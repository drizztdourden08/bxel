/* @layer core @kind logic */
import type { TargetIssue } from '../commands/command-error.type';
import type { Artwork } from '../model/artwork.type';
import { celUses } from '../read/cel-uses';
import { requireSprite } from '../read/require-sprite';
import type { ResolvedCel } from '../scope/resolved-scope.type';

const slotKey = (layerId: string, frameId: string): string => `${layerId}:${frameId}`;

const linkedIssues = (artwork: Artwork, cels: readonly ResolvedCel[]): TargetIssue[] => {
  const targeted = new Set(cels.map((cel) => slotKey(cel.layerId, cel.frameId)));
  const issues: TargetIssue[] = [];
  for (const cel of cels) {
    if (!cel.celId) continue;
    const outside = celUses(requireSprite(artwork, cel.spriteId), cel.celId).filter(
      (use) => !targeted.has(slotKey(use.layerId, use.frameId)),
    );
    if (outside.length > 0) {
      issues.push({
        spriteId: cel.spriteId,
        layerId: cel.layerId,
        frameId: cel.frameId,
        reason: 'the cel is linked to other layers or frames',
      });
    }
  }
  return issues;
};

export { linkedIssues };
