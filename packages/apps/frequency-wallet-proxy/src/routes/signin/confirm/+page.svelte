<script lang="ts">
  import { SiwsMessage } from '@talismn/siws';
  import { generateSIWxNonce } from '@frequency-control-panel/utils';
  import { APP_NAME } from '$lib/globals';
  import { CurrentSelectedMsaAccountStore } from '$lib/stores/CurrentSelectedMsaAccountStore';
  import { ConnectedExtensionsDerivedStore } from '$lib/stores/derived/ConnectedExtensionsDerivedStore';
  import PayloadConfirmation, { type PayloadSummaryItem } from '$lib/components/PayloadConfirmation.svelte';
  import FooterButton from '$lib/components/FooterButton.svelte';

  const now = new Date();
  const payload: SiwsMessage = new SiwsMessage({
    domain: window.location.hostname,
    // TODO: Should use CAIP-10 conformant address here, work with Talisman to update their code
    // address: new PolkadotAddress('genesis', $CurrentSelectedMsaAccountStore.account.address).toString(),
    address: $CurrentSelectedMsaAccountStore.account.address,
    uri: window.location.href,
    // version: '1.0',
    chainName: 'Frequency',
    statement: `The app '${APP_NAME}' wants you to sign in with your Frequency account`,
    nonce: generateSIWxNonce(),
    issuedAt: now.valueOf(),
    expirationTime: new Date(now.valueOf() + 300000).valueOf(), // valid for 5 minutes
    // notBefore: now,
    // requestId: ? TBD pass-through from app
    // resources: [`dsnp://${$CurrentSelectedAccountWithMsaStore.msaInfo.msaId}`],
  });

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // Add optional fields not yet supported by siws
  (payload as unknown as any)['version'] = '1.0';
  (payload as unknown as any)['notBefore'] = now.valueOf();
  (payload as unknown as any)['resources'] = [`dsnp://${$CurrentSelectedMsaAccountStore.msaId}`];
  /* eslint-enable @typescript-eslint/no-explicit-any */

  let payloadSummary: PayloadSummaryItem[] = [
    {
      name: '',
      content: `The domain <u>${
        new URL(document.referrer).hostname
      }</u> is requesting you to sign in via Frequency. Please ensure you trust the application before continuing.`,
    },
    {
      name: 'From',
      content: `${$CurrentSelectedMsaAccountStore.account.name}<br/>${payload.address}`,
    },
    { name: 'Domain', content: /^.*:\/\/([^/:]*)/.exec(payload.uri!)?.[1] || '' },
    { name: 'Statement', content: payload.statement },
    { name: 'Chain Name', content: payload.chainName },
    { name: 'Nonce', content: payload.nonce },
    {
      name: 'Issued At',
      content: new Date(payload.issuedAt!).toLocaleString(),
    },
    {
      name: 'Expires At',
      content: new Date(payload.expirationTime!).toLocaleString(),
    },
    {
      name: 'Additional Resources',
      content: (payload as unknown as Record<string, string[]>)['resources'].reduce((prev, curr, index) => {
        return prev + (index > 0 ? '<br/>' : '') + curr;
      }, ''),
    },
  ];

  async function signPayload() {
    const extension = (await $ConnectedExtensionsDerivedStore)?.[
      $CurrentSelectedMsaAccountStore.account.wallets.values().next().value
    ];
    if (!extension?.connector) {
      throw new Error(`Did not get loaded/connected extension for ${extension?.displayName}`);
    }

    const { signature, message } = await payload.sign(extension.connector.injectedExtension!);
    console.info(`Message:
    ${message}

    Signature:
    ${signature}`);
  }
</script>

<PayloadConfirmation items={payloadSummary} payload={payload.prepareMessage()} isRaw={true}>
  <span slot="heading" class="text-md font-bold">Here is what you are going to sign</span>
  <span slot="subheading">Make sure to come back</span>
</PayloadConfirmation>
<FooterButton on:click={signPayload}>Next > Sign</FooterButton>
