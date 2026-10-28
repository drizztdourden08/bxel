/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';

const meta: ScreenMeta = { title: 'Assistant', icon: 'plug-zap', order: 5, keywords: ['mcp', 'assistant', 'program', 'connection', 'access', 'automation'] };

const seeOptions = [
  { value: 'everything', label: 'Everything Bxel has access to', hint: 'Open documents, recent files and granted projects.' },
  { value: 'open_and_projects', label: 'Open documents and projects', hint: 'The recent files list stays hidden.' },
  { value: 'projects', label: 'Granted projects only', hint: 'Documents opened from anywhere else stay hidden.' },
];

const writeOptions = [
  { value: 'where_bxel_can', label: 'Where Bxel can write', hint: "A document's own file, granted projects and the assistant folder." },
  { value: 'projects_and_assistant_folder', label: 'Projects and the assistant folder', hint: 'A document outside a project is never saved over its own file.' },
  { value: 'nowhere', label: 'Nowhere', hint: 'Save and export refuse. Edits stay in memory for you to save.' },
];

const sections: Section[] = [
  {
    id: 'access',
    title: 'Access',
    items: [
      {
        key: 'assistantAccess',
        label: 'Assistant access',
        description: 'Let assistant programs on this computer use Bxel through MCP.',
        hint: 'Off, Bxel opens no bridge and refuses every program. On, a program still needs your approval the first time, as set on the Assistant programs page.',
      },
      {
        key: 'assistantStart',
        label: 'Let programs start Bxel',
        description: 'A program may start Bxel with or without a window.',
        hint: 'Off, a program can only use a Bxel you opened yourself.',
      },
    ],
  },
  {
    id: 'scope',
    title: 'What a program reaches',
    items: [
      {
        key: 'assistantSee',
        label: 'A program can see',
        description: 'The documents and files a connected program can read.',
        hint: 'Programs never see absolute paths, only file names and ids.',
        control: { kind: 'choice', options: seeOptions, look: 'radio' },
      },
      {
        key: 'assistantWrite',
        label: 'A program can write',
        description: 'Where a connected program may save and export.',
        hint: 'New files from a program land in the assistant folder.',
        control: { kind: 'choice', options: writeOptions, look: 'radio' },
      },
      {
        key: 'assistantFolder',
        label: 'Assistant folder',
        description: 'Where a program saves and exports new files outside a project.',
        hint: 'Empty uses Documents, Bxel Assistant, made on the first write.',
        control: { kind: 'path', pick: 'folder', placeholder: 'Documents\\Bxel Assistant' },
      },
    ],
  },
];

export default sections;
export { meta };
