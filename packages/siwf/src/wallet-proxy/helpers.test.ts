import { options } from '@frequency-chain/api-augment';
import {
  checkExpiration,
  decodeExtrinsic,
  isClaimHandleParams,
  isSponsoredAccountParams,
  parseValidationArgs,
  validateAddProviderPayload,
  validateClaimHandleParams,
  validateSignature,
  validateSignupExtrinsicsParams,
} from './helpers';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { ClaimHandleParams, EncodedExtrinsic, SponsoredAccountParams } from './types';
import { ApiPromise } from '@polkadot/api';
import { HexString } from '@polkadot/util/types';
import { SignUpCall, SignupError } from './enums';
import { AnyJson, CallFunction, ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { Call, Extrinsic, SignedBlock } from '@polkadot/types/interfaces';
import { TypeRegistry } from '@polkadot/types';
import { MockProvider } from '@polkadot/rpc-provider/mock';

type TestCallArg = {
  name: string;
  value: unknown;
  toHex?: () => HexString;
  toJSON?: () => AnyJson;
  toU8a?: () => Uint8Array;
};

type TestData = {
  encodedCall: HexString;
  section: string;
  method: string;
  callIndex: Uint8Array;
  args: TestCallArg[];
};

function toEncodedExtrinsic(e: TestData): EncodedExtrinsic {
  return {
    pallet: e.section,
    extrinsicName: e.method,
    encodedExtrinsic: e.encodedCall,
  };
}

const extrinsics: TestData[] = [
  {
    encodedCall:
      '0xcd01043c016200ac6bfd670518c6c5fe019cec44e135b9d46fe05183615d61c742c54ce80301f45f161ff40d23dd72a25150ee9dda4478b627c8e054e5e0deed22f598af093c01cf3f679a08f191c80b93dc3eff4bb1c30c8277ffa976586a2fa97ac2ebb08d010000000000000004000032000000',
    section: 'msa',
    method: SignUpCall.CreateSponsoredAccountWithDelegation,
    callIndex: new Uint8Array([60, 1]),
    args: [
      {
        name: 'delegatorKey',
        value: '5EHCkT3rPBMrCabta778SiUVvNhYfG8BJ8Cfp5iFsNxvMTCg',
        toHex: () => '0x6200ac6bfd670518c6c5fe019cec44e135b9d46fe05183615d61c742c54ce803',
      },
      {
        name: 'proof',
        value:
          '0xf45f161ff40d23dd72a25150ee9dda4478b627c8e054e5e0deed22f598af093c01cf3f679a08f191c80b93dc3eff4bb1c30c8277ffa976586a2fa97ac2ebb08d',
        toHex: () =>
          '0xf45f161ff40d23dd72a25150ee9dda4478b627c8e054e5e0deed22f598af093c01cf3f679a08f191c80b93dc3eff4bb1c30c8277ffa976586a2fa97ac2ebb08d',
      },
      {
        name: 'payload',
        value: {
          authorizedMsaId: 1,
          schemaIds: [0],
          expiration: 50,
        },
        toJSON: () => ({ authorizedMsaId: 1, expiration: 50, schemaIds: [0] }),
        toU8a: () => new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 50, 0, 0, 0]),
      },
    ],
  },
  {
    encodedCall:
      '0xb9010442006200ac6bfd670518c6c5fe019cec44e135b9d46fe05183615d61c742c54ce80301246c417d7601dd02b395cb62e4ab57c09ea3892fa4e6757dcd86331fca104d0a444729c05d9383c4ba529705b8db7554be665ac4b28a74a4cc687faf4e4fca8314656e64647932000000',
    section: 'handles',
    method: SignUpCall.ClaimHandle,
    callIndex: new Uint8Array([66, 0]),
    args: [
      {
        name: 'msaOwnerKey',
        value: '5EHCkT3rPBMrCabta778SiUVvNhYfG8BJ8Cfp5iFsNxvMTCg',
        toHex: () => '0x6200ac6bfd670518c6c5fe019cec44e135b9d46fe05183615d61c742c54ce803',
      },
      {
        name: 'proof',
        value:
          '0x246c417d7601dd02b395cb62e4ab57c09ea3892fa4e6757dcd86331fca104d0a444729c05d9383c4ba529705b8db7554be665ac4b28a74a4cc687faf4e4fca83',
        toHex: () =>
          '0x246c417d7601dd02b395cb62e4ab57c09ea3892fa4e6757dcd86331fca104d0a444729c05d9383c4ba529705b8db7554be665ac4b28a74a4cc687faf4e4fca83',
      },
      {
        name: 'payload',
        value: {
          baseHandle: 'enddy',
          expiration: 50,
        },
        toJSON: () => ({ baseHandle: '0x656e646479', expiration: 50 }),
        toU8a: () => new Uint8Array([20, 101, 110, 100, 100, 121, 50, 0, 0, 0]),
      },
    ],
  },
  {
    encodedCall:
      '0x3c038eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a4801a21a0ffbe48e784521e3c00d8dc305dfb7724139060b4902b3d191db6b0c472dad759ad5868f482a547094249fba76173ad980b424bc5e371d8592cd3b3c058101000000000000001405000700080009000a00ed5f8400',
    section: 'msa',
    method: SignUpCall.GrantDelegation,
    callIndex: new Uint8Array([60, 3]),
    args: [
      {
        name: 'delegatorKey',
        value: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        toHex: () => '0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48',
        toJSON: () => '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        toU8a: () =>
          new Uint8Array([
            142, 175, 4, 21, 22, 135, 115, 99, 38, 201, 254, 161, 126, 37, 252, 82, 135, 97, 54, 147, 201, 18, 144, 156,
            178, 38, 170, 71, 148, 242, 106, 72,
          ]),
      },
      {
        name: 'proof',
        value:
          '0x01e0dd3506727be6b771755fc3c5ab3c876183d31acdc54df4f896956c86244237ff535df0888e18794f998c3e9980bff626df116a393d1309459239c0e536dc87',
        toHex: () =>
          '0x01e0dd3506727be6b771755fc3c5ab3c876183d31acdc54df4f896956c86244237ff535df0888e18794f998c3e9980bff626df116a393d1309459239c0e536dc87',
        toJSON: () => ({
          sr25519:
            '0xe0dd3506727be6b771755fc3c5ab3c876183d31acdc54df4f896956c86244237ff535df0888e18794f998c3e9980bff626df116a393d1309459239c0e536dc87',
        }),
        toU8a: () =>
          new Uint8Array([
            1, 224, 221, 53, 6, 114, 123, 230, 183, 113, 117, 95, 195, 197, 171, 60, 135, 97, 131, 211, 26, 205, 197,
            77, 244, 248, 150, 149, 108, 134, 36, 66, 55, 255, 83, 93, 240, 136, 142, 24, 121, 79, 153, 140, 62, 153,
            128, 191, 246, 38, 223, 17, 106, 57, 61, 19, 9, 69, 146, 57, 192, 229, 54, 220, 135,
          ]),
      },
      {
        name: 'payload',
        value: {
          authorizedMsaId: 1,
          schemaIds: [5, 7, 8, 9, 10],
          expiration: 8675309,
        },
        toHex: () => '0x01000000000000001405000700080009000a00ed5f8400',
        toJSON: () => ({
          authorizedMsaId: 1,
          schemaIds: [5, 7, 8, 9, 10],
          expiration: 8675309,
        }),
        toU8a: () => new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 20, 5, 0, 7, 0, 8, 0, 9, 0, 10, 0, 237, 95, 132, 0]),
      },
    ],
  },
];

