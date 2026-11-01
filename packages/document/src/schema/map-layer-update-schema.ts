/* @layer core @kind logic */
import { z } from 'zod';
import { mapLayerEditFields } from './map-layer-edit-fields';
import { mapLayerRefSchema } from './map-layer-ref-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const hasEdit = (value: { name?: string; visible?: boolean; locked?: boolean; colour?: string | null; opacity?: number }): boolean =>
  Object.values({ name: value.name, visible: value.visible, locked: value.locked, colour: value.colour, opacity: value.opacity }).some((item) => item !== undefined);

const mapLayerUpdateSchema = z
  .strictObject({ tilemap: tilemapRefSchema, layer: mapLayerRefSchema, ...mapLayerEditFields })
  .refine(hasEdit, { message: 'Give a name, visible, locked, colour or opacity.' });

export { mapLayerUpdateSchema };
