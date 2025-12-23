import { INTENT_INFOS, IntentInfo } from './src/lib/intents.js';

// npx tsx tools/signed-request-generator/generate-available-delegations.ts

const printIntentRow = ([name, info]: [string, IntentInfo]) =>
	`| [\`${name}\`](${info.specUrl}) | ${info.description}| ${info.id} |`;

[...INTENT_INFOS.entries()]
	// Don't show things that are signature required
	.filter(([_n, v]: [string, IntentInfo]) => !v.signatureRequired)
	.toSorted(([aName, _a]: [string, IntentInfo], [bName, _b]: [string, IntentInfo]) => aName.localeCompare(bName))
	.map((x: [string, IntentInfo]) => console.log(printIntentRow(x)));