const providerMsaId = '1';
const createNewAccountResponse = [extrinsics[0], extrinsics[1]].map((e) => toEncodedExtrinsic(e));
const addNewProviderResponse = [extrinsics[2]].map((e) => toEncodedExtrinsic(e));

function toBlock(b: number): SignedBlock {
  return {
    block: { header: { number: { toNumber: () => b } } },
  } as SignedBlock;
}

const mockTxFn = (hexEncodedCall: string | Uint8Array | Call | Extrinsic) => {
  const callObj = extrinsics.find((e) => e.encodedCall === hexEncodedCall);
  if (!callObj) {
    throw new Error();
  }

  return callObj as unknown as SubmittableExtrinsic<'promise', ISubmittableResult>;
};

let mockProvider: MockProvider;
let api: ApiPromise;

beforeAll(async () => {
  const registry = new TypeRegistry();
  mockProvider = new MockProvider(registry);
  api = await ApiPromise.create({ ...options, provider: mockProvider, registry });
});

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(api, 'tx').mockImplementation(mockTxFn);
  vi.spyOn(api.registry, 'findMetaCall').mockImplementation((callIndex: Uint8Array) => {
    const metaInfo = extrinsics.find((e) => e.callIndex === callIndex);
    if (!metaInfo) {
      throw new Error();
    }

    const { section, method } = metaInfo;

    return { section, method } as unknown as CallFunction;
  });
});

