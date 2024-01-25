import '@frequency-chain/api-augment';
import {
  ExtrinsicHelper,
  signPayloadSr25519,
  initialize,
  generateAddKeyPayload,
  createAndFundKeypair,
  UserBuilder,
} from 'frequency-scenario-template';
import type { KeyringPair } from '@polkadot/keyring/types';
import { u64, Option } from '@polkadot/types';
import Keyring from '@polkadot/keyring';
import { mnemonicGenerate } from '@polkadot/util-crypto';

// Monkey-patch BigInt so that JSON.stringify will work
// eslint-disable-next-line
(BigInt as any).prototype['toJSON'] = function () {
  return this.toString();
};

const MSA_COUNT = 4;

interface ChainAccount {
  seedPhrase: string;
  keypair?: KeyringPair;
  msaId?: bigint;
}

const PROVIDER_MNEMONIC = 'lounge monster rotate olympic grass correct potato pumpkin inside scissors lucky vote';

const accounts: ChainAccount[] = [
  { seedPhrase: 'dynamic split hedgehog grain bench toy rotate baby salon creek earn virus' },
  { seedPhrase: 'delay man segment gallery project plug thrive wool alcohol secret damage gold' },
  { seedPhrase: 'lab palm dawn net junior rubber mule fault post immune panic ethics' },
  { seedPhrase: 'coral tuna volcano lawsuit crime half area seed rapid mystery under reopen' },
  { seedPhrase: 'heavy shock slow acoustic horse flat unable student habit material canyon quote' },
  { seedPhrase: 'ask nature cook mobile analyst clerk finger depend crush inquiry survey worry' },
  { seedPhrase: 'hello area art local blind detect avocado run slide fiction aspect popular' },
  { seedPhrase: 'wing royal salute vacuum valve mean draft cause right logic canoe begin' },
  { seedPhrase: 'giraffe seven camera hobby front pact anxiety rural endless width crush muscle' },
  { seedPhrase: 'summer joke fire ivory practice simple flush invite column bind cream weekend' },
  { seedPhrase: 'camp afraid torch can useless drastic key flee camp artist oak guitar' },
  { seedPhrase: 'pig exclude wheat giant lake olympic mother goddess index help near copper' },
];

export async function main() {
  await initialize('ws://localhost:9944');

  // Create and register a Provider
  const provider = await new UserBuilder().withKeyUri(PROVIDER_MNEMONIC).asProvider('Narwhal').build();

  // Create keys
  for (const account of accounts) {
    account.keypair = await createAndFundKeypair({ uri: account.seedPhrase });
  }

  const msaMap = new Map<bigint, ChainAccount[]>();

  // Check if any keys have existing MSA
  for (const account of accounts) {
    const msa: Option<u64> = await ExtrinsicHelper.apiPromise.query.msa.publicKeyToMsaId(account.keypair?.publicKey);
    if (msa.isSome) {
      account.msaId = msa.unwrap().toBigInt();
      const msaAccounts = msaMap.get(account.msaId) ?? [];
      msaAccounts.push(account);
      msaMap.set(account.msaId, msaAccounts);
      console.info(`Found existing MSA ${account.msaId} for key ${account.keypair?.address}`);
    }
  }

  // Create more MSAs to a total of 4
  const nonMsaAccounts = accounts.filter((account) => !account.msaId);
  while (msaMap.size < MSA_COUNT && nonMsaAccounts.length > 0) {
    const account = nonMsaAccounts.pop()!;
    const op = ExtrinsicHelper.createMsa(account.keypair!);
    try {
      const [createMsaEvent] = await op.fundAndSend();
      if (createMsaEvent && ExtrinsicHelper.apiPromise.events.msa.MsaCreated.is(createMsaEvent)) {
        account.msaId = createMsaEvent.data.msaId.toBigInt();
        msaMap.set(account.msaId, [account]);
        console.log(`Created MSA ${account.msaId.toString()} with key ${account.seedPhrase}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Unable to create MSA for account: ', JSON.stringify(account), err, err.stack);
      return;
    }
  }

  // Add remaining keys to existing MSA to a max count of 3 keys for each MSA
  for (const account of nonMsaAccounts) {
    // Find an MSA with <= 3 keys to add key to
    const msaAccounts = [...msaMap.values()].find((msaAccounts) => msaAccounts.length < 3);

    // If MSA found to add to, add the key using one of the existing keys
    if (msaAccounts) {
      const msaAccount = msaAccounts[0]!;
      const controlKey = msaAccount.keypair!;
      const keyToAdd = account.keypair;
      const msaId = new u64(ExtrinsicHelper.apiPromise.registry, msaAccount.msaId);
      const payload = await generateAddKeyPayload({
        msaId,
        newPublicKey: keyToAdd?.publicKey,
      });
      const payloadData = ExtrinsicHelper.api.registry.createType('PalletMsaAddKeyData', payload);

      const ownerSignature = signPayloadSr25519(controlKey, payloadData);
      const newSignature = signPayloadSr25519(keyToAdd!, payloadData);
      const op = ExtrinsicHelper.addPublicKeyToMsa(msaAccount.keypair!, ownerSignature, newSignature, payload);
      const [result] = await op.fundAndSend();
      if (!result || !ExtrinsicHelper.apiPromise.events.msa.PublicKeyAdded.is(result)) {
        throw new Error('Unable to add key to MSA');
      }
      account.msaId = msaAccount.msaId;
      msaAccounts.push(account);
      console.log('Added key to MSA');
    }
  }

  console.dir(
    [
      {
        providerId: provider.msaId.toBigInt(),
        address: provider.allKeys[0]?.address,
        seedPhrase: PROVIDER_MNEMONIC,
      },
      ...[...msaMap.entries()].map(([msaId, msaAccounts]) => {
        const accountJson = msaAccounts.map(({ keypair, seedPhrase }) => ({
          seedPhrase,
          publicKey: keypair?.address,
        }));

        return {
          msaId,
          accounts: accountJson,
        };
      }),
    ],
    { depth: null }
  );
}

main()
  .then(async () => {
    console.log('Done');
    await ExtrinsicHelper.disconnect();
  })
  .catch(async (err) => {
    console.log('Caught top-level error:', err);
    await ExtrinsicHelper.disconnect();
  });
