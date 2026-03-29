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
};

module.exports = nextConfig;
