/* @layer tests @kind test */
import { buildTools, PRESETS } from '@bxel/mcp';
import type { Grant } from '@bxel/mcp';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { ToolListChangedNotificationSchema } from '@modelcontextprotocol/sdk/types.js';
import { describe, expect, it } from 'vitest';
import { APP_COMMANDS } from '../../src/documents/document-host.constants';
import { createGrantTracker } from '../../src/helper/create-grant-tracker';
import { createServer } from '../../src/helper/create-server';
import type { HelperState } from '../../src/helper/helper.type';

const open = async () => {
  const tracker = createGrantTracker();
  const state = {
    file: 'unused',
    session: { call: () => Promise.reject(new Error('no bridge')), bye: () => Promise.resolve(), setClient: () => undefined, setLaunchToken: () => undefined, isRunning: () => false, reconnect: () => Promise.reject(new Error('no bridge')), grant: tracker.current, onGrant: tracker.onChange },
    tools: new Map(buildTools(APP_COMMANDS).map((tool) => [tool.name, tool])),
    started: null,
  } satisfies HelperState;
  const [near, far] = InMemoryTransport.createLinkedPair();
  const mcp = createServer(state);
  await mcp.connect(far);
  const client = new Client({ name: 'listing', version: '1.0.0' });
  const changes = { count: 0 };
  client.setNotificationHandler(ToolListChangedNotificationSchema, () => {
    changes.count += 1;
  });
  await client.connect(near);
  const names = async (): Promise<string[]> => (await client.listTools()).tools.map((tool) => tool.name);
  return { tracker, client, names, changes };
};

const narrowed = (tools: Grant['tools'], bundles: Partial<Grant['bundles']> = {}): Grant => ({
  ...PRESETS.full_control.grant,
  bundles: { ...PRESETS.full_control.grant.bundles, ...bundles },
  tools,
});

const settle = () => new Promise<void>((resolve) => setTimeout(resolve, 20));

describe('the tools a program sees through the helper', () => {
  it('lists every tool before it has a grant and declares that the list can change', async () => {
    const { names, client } = await open();
    expect(await names()).toHaveLength(buildTools(APP_COMMANDS).length - 1);
    expect(await names()).not.toContain('restart_bxel');
    expect(client.getServerCapabilities()?.tools?.listChanged).toBe(true);
  });

  it('leaves out a Disabled tool and tells the client the list changed', async () => {
    const { tracker, names, changes } = await open();
    await names();
    tracker.accept('s1', narrowed({ get_document: 'disabled' }, { files_saving: 'disabled' }));
    await settle();
    expect(changes.count).toBe(1);
    const listed = await names();
    expect(listed).not.toContain('get_document');
    expect(listed).not.toContain('save_document');
    expect(listed).toContain('apply_edits');
  });

  it('follows a grant pushed for the same session and ignores another one', async () => {
    const { tracker, names, changes } = await open();
    tracker.accept('s1', PRESETS.full_control.grant);
    await names();
    tracker.follow('s2', narrowed({ undo: 'disabled' }));
    await settle();
    expect(changes.count).toBe(0);
    tracker.follow('s1', narrowed({ undo: 'disabled' }));
    await settle();
    expect(changes.count).toBe(1);
    expect(await names()).not.toContain('undo');
  });

  it('notes the Read level in the description of a mixed tool', async () => {
    const { tracker, client } = await open();
    tracker.accept('s1', PRESETS.read_only.grant);
    const listed = (await client.listTools()).tools;
    expect(listed.find((tool) => tool.name === 'close_document')?.description).toContain('Read level: writes are refused.');
  });

  it('does not send a change when the visible list stays the same', async () => {
    const { tracker, names, changes } = await open();
    tracker.accept('s1', PRESETS.full_control.grant);
    await names();
    tracker.accept('s1', narrowed({}));
    await settle();
    expect(changes.count).toBe(0);
  });
});
