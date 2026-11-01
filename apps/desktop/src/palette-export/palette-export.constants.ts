/* @layer renderer-app @kind constants */
import type { PaletteExportFormat } from './palette-export.type';

const PALETTE_EXPORT_FORMATS: readonly PaletteExportFormat[] = [
  { id: 'gpl', label: 'GIMP palette (.gpl)', extension: 'gpl', scale: 1 },
  { id: 'pal', label: 'JASC palette (.pal)', extension: 'pal', scale: 1 },
  { id: 'hex', label: 'Hex list (.hex)', extension: 'hex', scale: 1 },
  { id: 'txt', label: 'Paint.net palette (.txt)', extension: 'txt', scale: 1 },
  { id: 'ase', label: 'Adobe swatches (.ase)', extension: 'ase', scale: 1 },
  { id: 'png-1', label: 'PNG strip, 1x', extension: 'png', scale: 1 },
  { id: 'png-8', label: 'PNG strip, 8x', extension: 'png', scale: 8 },
  { id: 'png-32', label: 'PNG strip, 32x', extension: 'png', scale: 32 },
];

const PALETTE_EXPORT_TEXT = {
  title: 'Export the palette',
  menu: 'Export',
  menuSelection: 'Export selection',
  copyList: 'Copy as hex list',
  saveProject: 'Save as project palette',
  addSet: 'Add to my swatch sets',
  none: 'This palette has no colours to export.',
  failed: (message: string): string => `Could not export the palette. ${message}`,
  exported: (count: number, name: string): string => `Exported ${count} ${count === 1 ? 'colour' : 'colours'} to ${name}.`,
  copied: (count: number): string => `Copied ${count} ${count === 1 ? 'colour' : 'colours'} as a hex list.`,
  copyFailed: 'Could not copy to the clipboard.',
  savedProject: (name: string): string => `Saved ${name} as a project palette.`,
  addedSet: (name: string): string => `Added ${name} to your swatch sets.`,
  noProject: 'Open a project to save a project palette.',
  fallbackName: 'palette',
  noDialog: 'Saving files is not available here.',
} as const;

export { PALETTE_EXPORT_FORMATS, PALETTE_EXPORT_TEXT };
