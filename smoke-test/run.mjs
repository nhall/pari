import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const root = join(smokeDir, '..');
const pages = ['esm.html', 'iife.html'];
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };

// Unpack the tarball directly so the smoke pages load exactly what npm would publish,
// without touching smoke-test/package.json or needing a network install.
const packDir = await mkdtemp(join(tmpdir(), 'pari-pack-'));
const [{ filename }] = JSON.parse(
	execFileSync('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', packDir], {
		cwd: root,
		encoding: 'utf8',
	})
);
const installDir = join(smokeDir, 'node_modules', 'pari-components');
await rm(installDir, { recursive: true, force: true });
await mkdir(installDir, { recursive: true });
execFileSync('tar', ['-xzf', join(packDir, filename), '--strip-components=1', '-C', installDir]);
console.log(`Smoke testing ${filename}`);

const server = createServer(async (req, res) => {
	const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
	if (path.includes('..')) return res.writeHead(403).end();
	try {
		const body = await readFile(join(smokeDir, path));
		res.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' });
		res.end(body);
	} catch {
		res.writeHead(404).end();
	}
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
let failed = false;

for (const page of pages) {
	const tab = await browser.newPage();
	const lines = [];
	tab.on('console', (msg) => lines.push(msg.text()));
	tab.on('pageerror', (err) => lines.push(`✗ page error: ${err.message}`));

	await tab.goto(`${base}/${page}`, { waitUntil: 'networkidle' });
	// The IIFE page runs its checks after a short delay.
	await tab.waitForTimeout(1000);

	const results = lines.filter((line) => line.includes('✓') || line.includes('✗'));
	const failures = results.filter((line) => line.includes('✗'));
	console.log(`\n${page}: ${results.length - failures.length} passed, ${failures.length} failed`);
	for (const line of results) console.log(`  ${line}`);

	if (failures.length || !results.length) failed = true;
	await tab.close();
}

await browser.close();
server.close();
await rm(packDir, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
