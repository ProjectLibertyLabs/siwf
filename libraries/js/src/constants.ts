/**
 * Set of credential types known by the library
 */
export const KnownCredentialTypes = new Set([
  'VerifiedPhoneNumberCredential',
  'VerifiedEmailAddressCredential',
  'VerifiedGraphKeyCredential',
]);

/**
 * Request for a verified email address
 */
export const VerifiedEmailAddress = {
  credential: {
    type: 'VerifiedEmailAddressCredential',
    hash: ['bciqe4qoczhftici4dzfvfbel7fo4h4sr5grco3oovwyk6y4ynf44tsi'],
  },
  id: 'https://schemas.frequencyaccess.com/VerifiedEmailAddressCredential/bciqe4qoczhftici4dzfvfbel7fo4h4sr5grco3oovwyk6y4ynf44tsi.json',
};

/**
 * Request for a verified SMS/Phone Number
 */
export const VerifiedPhoneNumber = {
  credential: {
    type: 'VerifiedPhoneNumberCredential',
    hash: ['bciqjspnbwpc3wjx4fewcek5daysdjpbf5xjimz5wnu5uj7e3vu2uwnq'],
  },
  id: 'https://schemas.frequencyaccess.com/VerifiedPhoneNumberCredential/bciqjspnbwpc3wjx4fewcek5daysdjpbf5xjimz5wnu5uj7e3vu2uwnq.json',
};

/**
 * Request for a the private graph encryption key
 */
export const VerifiedGraphKey = {
  credential: {
    type: 'VerifiedGraphKeyCredential',
    hash: ['bciqmdvmxd54zve5kifycgsdtoahs5ecf4hal2ts3eexkgocyc5oca2y'],
  },
  id: 'https://schemas.frequencyaccess.com/VerifiedGraphKeyCredential/bciqmdvmxd54zve5kifycgsdtoahs5ecf4hal2ts3eexkgocyc5oca2y.json',
};
