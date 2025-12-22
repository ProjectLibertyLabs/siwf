import { INTENT_INFOS, IntentInfo } from './src/lib/intents.js';

// npx tsx tools/signed-request-generator/generate-available-delegations.ts

const printIntentRow = ([name, info]: [string, IntentInfo]) =>
	`| [\`${name}\`](${info.specUrl}) | ${info.description}| ${info.id} |`;

[...INTENT_INFOS.entries()]
	// Don't show things that are signature required
	.filter(([_n, v]) => !v.signatureRequired)
	.toSorted((a, b) => a[0].localeCompare(b[0]))
	.map((x) => console.log(printIntentRow(x)));
