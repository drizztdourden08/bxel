/* @layer core @kind constants */
import type { Grant } from '../grants/grant.type';
import { make } from '../grants/make-grant';
import type { PresetId } from './catalogue.type';

const PRESET_IDS = ['read_only', 'edit_documents', 'full_control'] as const;

const EDIT_DOCUMENTS_GRANT: Grant = make('edit', { read_documents: 'read', app_control: 'read', layout: 'read', settings: 'read' });

const PRESETS: Readonly<Record<PresetId, { readonly label: string; readonly description: string; readonly grant: Grant }>> = {
  read_only: { label: 'Read only', description: 'Look at documents, read pixels and preview edits. Nothing changes.', grant: make('read') },
  edit_documents: {
    label: 'Edit documents',
    description: 'Change, save and export documents. App control, layout and settings stay read only.',
    grant: EDIT_DOCUMENTS_GRANT,
  },
  full_control: {
    label: 'Full control',
    description: 'Everything, including layout and settings. Not the power to restart Bxel.',
    grant: make('edit', { read_documents: 'read' }),
  },
};

const MIGRATED_EDIT_GRANT: Grant = make('edit', { read_documents: 'read', settings: 'read' });

export { EDIT_DOCUMENTS_GRANT, MIGRATED_EDIT_GRANT, PRESET_IDS, PRESETS };
