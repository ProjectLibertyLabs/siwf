/* eslint-disable @typescript-eslint/no-explicit-any  */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
declare module '@digitalcredentials/vc' {
  /**
   * Creates a proof purpose that will validate whether or not the verification
   * method in a proof was authorized by its declared controller for the
   * proof's purpose.
   */
  export class CredentialIssuancePurpose extends AssertionProofPurpose {
    /**
     * @param {object} options - The options to use.
     * @param {object} [options.controller] - The description of the controller,
     *   if it is not to be dereferenced via a `documentLoader`.
     * @param {string|Date|number} [options.date] - The expected date for
     *   the creation of the proof.
     * @param {number} [options.maxTimestampDelta=Infinity] - A maximum number
     *   of seconds that the date on the signature can deviate from.
     */
    constructor(options: { controller?: object; date?: string | Date | number; maxTimestampDelta?: number } = {});

    /**
     * Validates the purpose of a proof. This method is called during
     * proof verification, after the proof value has been checked against the
     * given verification method (in the case of a digital signature, the
     * signature has been cryptographically verified against the public key).
     *
     * @param {object} proof - The proof to validate.
     * @param {object} options - The options to use.
     * @param {object} options.document - The document whose signature is
     *   being verified.
     * @param {object} options.suite - Signature suite used in
     *   the proof.
     * @param {string} options.verificationMethod - Key id URL to the paired
     *   public key.
     * @param {object} [options.documentLoader] - A document loader.
     * @param {object} [options.expansionMap] - An expansion map.
     *
     * @throws {Error} If verification method not authorized by controller.
     * @throws {Error} If proof's created timestamp is out of range.
     *
     * @returns {Promise<{valid: boolean, error: Error}>} Resolves on completion.
     */
    async validate(
      proof: object,
      {
        document,
        suite,
        verificationMethod,
        documentLoader,
        expansionMap,
      }: { document: object; suite: object; verificationMethod: string; documentLoader?: object; expansionMap?: object }
    ): Promise<{ valid: boolean; error?: Error }>;
  }

  // Z and T can be lowercase
  // RFC3339 regex
  export const dateRegex: RegExp;

  type LinkedDataSignature = object;
  type Presentation = object;
  type ProofPurpose = object;
  type VerifiableCredential = object;
  type VerifiablePresentation = object;

  interface VerifyPresentationResult {
    verified: boolean;
    presentationResult: object;
    credentialResults: any[];
    error: object;
  }

  interface VerifyCredentialResult {
    verified: boolean;
    statusResult: object;
    results: any[];
    error: {
      name: string;
      errors?: string[];
    };
  }

  /**
   * Issues a verifiable credential (by taking a base credential document,
   * and adding a digital signature to it).
   *
   * @param {object} [options={}] - The options to use.
   *
   * @param {object} options.credential - Base credential document.
   * @param {LinkedDataSignature} options.suite - Signature suite (with private
   *   key material), passed in to sign().
   *
   * @param {ProofPurpose} [options.purpose] - A ProofPurpose. If not specified,
   *   a default purpose will be created.
   *
   * Other optional params passed to `sign()`:
   * @param {object} [options.documentLoader] - A document loader.
   * @param {object} [options.expansionMap] - An expansion map.
   * @param {string|Date} [options.now] - A string representing date time in
   *   ISO 8601 format or an instance of Date. Defaults to current date time.
   *
   * @throws {Error} If missing required properties.
   *
   * @returns {Promise<VerifiableCredential>} Resolves on completion.
   */
  export async function issue(
    options: {
      credential: object;
      suite: LinkedDataSignature;
      purpose?: ProofPurpose;
      documentLoader?: object;
      expansionMap?: object;
      now?: string | Date;
    } = {}
  ): Promise<VerifiableCredential>;

  /**
   * Verifies a verifiable presentation:
   *   - Checks that the presentation is well-formed
   *   - Checks the proofs (for example, checks digital signatures against the
   *     provided public keys).
   *
   * @param {object} [options={}] - The options to use.
   *
   * @param {VerifiablePresentation} options.presentation - Verifiable
   *   presentation, signed or unsigned, that may contain within it a
   *   verifiable credential.
   *
   * @param {LinkedDataSignature|LinkedDataSignature[]} options.suite - One or
   *   more signature suites that are supported by the caller's use case. This is
   *   an explicit design decision -- the calling code must specify which
   *   signature types (ed25519, RSA, etc) are allowed.
   *   Although it is expected that the secure resolution/fetching of the public
   *   key material (to verify against) is to be handled by the documentLoader,
   *   the suite param can optionally include the key directly.
   *
   * @param {boolean} [options.unsignedPresentation=false] - By default, this
   *   function assumes that a presentation is signed (and will return an error if
   *   a `proof` section is missing). Set this to `true` if you're using an
   *   unsigned presentation.
   *
   * Either pass in a proof purpose,
   * @param {AuthenticationProofPurpose} [options.presentationPurpose] - Optional
   *   proof purpose (a default one will be created if not passed in).
   *
   * or a default purpose will be created with params:
   * @param {string} [options.challenge] - Required if purpose is not passed in.
   * @param {string} [options.controller] - A controller.
   * @param {string} [options.domain] - A domain.
   *
   * @param {Function} [options.documentLoader] - A document loader.
   * @param {Function} [options.checkStatus] - Optional function for checking
   *   credential status if `credentialStatus` is present on the credential.
   * @param {string|Date} [options.now] - A string representing date time in
   *   ISO 8601 format or an instance of Date. Defaults to current date time.
   *
   * @returns {Promise<VerifyPresentationResult>} The verification result.
   */
  export async function verify(
    options: {
      presentation: VerifiablePresentation;
      suite: LinkedDataSignature | LinkedDataSignature[];
      unsignedPresentation?: boolean;
      presentationPurpose?: AuthenticationProofPurpose;
      challenge?: string;
      controller?: string;
      domain?: string;
      documentLoader?: Function;
      checkStatus?: Function;
      now?: string | Date;
    } = {}
  ): Promise<VerifyPresentationResult>;

