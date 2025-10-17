// @todo Generate from the chain at startup?
// This has already applied the transformation from the v1.13.0 migration

export const SCHEMA_NAME_TO_ID = new Map<string, number>([
  ['dsnp.broadcast@v1', 2],
  ['dsnp.broadcast@v2', 17],
  ['dsnp.dsnp-content-attribute-set@v1', 12],
  ['dsnp.ext-content-attribute-set@v1', 13],
  ['dsnp.private-connections@v1', 10],
  ['dsnp.private-follows@v1', 9],
  ['dsnp.profile-resources@v1', 15],
  ['dsnp.profile@v1', 6],
  ['dsnp.public-follows@v1', 8],
  ['dsnp.public-key-assertion-method@v1', 14],
  ['dsnp.public-key-key-agreement@v1', 7],
  ['dsnp.reaction@v1', 4],
  ['dsnp.reply@v1', 3],
  ['dsnp.reply@v2', 18],
  ['dsnp.tombstone@v1', 1],
  ['dsnp.tombstone@v2', 16],
  ['dsnp.update@v1', 5],
  ['dsnp.update@v2', 19],
  ['dsnp.user-attribute-set@v1', 11],
  ['dsnp.user-attribute-set@v2', 20],
  ['frequency.default-token-address@v1', 21],
]);

const SCHEMA_NAME_TO_ID_OBJECT = Object.fromEntries(SCHEMA_NAME_TO_ID);

const SCHEMA_NAME_BYTES_MAX= 32  // value in production as of 2025-10-17

export type SchemaName = keyof typeof SCHEMA_NAME_TO_ID_OBJECT;

export const parseName = (full: string): { namespace: string; name: string; version?: number } | null => {
    // bounds the amount of time that can be spent in Regex.match, easiest way
  if (full.length > SCHEMA_NAME_BYTES_MAX) {
      throw new Error("Schema name is too long.")
  }
  const match = full.match(/(\w+)\.([^@]+)@v(\d+)/);
  if (match && match[1] && match[2]) {
    return {
      namespace: match[1],
      name: match[2],
      version: match[3] ? parseInt(match[3]) : undefined,
    };
  }
  return null;
};
