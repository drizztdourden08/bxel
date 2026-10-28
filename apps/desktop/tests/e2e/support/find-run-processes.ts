/* @layer renderer-app @kind logic */
import { spawnSync } from 'node:child_process';
import type { ProcessFound } from './process-found.type';
import { runMarker } from './run-marker';

const powershellOf = (marker: string): string =>
  `Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*${marker}*' -and $_.ProcessId -ne $PID -and $_.Name -notmatch '^(powershell|pwsh)' } | ForEach-Object { "$($_.ProcessId)|$($_.Name)" }`;

const listing = (marker: string): string => {
  if (process.platform === 'win32') {
    return spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', powershellOf(marker)], { encoding: 'utf8' }).stdout;
  }
  const rows = spawnSync('ps', ['-eo', 'pid=,comm=,args='], { encoding: 'utf8' }).stdout.split('\n');
  return rows
    .filter((row) => row.includes(marker))
    .map((row) => row.trim().split(/\s+/).slice(0, 2).join('|'))
    .join('\n');
};

const findRunProcesses = (runId: string): readonly ProcessFound[] =>
  listing(runMarker(runId))
    .split(/\r?\n/)
    .map((line) => line.trim().split('|'))
    .map(([pid, name]) => ({ pid: Number(pid), name: name ?? '' }))
    .filter((found) => Number.isInteger(found.pid) && found.pid > 0 && found.pid !== process.pid);

export { findRunProcesses };