describe('type guards', () => {
  const sponsoredAccountPayload: SponsoredAccountParams = {
    proof: '0x1234',
    payload: {
      authorizedMsaId: '1',
      schemaIds: [],
      expiration: 1,
    },
    delegatorKey: '0x1234',
  };

  const claimHandlePayload: ClaimHandleParams = {
    proof: '0x1234',
    msaOwnerKey: '0x1234',
    payload: {
      baseHandle: 'some_handle',
      expiration: 20,
    },
  };

  describe('isSponsoredAccountParams', () => {
    it('returns true for an object matching type', () => {
      expect(isSponsoredAccountParams(sponsoredAccountPayload)).toBeTruthy();
    });

    it('returns false for an object not matching type', () => {
      expect(isSponsoredAccountParams(claimHandlePayload)).not.toBeTruthy();
    });
  });

  describe('isClaimHandleParams', () => {
    it('returns true for an object matching type', () => {
      expect(isClaimHandleParams(claimHandlePayload)).toBeTruthy();
    });
    it('returns false for an object not matching type', () => {
      expect(isClaimHandleParams(sponsoredAccountPayload)).not.toBeTruthy();
    });
  });
});

describe('decodeExtrinsic', () => {
  it('throws error if not hex-encoded', async () => {
    await expect(() => decodeExtrinsic('0xbad extrinsic', api)).rejects.toThrowError(SignupError.InvalidHex);
  });

  it('throws error if Polkadot api is not ready', async () => {
    const unreadyApi = { isReady: Promise.reject() } as unknown as ApiPromise;
    await expect(() => decodeExtrinsic('0x1234', unreadyApi)).rejects.toThrowError(SignupError.ApiNotReady);
  });

  it.each(extrinsics)('returns correct method, section, and args ($section, $method)', async (extrinsic) => {
    const { method, section, args } = await decodeExtrinsic(extrinsic.encodedCall as `0x${string}`, api);
    expect(method).toStrictEqual(extrinsic.method);
    expect(section).toStrictEqual(extrinsic.section);
    expect(args).toStrictEqual(extrinsic.args);
  });
});

describe('validateSignature', () => {
  it.each(extrinsics)('returns for valid signed payload ($section, $method)', async (extrinsic) => {
    const publicKeyArg = extrinsic.args.find((arg) => /[Kk]ey/.test(arg.name));
    const signatureArg = extrinsic.args.find((arg) => /proof/.test(arg.name));
    const payloadArg = extrinsic.args.find((arg) => /payload/.test(arg.name));

    if (!publicKeyArg || !signatureArg || !payloadArg) {
      throw new Error('Missing required args');
    }
    await expect(
      validateSignature(publicKeyArg?.toHex!() as HexString, signatureArg?.toHex!() as HexString, payloadArg?.toU8a!())
    ).resolves.not.toThrow();
  });

  it('throws if invalid signature length', async () => {
    await expect(validateSignature('0x0', '0x0', [])).rejects.toThrowError('Invalid signature length');
  });

  it('throws if signature not valid', async () => {
    const publicKey = extrinsics[0].args[0].toHex!();
    const signature = extrinsics[0].args[1].toHex!();
    const payload = new Uint8Array();

    await expect(validateSignature(publicKey as HexString, signature as HexString, payload)).rejects.toThrowError(
      SignupError.InvalidSignature
    );
  });
});

describe('checkExpiration', () => {
  it('returns if not expired', async () => {
    vi.spyOn(api.rpc.chain, 'getBlock').mockResolvedValue(toBlock(0));
    await expect(checkExpiration(50, api)).resolves.not.toThrow();
  });

  it('throws if expired', async () => {
    vi.spyOn(api.rpc.chain, 'getBlock').mockResolvedValue(toBlock(51));
    await expect(checkExpiration(50, api)).rejects.toThrowError(SignupError.ExpiredSignature);
  });
});

