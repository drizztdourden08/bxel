/* @layer renderer-app @kind logic */
import { writeGpl } from '@bxel/formats';
import type { PaletteBank } from '@bxel/document';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { reasonOf } from '../files/reason-of';
import { PROJECT_CONFIG_TEXT } from './project-config.constants';
import type { ProjectOutcomeText } from './project-config.type';

const exportPaletteFile = async (documents: DocumentsPort, bank: PaletteBank): Promise<ProjectOutcomeText> => {
  const colors = bank.slots.flatMap((slot) => (slot.kind === 'color' ? [{ hex: slot.rgb, name: slot.name === slot.rgb ? '' : slot.name }] : []));
  const text = writeGpl({ name: bank.name, colors });
  if (!text.ok) return text.message;
  const path = await documents.saveAs({ title: PROJECT_CONFIG_TEXT.exportTitle, defaultPath: `${bank.name}.gpl`, filters: [{ name: 'GIMP palette', extensions: ['gpl'] }] });
  if (path === null) return null;
  try {
    await documents.writeText(path, text.text, { recent: false });
    return null;
  } catch (error) {
    return reasonOf(error);
  }
};

export { exportPaletteFile };
