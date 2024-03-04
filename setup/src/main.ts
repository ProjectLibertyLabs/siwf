import '@frequency-chain/api-augment';
import {
  createAndFundKeypair,
  ExtrinsicHelper,
  generateAddKeyPayload,
  generateClaimHandlePayload,
  generateDelegationPayload,
  initialize,
  signPayloadSr25519,
  Sr25519Signature,
  UserBuilder,
} from 'frequency-scenario-template';
import type { KeyringPair } from '@polkadot/keyring/types';
import { PalletCapacityCapacityDetails } from '@polkadot/types/lookup';
import { Option } from '@polkadot/types';

// Monkey-patch BigInt so that JSON.stringify will work
// eslint-disable-next-line
(BigInt as any).prototype['toJSON'] = function () {
  return this.toString();
};

interface ChainAccount {
  seedPhrase: string;
  keypairs: KeyringPair[];
  msaId: string;
  handle: string;
  doDelegate?: boolean;
  delegatedSchemas?: number[];
}

const PROVIDER_MNEMONIC = 'lounge monster rotate olympic grass correct potato pumpkin inside scissors lucky vote';
const KEYS_PER_ACCOUNT = 3;

const accounts: ChainAccount[] = [
  {
    seedPhrase: 'dynamic split hedgehog grain bench toy rotate baby salon creek earn virus',
    keypairs: [],
    msaId: '',
    handle: 'cp_user_1',
    doDelegate: true,
    delegatedSchemas: [5, 7, 8, 9, 10],
  },
  {
    seedPhrase: 'delay man segment gallery project plug thrive wool alcohol secret damage gold',
    keypairs: [],
    msaId: '',
    handle: 'cp_user_2',
    doDelegate: true,
    delegatedSchemas: [5, 7, 8],
  },
  {
    seedPhrase: 'lab palm dawn net junior rubber mule fault post immune panic ethics',
    keypairs: [],
    msaId: '',
    handle: 'cp_user_3',
  },
  {
    seedPhrase: 'coral tuna volcano lawsuit crime half area seed rapid mystery under reopen',
    keypairs: [],
    msaId: '',
    handle: 'cp_user_4',
  },
];

const AMOUNT_TO_STAKE = 1_000_000_000_000n;

async function addPublicKeyToMsa(msaId: bigint, controlKey: KeyringPair, newKey: KeyringPair) {
  const payload = await generateAddKeyPayload({ msaId, newPublicKey: newKey.publicKey });
  const payloadData = ExtrinsicHelper.api.registry.createType('PalletMsaAddKeyData', payload);
  const op = ExtrinsicHelper.addPublicKeyToMsa(
    controlKey,
    signPayloadSr25519(controlKey, payloadData),
    signPayloadSr25519(newKey, payloadData),
    payload
  );
  const [result] = await op.fundAndSend();
  if (!result || !ExtrinsicHelper.api.events.msa.PublicKeyAdded.is(result)) {
    throw new Error(`Unable to add key ${newKey.address} to MSA ${msaId}`);
  }
  console.info(`Added key ${newKey.address} to MSA ${msaId}`);
}

