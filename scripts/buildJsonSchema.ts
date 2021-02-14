import { resolve } from "path";

import * as TJS from "typescript-json-schema";
import fs from "fs";

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
	required: true,
	noExtraProps: true,
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
	strictNullChecks: true,
};

// optionally pass a base path

const program = TJS.getProgramFromFiles(
	[resolve("src/type.d.ts")],
	compilerOptions
);

// We can either get the schema for one file and one type...
const jsonSchemaPath = "./src/json-schema";
const files = fs.readdirSync(jsonSchemaPath);
for (const file of files) {
	fs.unlinkSync(`${jsonSchemaPath}/${file}`);
}
for (const className of [
	"DeckApi",
	"DeckApi_WithoutCards",
	"DeckApi_Createable",
]) {
	const schema = TJS.generateSchema(program, className, settings);
	if (schema) {
		fs.writeFileSync(
			`${jsonSchemaPath}/${className}.schema.json`,
			JSON.stringify(schema, null, 4)
		);
	}
}
