/* @layer core @kind logic */
import { z } from 'zod';
import { mapLayerEditFields } from './map-layer-edit-fields';
import { mapLayerRefSchema } from './map-layer-ref-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const hasEdit = (value: { name?: string; visible?: boolean; locked?: boolean; colour?: string | null }): boolean =>
  Object.values({ name: value.name, visible: value.visible, locked: value.locked, colour: value.colour }).some((item) => item !== undefined);

const mapLayerUpdateSchema = z
  .strictObject({ tilemap: tilemapRefSchema, layer: mapLayerRefSchema, ...mapLayerEditFields })
  .refine(hasEdit, { message: 'Give a name, visible, locked or colour.' });

export { mapLayerUpdateSchema };
