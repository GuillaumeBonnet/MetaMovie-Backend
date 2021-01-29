// jest.config.ts
import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
	verbose: true,
	moduleFileExtensions: ["ts", "tsx", "js"],
	transform: {
		"^.+\\.(ts|tsx)$": "<rootDir>/preprocessor.js",
	},
	testMatch: ["**/*test.(ts|tsx)"],
	collectCoverage: false,
};
export default config;
