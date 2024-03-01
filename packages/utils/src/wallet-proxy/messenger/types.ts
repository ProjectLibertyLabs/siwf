import { SchemaName } from '@dsnp/frequency-schemas/dsnp';

/// Data type for a schema requested in a provider delegation
export type RequestedSchema = {
  /// Schema name registered on-chain
  name: SchemaName;

  /// Optional version of the named schema
  /// (versions are monotonically increasing integers for each registered schema name)
  version?: number;

  /// Resolved schema ID of the named/versioned schema.
  id: number;
};

/// Data type to control optional parameters for "Sign in with Substrate"
export type SiwsOptions = {
  /// Text to be display to the user as part of the sign-in request. May not contain newlines.
  statement?: string;

  /// An optional application-specific value that will be recycled in the returned signed payload
  requestId?: string;

  /// List of information or references to information the user wishes to have resolved
  /// as part of the authentication by the relying party; express as RFC 3986 URIs
  resources?: string[];

  /// The number of milliseconds for which the resulting signed payload will be valid post-signing
  expiresInMsecs?: number;

  /// A timestamp value expressed in milliseconds since Jan 1, 1970 UTC before which the resulting
  /// signed payload is not valid
  notBefore?: number;
};

/// Data type representing a "Sign in with Frequency" request
export type SignInRequest = {
  /// Provider ID registered on-chain (technically a u64, but we use a string as bigints don't serialize/deserialize well)
  providerId: string;

  /// List of schemas required to be delegated to the provider by the user
  requiredSchemas: RequestedSchema[];

  /// Optional parameters to be used in constructing the "Sign in with Substrate" request
  siwsOptions?: SiwsOptions;
};
