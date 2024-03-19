import { validateSignupExtrinsicsParams } from './helpers';
import { describe, expect, it, vi } from 'vitest';
import { EncodedExtrinsic } from './types';
import { ApiPromise } from '@polkadot/api';

describe('validateSignupExtrinsicsParams', () => {
  const sponsoredAccountHexEncodedCall =
    '0xcd01043c016200ac6bfd670518c6c5fe019cec44e135b9d46fe05183615d61c742c54ce80301f45f161ff40d23dd72a25150ee9dda4478b627c8e054e5e0deed22f598af093c01cf3f679a08f191c80b93dc3eff4bb1c30c8277ffa976586a2fa97ac2ebb08d010000000000000004000032000000';
  const claimHandleHexEncoded =
    '0xb9010442006200ac6bfd670518c6c5fe019cec44e135b9d46fe05183615d61c742c54ce80301246c417d7601dd02b395cb62e4ab57c09ea3892fa4e6757dcd86331fca104d0a444729c05d9383c4ba529705b8db7554be665ac4b28a74a4cc687faf4e4fca8314656e64647932000000';

  const sponsoredAccountCallIndex = new Uint8Array([60, 1]);
  const claimHandleCallIndex = new Uint8Array([66, 0]);

  const sponsoredAccountArgs = [
    { toHex: vi.fn().mockReturnValue('0x6200ac6bfd670518c6c5fe019cec44e135b9d46fe05183615d61c742c54ce803') },
    {
      toHex: vi
        .fn()
        .mockReturnValue(
          '0x01f45f161ff40d23dd72a25150ee9dda4478b627c8e054e5e0deed22f598af093c01cf3f679a08f191c80b93dc3eff4bb1c30c8277ffa976586a2fa97ac2ebb08d'
        ),
    },
    {
      toJSON: vi.fn().mockReturnValue({ authorizedMsaId: 1, expiration: 50, schemaIds: [0] }),
      toU8a: vi.fn().mockReturnValue(new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 50, 0, 0, 0])),
    },
  ];

  const claimHandleArgs = [
    { toHex: vi.fn().mockReturnValue('0x6200ac6bfd670518c6c5fe019cec44e135b9d46fe05183615d61c742c54ce803') },
    {
      toHex: vi
        .fn()
        .mockReturnValue(
          '0x01246c417d7601dd02b395cb62e4ab57c09ea3892fa4e6757dcd86331fca104d0a444729c05d9383c4ba529705b8db7554be665ac4b28a74a4cc687faf4e4fca83'
        ),
    },
    {
      toJSON: vi.fn().mockReturnValue({ baseHandle: '0x656e646479', expiration: 50 }),
      toU8a: vi.fn().mockReturnValue(new Uint8Array([20, 101, 110, 100, 100, 121, 50, 0, 0, 0])),
    },
  ];

  const mockTxFn = (hexEncodedCall) => {
    if (hexEncodedCall == sponsoredAccountHexEncodedCall) {
      return {
        callIndex: sponsoredAccountCallIndex,
        args: sponsoredAccountArgs,
      };
    }

    if (hexEncodedCall == claimHandleHexEncoded) {
      return {
        callIndex: claimHandleCallIndex,
        args: claimHandleArgs,
      };
    }

    return {};
  };

  const api = {
    isReady: Promise.resolve(true),
    tx: vi.fn().mockImplementation(mockTxFn),
    rpc: {
      chain: {
        getBlock: vi
          .fn()
          .mockResolvedValue({ block: { header: { number: { toNumber: vi.fn().mockReturnValue(0) } } } }),
      },
    },
    registry: {
      findMetaCall: vi.fn().mockImplementation((callIndex) => {
        if (callIndex[0] == 60) {
          return { method: 'createSponsoredAccountWithDelegation', section: 'msa' };
        }

        if (callIndex[0] == 66) {
          return { method: 'claimHandle', section: 'handles' };
        }

        if (callIndex[0] == 16) {
          return { method: 'someMethod', section: 'someSection' };
        }
      }),
    },
  };
  it('returns the correct response', async () => {
    const signupPayload: EncodedExtrinsic[] = [
      {
        pallet: 'msa',
        extrinsicName: 'createSponsoredAccountWithDelegation',
        encodedExtrinsic: sponsoredAccountHexEncodedCall,
      },
      {
        pallet: 'handles',
        extrinsicName: 'claimHandle',
        encodedExtrinsic: claimHandleHexEncoded,
      },
    ];
    const providerMsaId = '1';

    const result = await validateSignupExtrinsicsParams(signupPayload, providerMsaId, api as unknown as ApiPromise);

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
      calls: signupPayload,
    });
  });

  describe('when not a signed up call', () => {
    it('throws an error', async () => {
      const signupPayload: EncodedExtrinsic[] = [
        {
          pallet: 'someSection',
          extrinsicName: 'someMethod',
          encodedExtrinsic:
            '0xcd01043c016200ac6bfd670518c6c5fe019cec44e135b9d46fe05183615d61c742c54ce80301f45f161ff40d23dd72a25150ee9dda4478b627c8e054e5e0deed22f598af093c01cf3f679a08f191c80b93dc3eff4bb1c30c8277ffa976586a2fa97ac2ebb08d010000000000000004000032000000',
        },
      ];
      const providerMsaId = 1;

      await expect(() =>
        validateSignupExtrinsicsParams(signupPayload, providerMsaId, api as unknown as ApiPromise)
      ).rejects.toThrowError(/Unsupported extrinsic call: someMethod/);
    });
  });
});