describe('parseValidationArgs', async () => {
  it.each(extrinsics)('returns correct args ($section, $method)', async (extrinsic) => {
    const parsedArgs = await parseValidationArgs(extrinsic.encodedCall as HexString, api);

    const { section, method, publicKey, proof, payload } = parsedArgs;
    expect(section).toStrictEqual(extrinsic.section);
    expect(method).toStrictEqual(extrinsic.method);
    expect(publicKey).toStrictEqual(extrinsic.args[0].toHex!());
    expect(proof).toStrictEqual(extrinsic.args[1].value);
    expect(payload.toJSON()).toStrictEqual(extrinsic.args[2].toJSON!());
  });
});

describe('validateClaimHandleParams', () => {
  it('should throw if unsupported method', async () => {
    await expect(validateClaimHandleParams(extrinsics[0].encodedCall, api)).rejects.toThrowError(
      SignupError.UnsupportedExtrinsic
    );
  });
});

describe('validateAddProviderPayload', () => {
  it('should throw if unsupported method', async () => {
    await expect(validateAddProviderPayload(extrinsics[1].encodedCall, '1', api)).rejects.toThrowError(
      SignupError.UnsupportedExtrinsic
    );
  });

  it('should throw if provider ID mismatch', async () => {
    vi.spyOn(api.rpc.chain, 'getBlock').mockResolvedValue(toBlock(0));
    await expect(validateAddProviderPayload(extrinsics[0].encodedCall, '2', api)).rejects.toThrowError(
      SignupError.InvalidMsaId
    );
  });
});

describe('validateSignupExtrinsicsParams', () => {
  it('returns the correct response (new account)', async () => {
    vi.spyOn(api.rpc.chain, 'getBlock').mockResolvedValue(toBlock(0));

    const result = await validateSignupExtrinsicsParams(createNewAccountResponse, providerMsaId, api);

    expect(result).toEqual({
      publicKey: '0x6200ac6bfd670518c6c5fe019cec44e135b9d46fe05183615d61c742c54ce803',
      expiration: 50,
      payloads: {
        addProviderPayload: {
          authorizedMsaId: 1,
          expiration: 50,
          schemaIds: [0],
        },
        claimHandlePayload: {
          baseHandle: '0x656e646479',
          expiration: 50,
        },
      },
      calls: createNewAccountResponse,
    });
  });

  it('returns the correct response (new/updated delegation)', async () => {
    vi.spyOn(api.rpc.chain, 'getBlock').mockResolvedValue(toBlock(0));

    const result = await validateSignupExtrinsicsParams(addNewProviderResponse, providerMsaId, api);

    expect(result).toEqual({
      publicKey: '0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48',
      expiration: 8675309,
      payloads: {
        addProviderPayload: {
          authorizedMsaId: 1,
          expiration: 8675309,
          schemaIds: [5, 7, 8, 9, 10],
        },
      },
      calls: addNewProviderResponse,
    });
  });

  it('throws an error when not a recognized signup extrinsic', async () => {
    const signupPayload: EncodedExtrinsic[] = [
      {
        pallet: 'msa',
        extrinsicName: 'someMethod',
        encodedExtrinsic:
          '0xcd01043c016200ac6bfd670518c6c5fe019cec44e135b9d46fe05183615d61c742c54ce80301f45f161ff40d23dd72a25150ee9dda4478b627c8e054e5e0deed22f598af093c01cf3f679a08f191c80b93dc3eff4bb1c30c8277ffa976586a2fa97ac2ebb08d010000000000000004000032000000',
      },
    ];
    const providerMsaId = '1';

    await expect(() => validateSignupExtrinsicsParams(signupPayload, providerMsaId, api)).rejects.toThrowError(
      SignupError.UnsupportedExtrinsic
    );
  });

  it('throws an error if signing key mismatch', async () => {
    const mismatchedPayload = [extrinsics[1], extrinsics[2]].map((e) => toEncodedExtrinsic(e));
    vi.spyOn(api.rpc.chain, 'getBlock').mockResolvedValue(toBlock(0));

    await expect(validateSignupExtrinsicsParams(mismatchedPayload, providerMsaId, api)).rejects.toThrowError(
      SignupError.SignupKeysMismatch
    );
  });
});
