const crypto = require('crypto');

// Intercept native Node hashing to prevent Next.js Webpack from crashing when passing undefined data
// This resolves the WasmHash / BulkUpdateDecorator TypeError length bugs in Node 22
const originalCreateHash = crypto.createHash;
crypto.createHash = function(algorithm) {
	const hash = originalCreateHash(algorithm);
	const originalUpdate = hash.update;
	hash.update = function(data, inputEncoding) {
		if (data === undefined) {
			console.warn("[Monkeypatch] Prevented Webpack from crashing on undefined hash data.");
			return originalUpdate.call(this, "fallback_undefined_hash", inputEncoding);
		}
		return originalUpdate.call(this, data, inputEncoding);
	};
	return hash;
};

const trimTrailingSlashes = (value) => value.replace(/\/+$/, "");

const resolveBackendApiBaseUrl = () => {
	const configuredUrl = [
		process.env.BACKEND_API_URL,
		process.env.BACKEND_URL,
		"http://localhost:8000",
	].find((value) => typeof value === "string" && value.trim().length > 0);

	return trimTrailingSlashes(configuredUrl).replace(/\/graphql$/, "");
};

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	webpack(config) {
		config.output = config.output || {};
		config.output.hashFunction = "sha256";
		return config;
	},
	async rewrites() {
		const backendApiBaseUrl = resolveBackendApiBaseUrl();
		const backendGraphqlUrl =
			process.env.BACKEND_URL || `${backendApiBaseUrl}/graphql`;

		return [
			{
				source: "/api",
				destination: backendGraphqlUrl,
			},
			{
				source: "/api/:path*",
				destination: `${backendApiBaseUrl}/api/:path*`,
			},
		];
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

module.exports = nextConfig;
