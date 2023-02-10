import { defineConfig } from 'tsup';
import externals from './scripts/externals';
import { builtinModules } from 'node:module';
import { dependencies } from './package.json';

const production = process.env.NODE_ENV === 'production';

export default defineConfig(() => ({
	clean: true,
	entry: ['src/index.ts'],
	format: ['cjs', 'esm'],
	minify: production,
	noExternal: [
		...Object.keys(dependencies).filter(d => !externals.includes(d)),
		...builtinModules.flatMap(p => [p, `node:${p}`]),
	],
	target: 'esnext',
	tsconfig: './tsconfig.json',
	dts: true,
}));
