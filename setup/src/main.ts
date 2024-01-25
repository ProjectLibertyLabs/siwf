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
  keypairs: KeyringPair[];
  msaId?: bigint;
}

const PROVIDER_MNEMONIC = 'lounge monster rotate olympic grass correct potato pumpkin inside scissors lucky vote';
const KEYS_PER_ACCOUNT = 3;

const accounts: ChainAccount[] = [
  { seedPhrase: 'dynamic split hedgehog grain bench toy rotate baby salon creek earn virus', keypairs: [] },
  { seedPhrase: 'delay man segment gallery project plug thrive wool alcohol secret damage gold', keypairs: [] },
  { seedPhrase: 'lab palm dawn net junior rubber mule fault post immune panic ethics', keypairs: [] },
  { seedPhrase: 'coral tuna volcano lawsuit crime half area seed rapid mystery under reopen', keypairs: [] },
  // { seedPhrase: 'heavy shock slow acoustic horse flat unable student habit material canyon quote' },
  // { seedPhrase: 'ask nature cook mobile analyst clerk finger depend crush inquiry survey worry' },
  // { seedPhrase: 'hello area art local blind detect avocado run slide fiction aspect popular' },
  // { seedPhrase: 'wing royal salute vacuum valve mean draft cause right logic canoe begin' },
  // { seedPhrase: 'giraffe seven camera hobby front pact anxiety rural endless width crush muscle' },
  // { seedPhrase: 'summer joke fire ivory practice simple flush invite column bind cream weekend' },
  // { seedPhrase: 'camp afraid torch can useless drastic key flee camp artist oak guitar' },
  // { seedPhrase: 'pig exclude wheat giant lake olympic mother goddess index help near copper' },
];

export async function main() {
  await initialize('ws://localhost:9944');

  // Create and register a Provider
  const provider = await new UserBuilder().withKeyUri(PROVIDER_MNEMONIC).asProvider('Narwhal').build();

  // Create keys
  for (const account of accounts) {
    for (const index in Array(KEYS_PER_ACCOUNT).fill(0)) {
      account.keypairs.push(await createAndFundKeypair({ uri: account.seedPhrase + `//${index}` }));
    }
  }

  const msaMap = new Map<bigint, ChainAccount[]>();

  // Check if any keys have existing MSA
  for (const account of accounts) {
    for (const keypair of account.keypairs) {
      const msa: Option<u64> = await ExtrinsicHelper.apiPromise.query.msa.publicKeyToMsaId(keypair?.publicKey);
      if (msa.isSome) {
        const msaId = msa.unwrap().toBigInt();
        if (!!account.msaId && account.msaId !== msaId) {
          throw new Error(
            `Key mismatch: attempting to add key ${keypair.address} to MSA ${account.msaId}, but it already belongs to MSA ${msaId}`
          );
        }
        account.msaId = msaId;
        console.info(`Found existing MSA ${account.msaId} for key ${keypair.address}`);
      }
    }
  }

  // Create more MSAs to a total of 4
  const nonMsaAccounts = accounts.filter((account) => !account.msaId);
  for (const account of nonMsaAccounts) {
    try {
      const op = ExtrinsicHelper.createMsa(account.keypairs[0]!);
      const [createMsaEvent] = await op.fundAndSend();
      if (createMsaEvent && ExtrinsicHelper.apiPromise.events.msa.MsaCreated.is(createMsaEvent)) {
        account.msaId = createMsaEvent.data.msaId.toBigInt();
        msaMap.set(account.msaId, [account]);
        console.log(`Created MSA ${account.msaId.toString()} with key ${account.seedPhrase}`);
      }

      for (const key of account.keypairs.slice(1)) {
        const msa = await ExtrinsicHelper.apiPromise.query.msa.publicKeyToMsaId(key.publicKey);
        if (!msa.isNone) {
          console.log(`Key ${key.address} already present for MSA ${account.msaId}`);
          continue;
        }
        const payload = await generateAddKeyPayload({ msaId: account.msaId!, newPublicKey: key.publicKey });
        const payloadData = ExtrinsicHelper.api.registry.createType('PalletMsaAddKeyData', payload);
        const keyOp = ExtrinsicHelper.addPublicKeyToMsa(
          account.keypairs[0]!,
          signPayloadSr25519(account.keypairs[0]!, payloadData),
          signPayloadSr25519(key, payloadData),
          payload
        );
        const [result] = await keyOp.fundAndSend();
        if (!result || !ExtrinsicHelper.apiPromise.events.msa.PublicKeyAdded.is(result)) {
          throw new Error(`Unable to add key ${key.address} to MSA ${account.msaId}`);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error({ msg: 'Unable to create MSA for account: ', account, err }, { depth: null });
      return;
    }
  }

  console.dir(
    [
      {
        providerId: provider.msaId.toBigInt(),
        address: provider.allKeys[0]?.address,
        seedPhrase: PROVIDER_MNEMONIC,
      },
      ...accounts.map((account) => ({
        msaId: account.msaId,
        keys: account.keypairs.map((key, index) => ({
          seed: `${account.seedPhrase}//${index}`,
          address: key.address,
        })),
      })),
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
