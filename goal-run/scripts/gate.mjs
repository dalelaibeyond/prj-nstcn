import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const releasePatterns = [
  /example\.com/i, /acme-devices\.example/i, /\.example\b/i, /@example/i,
  /\bTODO\b/i, /\bLorem\b/i, /\bFIXME\b/i,
  /["']?isPlaceholder["']?\s*:\s*true\b/i, /["']?isExample["']?\s*:\s*true\b/i,
  /Sample case/i, /\bpending\b/i,
];
export function findReleaseViolations(text) { return releasePatterns.filter(pattern => pattern.test(text)).map(String); }
export async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(`${dir}/${entry.name}`) : `${dir}/${entry.name}`))).flat();
}
export async function inspectRelease() {
  const files = [...await walk('src/content'), ...await walk('dist/client')].filter(file => /\.(json|html|xml|txt|css|js)$/.test(file));
  const violations = [];
  for (const file of files) for (const pattern of findReleaseViolations(await readFile(file, 'utf8'))) violations.push({ file, pattern });
  return violations;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const hits = await inspectRelease();
  if (hits.length) { console.error(`Release gate BLOCKED: ${hits.length} file/pattern hits. Placeholder review content cannot be released.`); console.error(hits.slice(0, 12)); process.exitCode = 1; }
  else console.log('Release gate: zero placeholder hits.');
}
