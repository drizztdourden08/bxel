/* @layer helper @kind constants */
import { CONTRACT_VERSION } from '@bxel/mcp';

const HELPER_INFO = { name: 'bxel', title: 'Bxel', version: `contract-${CONTRACT_VERSION}` } as const;

const APP_ID = 'bxel';

const STOP_WAIT_MS = 10_000;

const NOT_RUNNING = /not running|ENOENT|no such file|could not reach|cannot find|does not exist|not a bridge discovery/i;

const PREVIEW_URI = /^bxel:\/\/(doc_[0-9a-z]+)\/sprite\/(spr_[0-9a-z]+)\/frame\/(frm_[0-9a-z]+)\/preview\.png(?:\?scale=(\d+))?/;

const ANIMATION_PREVIEW_URI = /^bxel:\/\/(doc_[0-9a-z]+)\/animation\/(anm_[0-9a-z]+)\/(?:frame\/(afr_[0-9a-z]+)|tag\/(tag_[0-9a-z]+)|strip)\/preview\.png(?:\?scale=(\d+))?/;

const SHEET_PREVIEW_URI = /^bxel:\/\/(doc_[0-9a-z]+)\/sheet\/(sht_[0-9a-z]+)\/preview\.png(?:\?scale=(\d+))?/;

const SHEET_PREVIEW_TEMPLATE = 'bxel://{documentId}/sheet/{sheetId}/preview.png{?scale,rev}';

const ANIMATION_PREVIEW_TEMPLATE = 'bxel://{documentId}/animation/{animationId}/{frame|tag|strip}/preview.png{?scale,rev}';

const DEFAULT_PREVIEW_SCALE = '4';

const PREVIEW_TEMPLATE = 'bxel://{documentId}/sprite/{spriteId}/frame/{frameId}/preview.png{?scale,rev}';

const HELPER_TEXT = {
  instructions:
    'Bxel is a palette pixel art editor. Read the bxel://guide resource first. Call get_session to pair; if Bxel is not running, call start_bxel with window headless or visible. Read before you edit, preview with preview_edits, then apply_edits at the revision you read.',
  notRunning: 'Bxel is not running. Call start_bxel with window headless or visible, or ask the owner to open Bxel.',
  noLaunch: 'Bxel has not run on this computer with Assistant access on, so the helper does not know how to start it. Ask the owner to open Bxel once.',
  startTimeout: 'Bxel did not open its bridge within 20 seconds.',
  startExit: (code: number | null) => `Bxel exited with code ${code ?? 'none'} before its bridge opened.`,
  disabled: 'Assistant access is off in Bxel settings.',
  startOff: 'Starting Bxel from a program is off in Bxel settings. Ask the owner to open Bxel.',
  busy: 'Bxel did not answer in time. Read the revision before you retry an edit.',
  bridge: (message: string) => `The bridge to Bxel failed: ${message}`,
  unknownTool: (name: string) => `There is no tool named ${name}.`,
  notFound: (uri: string) => `There is no resource ${uri}.`,
  fatal: (message: string) => `bxel-mcp stopped: ${message}`,
  previewName: 'Bxel preview',
} as const;

export {
  ANIMATION_PREVIEW_TEMPLATE,
  ANIMATION_PREVIEW_URI,
  APP_ID,
  DEFAULT_PREVIEW_SCALE,
  HELPER_INFO,
  HELPER_TEXT,
  NOT_RUNNING,
  PREVIEW_TEMPLATE,
  PREVIEW_URI,
  SHEET_PREVIEW_TEMPLATE,
  SHEET_PREVIEW_URI,
  STOP_WAIT_MS,
};
