/* @layer core @kind logic */
import type { CelId, FrameId } from '../model/ids.type';
import type { SpriteJson } from './document-json.type';
import type { DamagedCel, LoadIssue } from './load-report.type';

const damageOf = (sprite: SpriteJson, celId: CelId, issue: LoadIssue): DamagedCel => {
  const sites = sprite.layers.flatMap((layer) =>
    Object.entries(layer.cels)
      .filter(([, id]) => id === celId)
      .map(([frameId]) => ({ layerId: layer.id, frameId: frameId as FrameId })),
  );
  const site = sites[0];
  return {
    celId,
    spriteId: sprite.id,
    layerId: site?.layerId ?? null,
    frameId: site?.frameId ?? null,
    code: issue.code,
    message: issue.message,
  };
};

export { damageOf };