  /**
   * Verifies a verifiable credential:
   *   - Checks that the credential is well-formed
   *   - Checks the proofs (for example, checks digital signatures against the
   *     provided public keys).
   *
   * @param {object} [options={}] - The options.
   *
   * @param {object} options.credential - Verifiable credential.
   *
   * @param {LinkedDataSignature|LinkedDataSignature[]} options.suite - One or
   *   more signature suites that are supported by the caller's use case. This is
   *   an explicit design decision -- the calling code must specify which
   *   signature types (ed25519, RSA, etc) are allowed.
   *   Although it is expected that the secure resolution/fetching of the public
   *   key material (to verify against) is to be handled by the documentLoader,
   *   the suite param can optionally include the key directly.
   *
   * @param {CredentialIssuancePurpose} [options.purpose] - Optional
   *   proof purpose (a default one will be created if not passed in).
   * @param {Function} [options.documentLoader] - A document loader.
   * @param {Function} [options.checkStatus] - Optional function for checking
   *   credential status if `credentialStatus` is present on the credential.
   * @param {string|Date} [options.now] - A string representing date time in
   *   ISO 8601 format or an instance of Date. Defaults to current date time.
   *
   * @returns {Promise<VerifyCredentialResult>} The verification result.
   */
  function verifyCredential(options: {
    credential: any;
    suite?: suites.LinkedDataProof | suites.LinkedDataProof[];
    purpose?: purposes.ProofPurpose;
    documentLoader?: DocumentLoader;
    expansionMap?: ExpansionMap;
  }): Promise<VerifyCredentialResult>;

  /**
   * Creates an unsigned presentation from a given verifiable credential.
   *
   * @param {object} options - Options to use.
   * @param {object|Array<object>} [options.verifiableCredential] - One or more
   *   verifiable credential.
   * @param {string} [options.id] - Optional VP id.
   * @param {string} [options.holder] - Optional presentation holder url.
   * @param {string|Date} [options.now] - A string representing date time in
   *   ISO 8601 format or an instance of Date. Defaults to current date time.
   *
   * @throws {TypeError} If verifiableCredential param is missing.
   * @throws {Error} If the credential (or the presentation params) are missing
   *   required properties.
   *
   * @returns {Presentation} The credential wrapped inside of a
   *   VerifiablePresentation.
   */
  export function createPresentation(
    options: { verifiableCredential?: object | object[]; id?: string; holder?: string; now?: string | Date } = {}
  ): Presentation;

  /**
   * Signs a given presentation.
   *
   * @param {object} [options={}] - Options to use.
   *
   * Required:
   * @param {Presentation} options.presentation - A presentation.
   * @param {LinkedDataSignature} options.suite - passed in to sign()
   *
   * Either pass in a ProofPurpose, or a default one will be created with params:
   * @param {ProofPurpose} [options.purpose] - A ProofPurpose. If not specified,
   *   a default purpose will be created with the domain and challenge options.
   *
   * @param {string} [options.domain] - A domain.
   * @param {string} options.challenge - A required challenge.
   *
   * @param {Function} [options.documentLoader] - A document loader.
   *
   * @returns {Promise<{VerifiablePresentation}>} A VerifiablePresentation with
   *   a proof.
   */
  export async function signPresentation(
    options: {
      presentation: Presentation;
      suite: LinkedDataSignature;
      purpose?: ProofPurpose;
      domain?: string;
      challenge: string;
      documentLoader?: Function;
    } = {}
  ): Promise<{ VerifiablePresentation }>;
}

declare module '@digitalbazaar/data-integrity-context' {
  export const CONTEXT: object;
  export const CONTEXT_URL: string;
}

declare module '@digitalbazaar/ed25519-multikey' {
  export interface CreateKeyPairInterface {
    signer: () => Buffer;
    verifier: () => boolean;
  }
  export function from(key: object): Promise<CreateKeyPairInterface>;
}

declare module 'rdf-canonize' {
  export interface RdfOptions {
    algorithm: string;
    inputFormat?: string;
    createMessageDigest?: any;
    messageDigestAlgorithm?: string;
    canonicalIdMap?: Map<any, any>;
    maxWorkFactor?: number;
    maxDeepIterations?: number;
    signal?: any;
  }
  export function canonize(dataset: any, options: any): Promise<string>;
}

declare module '@digitalcredentials/jsonld';
