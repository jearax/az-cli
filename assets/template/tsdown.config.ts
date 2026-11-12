import { readFileSync } from 'node:fs';

import { defineConfig } from 'tsdown';

import { readPackageInfo } from './scripts/package-info.mjs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
	dependencies?: Record<string, string>;
};

const tsdownConfig = defineConfig({
	entry: ['src/cli.ts'],
	outDir: 'dist',
	format: ['esm'],
	platform: 'node',
	target: 'node24',
	clean: true,
	dts: false,
	sourcemap: false,
	minify: false,
	banner: { js: '#!/usr/bin/env node' },
	// The bundle is the whole install: runtime dependencies are inlined, so `files` ships only `dist`.
	deps: {
		alwaysBundle: Object.keys(pkg.dependencies ?? {}),
		onlyBundle: false
	},
	inputOptions: {
		onLog: (level, log, handler) => {
			handler(log.code === 'UNRESOLVED_IMPORT' ? 'error' : level, log);
		}
	},
	define: {
		your_define_constant: JSON.stringify(readPackageInfo())
	}
});

export default tsdownConfig;
