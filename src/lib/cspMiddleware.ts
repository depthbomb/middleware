import { createHash, randomBytes } from 'node:crypto';
import type { Middleware } from 'koa';

/**
 * Creates a middleware for setting the CSP header that requires `<script>` (and optionally `<style>`) elements to have a `nonce` attribute.
 *
 * The nonce is also added to the Koa `ctx` as `cspNonce` so it can be retrieved in subsequent middleware and route actions (such as for passing to views).
 * @param styles Whether or not to apply the rule to `<style>` tags
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
 */
export function createCspNonceMiddleware(styles: boolean = true): Middleware {
	async function generateNonce(): Promise<string> {
		const buf = randomBytes(256);
		return 'sha256-' + createHash('sha256').update(buf).digest('base64');
	}

	return async (ctx, next) => {
		const nonce = await generateNonce();

		ctx.cspNonce = nonce;

		const rules = [`script-src 'self' 'nonce-${nonce}'`, styles && `style-src 'self' 'nonce-${nonce}'`];

		ctx.set('Content-Security-Policy', rules.join(';'));

		return await next();
	}
}
