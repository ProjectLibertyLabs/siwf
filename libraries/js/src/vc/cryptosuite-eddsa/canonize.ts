/*!
 * Forked from Digital Bazaar, Inc.
 * https://github.com/digitalbazaar/eddsa-rdfc-2022-cryptosuite
 */
import { canonize as rdfCanonize, type RdfOptions } from 'rdf-canonize';
import jsonld from '@digitalcredentials/jsonld';

interface JsonLdOptionsToRdf {
  format: string;
}

export async function canonize(input: unknown, options: Partial<JsonLdOptionsToRdf & RdfOptions> = {}) {
  // convert to RDF dataset and do canonicalization
  options = {
    format: 'application/n-quads',
    algorithm: 'RDFC-1.0',
    ...options,
  };
  const rdfOpts = {
    ...options,
    produceGeneralizedRdf: false,
    safe: true,
  };
  delete rdfOpts.format;
  const dataset = await jsonld.toRDF(input, rdfOpts);
  return rdfCanonize(dataset, options);
}
