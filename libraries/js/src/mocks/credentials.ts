import { DataIntegrityProof } from '../vc/data-integrity/index.js';
import { cryptosuite as eddsaRdfc2022CryptoSuite } from '../vc/cryptosuite-eddsa/index.js';
import * as vc from '@digitalcredentials/vc';

import {
  SiwaResponseCredentialEmail,
  SiwaResponseCredentialGraph,
  SiwaResponseCredentialPhone,
} from '../types/credential.js';
import { ExampleProviderKey, ExampleUserKey, multibaseEd25519, multibaseSr25519 } from './keys.js';
import { documentLoaderGenerator } from '../documents/loader.js';
import { KeyringPair } from '@polkadot/keyring/types';
import { VerifiedEmailAddress, VerifiedGraphKey, VerifiedPhoneNumber } from '../constants.js';

export async function signCredential<T>(keypair: KeyringPair, credential: Omit<T, 'proof'>): Promise<T> {
  const multicodec = multibaseEd25519(keypair.publicKey);
  // Use the did:web version if it is a "provider key" coming through
  const signerId =
    ExampleProviderKey.keyPairEd().address === keypair.address
      ? `did:web:frequencyaccess.com#${multicodec}`
      : `did:key:${multicodec}`;

  const signer = {
    id: signerId,
    algorithm: 'Ed25519',
    sign: ({ data }: { data: string | Uint8Array }) => {
      return keypair.sign(data, { withType: false });
    },
  };
  const suite = new DataIntegrityProof({ signer, cryptosuite: eddsaRdfc2022CryptoSuite, date: null });

  try {
    const signedCredential = (await vc.issue({
      credential,
      suite,
      documentLoader: documentLoaderGenerator(),
    })) as T;

    return signedCredential;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(e.details ? e.details : e);
  }
  throw new Error('Unable to sign message. See `signCredentialAsAccess`');
}

// Generate a new pair:
// const { publicKey, secretKey } = box.keyPair();
// console.log({
//   publicKey: u8aToHex(publicKey),
//   secretKey: u8aToHex(secretKey),
// });
const exampleX25519 = {
  publicKey: '0xb5032900293f1c9e5822fd9c120b253cb4a4dfe94c214e688e01f32db9eedf17',
  secretKey: '0xd0910c853563723253c4ed105c08614fc8aaaf1b0871375520d72251496e8d87',
};

export const ExampleUserGraphCredential = (): Promise<SiwaResponseCredentialGraph> =>
  signCredential(ExampleUserKey.keyPairEd(), {
    '@context': ['https://www.w3.org/ns/credentials/v2', 'https://www.w3.org/ns/credentials/undefined-terms/v2'],
    type: ['VerifiedGraphKeyCredential', 'VerifiableCredential'],
    issuer: 'did:key:' + multibaseSr25519(ExampleUserKey.keyPair().publicKey),
    validFrom: '2024-08-21T21:28:08.289+0000',
    credentialSchema: {
      type: 'JsonSchema',
      id: VerifiedGraphKey.id,
    },
    credentialSubject: {
      id: 'did:key:' + multibaseSr25519(ExampleUserKey.keyPair().publicKey),
      encodedPublicKeyValue: exampleX25519.publicKey,
      encodedPrivateKeyValue: exampleX25519.secretKey,
      encoding: 'base16',
      format: 'bare',
      type: 'X25519',
      keyType: 'dsnp.public-key-key-agreement',
    },
  });

export const ExampleEmailCredential = (): Promise<SiwaResponseCredentialEmail> =>
  signCredential(ExampleProviderKey.keyPairEd(), {
    '@context': ['https://www.w3.org/ns/credentials/v2', 'https://www.w3.org/ns/credentials/undefined-terms/v2'],
    type: ['VerifiedEmailAddressCredential', 'VerifiableCredential'],
    issuer: 'did:web:frequencyaccess.com',
    validFrom: '2024-08-21T21:28:08.289+0000',
    credentialSchema: {
      type: 'JsonSchema',
      id: VerifiedEmailAddress.id,
    },
    credentialSubject: {
      id: 'did:key:' + multibaseSr25519(ExampleUserKey.keyPair().publicKey),
      emailAddress: 'john.doe@example.com',
      lastVerified: '2024-08-21T21:27:59.309+0000',
    },
  });

export const ExamplePhoneCredential = (): Promise<SiwaResponseCredentialPhone> =>
  signCredential(ExampleProviderKey.keyPairEd(), {
    '@context': ['https://www.w3.org/ns/credentials/v2', 'https://www.w3.org/ns/credentials/undefined-terms/v2'],
    type: ['VerifiedPhoneNumberCredential', 'VerifiableCredential'],
    issuer: 'did:web:frequencyaccess.com',
    validFrom: '2024-08-21T21:28:08.289+0000',
    credentialSchema: {
      type: 'JsonSchema',
      id: VerifiedPhoneNumber.id,
    },
    credentialSubject: {
      id: 'did:key:' + multibaseSr25519(ExampleUserKey.keyPair().publicKey),
      phoneNumber: '+01-234-867-5309',
      lastVerified: '2024-08-21T21:27:59.309+0000',
    },
  });
