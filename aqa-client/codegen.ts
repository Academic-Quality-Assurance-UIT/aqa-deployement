import type { CodegenConfig } from "@graphql-codegen/cli";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const config: CodegenConfig = {
	overwrite: true,
	schema: process.env.BACKEND_URL,
	documents: "src/**/*.graphql",
	// ignoreNoDocuments: true,
	generates: {
		"src/gql/graphql.ts": {
			// preset: "client",
			plugins: [
				"typescript",
				"typescript-operations",
				"typescript-react-apollo",
			],
			config: {
				withHooks: true,
				withRefetchFn: true,
				withMutationFn: true,
			},
			// config: {
			// 	enumsAsTypes: true,
			// 	futureProofEnums: true,
			// },
		},
	},
};

export default config;