export async function main() {
  await initialize('ws://localhost:9944');

  // Create and register a Provider
  const provider = await new UserBuilder()
    .withKeyUri(PROVIDER_MNEMONIC)
    .withInitialFundingLevel(AMOUNT_TO_STAKE)
    .asProvider('Acme')
    .build();
  const capacityResult: Option<PalletCapacityCapacityDetails> =
    (await ExtrinsicHelper.apiPromise.query.capacity.capacityLedger(provider.providerId)) as unknown as never;
  const capacity = capacityResult.unwrapOr({ totalCapacityIssued: 0n });
  const stakeAmount =
    AMOUNT_TO_STAKE -
    (typeof capacity.totalCapacityIssued === 'bigint'
      ? capacity.totalCapacityIssued
      : capacity.totalCapacityIssued.toBigInt());
  await ExtrinsicHelper.stake(provider.keypair, provider.providerId, stakeAmount).signAndSend();

  // Create keys
  for (const account of accounts) {
    for (const index in Array(KEYS_PER_ACCOUNT).fill(0)) {
      account.keypairs.push(
        await createAndFundKeypair({ amount: 1_000_000_000n, uri: account.seedPhrase + `//${index}` })
      );
    }
  }

  // Check if any keys have existing MSA
  for (const account of accounts) {
    let controlKey: KeyringPair | undefined;
    for (const keypair of account.keypairs) {
      const msa = await ExtrinsicHelper.apiPromise.query.msa.publicKeyToMsaId(keypair.publicKey);
      if (msa.isSome) {
        const msaId = msa.unwrap().toString();
        if (!!account.msaId && account.msaId !== msaId) {
          throw new Error(
            `Key mismatch: attempting to add key ${keypair.address} to MSA ${account.msaId}, but it already belongs to MSA ${msaId}`
          );
        }
        if (controlKey === undefined) {
          controlKey = keypair;
        }
        account.msaId = msaId.toString();
        console.info(`Found existing MSA ${account.msaId} for key ${keypair.address}`);
      }
    }

    // Make sure all keys are added to MSA
    if (!!account.msaId && !!controlKey) {
      for (const keypair of account.keypairs) {
        const msa = await ExtrinsicHelper.apiPromise.query.msa.publicKeyToMsaId(keypair.publicKey);
        if (msa.isNone) {
          await addPublicKeyToMsa(BigInt(account.msaId!), controlKey, keypair);
        }
      }
    }
  }

  // Create more MSAs to a total of 4
  const nonMsaAccounts = accounts.filter((account) => !account.msaId);
  for (const account of nonMsaAccounts) {
    const controlKey = account.keypairs[0]!;
    const handlePayload = await generateClaimHandlePayload(account.handle);
    const handlePayloadData = ExtrinsicHelper.api.registry.createType(
      'CommonPrimitivesHandlesClaimHandlePayload',
      handlePayload
    );
    let signature: Sr25519Signature;
    try {
      if (account?.doDelegate) {
        const payload = await generateDelegationPayload({
          authorizedMsaId: provider.msaId,
          schemaIds: account?.delegatedSchemas ? [...account.delegatedSchemas] : [],
        });
        signature = signPayloadSr25519(controlKey, ExtrinsicHelper.api.createType('PalletMsaAddProvider', payload));
        let op = ExtrinsicHelper.createSponsoredAccountWithDelegation(
          controlKey,
          provider.allKeys[0]!,
          signature,
          payload
        );
        const [createMsaEvent] = await op.payWithCapacity();
        if (createMsaEvent && ExtrinsicHelper.apiPromise.events.msa.MsaCreated.is(createMsaEvent)) {
          account.msaId = createMsaEvent.data.msaId.toString();
          console.log(`Created MSA ${account.msaId} with key ${account.seedPhrase}`);
        }

        signature = signPayloadSr25519(controlKey, handlePayloadData);
        op = ExtrinsicHelper.claimHandleWithProvider(controlKey, provider.allKeys[0]!, signature, handlePayload);
        const [handleResult] = await op.fundAndSend();
        if (handleResult && ExtrinsicHelper.api.events.handles.HandleClaimed.is(handleResult)) {
          console.info(`Claimed handle '${handleResult.data.handle} for MSA ${account.msaId}`);
        }
      } else {
        const [createMsaEvent] = await ExtrinsicHelper.createMsa(controlKey).fundAndSend();
        if (createMsaEvent && ExtrinsicHelper.apiPromise.events.msa.MsaCreated.is(createMsaEvent)) {
          account.msaId = createMsaEvent.data.msaId.toString();
          console.log(`Created MSA ${account.msaId} with key ${account.seedPhrase}`);
        }

        signature = signPayloadSr25519(controlKey, handlePayloadData);
        const [handleResult] = await ExtrinsicHelper.claimHandle(controlKey, handlePayload).fundAndSend();
        if (handleResult && ExtrinsicHelper.api.events.handles.HandleClaimed.is(handleResult)) {
          console.info(`Claimed handle '${handleResult.data.handle} for MSA ${account.msaId}`);
        }
      }

      for (const key of account.keypairs.slice(1)) {
        const msa = await ExtrinsicHelper.apiPromise.query.msa.publicKeyToMsaId(key.publicKey);
        if (!msa.isNone) {
          console.log(`Key ${key.address} already present for MSA ${account.msaId}`);
          continue;
        }
        await addPublicKeyToMsa(BigInt(account.msaId!), controlKey, key);
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
