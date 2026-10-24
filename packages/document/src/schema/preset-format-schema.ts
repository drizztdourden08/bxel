/* @layer core @kind logic */
import { z } from 'zod';
import { EXPORT_FORMAT } from '../model/export-format.constants';
import type { ExportFormat } from '../model/export-preset.type';

const presetFormatSchema = z.custom<ExportFormat>((value) => Object.values(EXPORT_FORMAT).some((format) => format === value));

export { presetFormatSchema };
