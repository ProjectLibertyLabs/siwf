import { SCHEMA_INFOS, SchemaInfo } from './src/lib/schemas.js';

// npx tsx tools/signed-request-generator/generate-available-delegations.ts

const printSchemaRow = ([name, info]: [string, SchemaInfo]) =>
	`| [\`${name}\`](${info.specUrl}) | ${info.deprecated ? '(Deprecated) ' : ''}${info.description}| ${info.id} |`;

[...SCHEMA_INFOS.entries()]
	// Don't show things that are signature required
	.filter(([_n, v]) => !v.signatureRequired)
	.toSorted((a, b) => a[0].localeCompare(b[0]))
	.map((x) => console.log(printSchemaRow(x)));
