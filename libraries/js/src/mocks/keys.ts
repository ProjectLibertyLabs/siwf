import { Keyring } from '@polkadot/keyring';
import bs58 from 'bs58';

const keyring = new Keyring({ type: 'sr25519' });
const keyringEd25519 = new Keyring({ type: 'ed25519' });

export function multibaseSr25519(publicKey: string | Uint8Array): string {
  const keyBuf =
    typeof publicKey === 'string' ? Buffer.from(publicKey.replace('0x', ''), 'hex') : Buffer.from(publicKey);
  return 'z' + bs58.encode(Buffer.concat([Buffer.from('ef01', 'hex'), keyBuf]));
}

export function multibaseEd25519(publicKey: string | Uint8Array): string {
  const keyBuf =
    typeof publicKey === 'string' ? Buffer.from(publicKey.replace('0x', ''), 'hex') : Buffer.from(publicKey);
  return 'z' + bs58.encode(Buffer.concat([Buffer.from('ed01', 'hex'), keyBuf]));
}

// Provider/Application. All derived from //Alice
export const ExampleProviderKey = {
  uri: '//Alice',
  public: 'f6cL4wq1HUNx11TcvdABNf9UNXXoyH47mVUwT59tzSFRW8yDH',
  public42: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  keyPair: () => keyring.createFromUri('//Alice'),
  keyPairEd: () => keyringEd25519.createFromUri('//Alice'),
};
// User. All derived from //Bob
export const ExampleUserKey = {
  uri: '//Bob',
  public: 'f6akufkq9Lex6rT8RCEDRuoZQRgo5pWiRzeo81nmKNGWGNJdJ',
  public42: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
  keyPair: () => keyring.createFromUri('//Bob'),
  keyPairEd: () => keyringEd25519.createFromUri('//Bob'),
};
