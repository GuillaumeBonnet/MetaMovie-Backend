import {
	Validator,
	ValidationError,
	ValidateFunction,
} from "express-json-validator-middleware";
import { readFileSync } from "fs";
import path from "path";

const bodyValidator = (
	typeName:
		| "DeckApi"
		| "DeckApi_Createable"
		| "SignupBody"
		| "PasswordResetDemandBody"
		| "PasswordResetConfirmationBody"
) => {
	const validator = new Validator({ allErrors: true });
	const schema = readFileSync(
		path.resolve(__dirname, `../json-schema/${typeName}.schema.json`),
		{
			encoding: "utf8",
			flag: "r",
		}
	);
	return validator.validate({
		body: JSON.parse(schema),
	});
};
export { bodyValidator };
