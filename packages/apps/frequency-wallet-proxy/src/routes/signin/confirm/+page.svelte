<script lang="ts">
  import { Siws, SiwsMessage } from '@talismn/siws';
  import { generateSIWxNonce, type SignInResponse } from '@frequency-control-panel/utils';
  import { CurrentSelectedMsaAccountStore } from '$lib/stores/CurrentSelectedMsaAccountStore';
  import { ConnectedExtensionsDerivedStore } from '$lib/stores/derived/ConnectedExtensionsDerivedStore';
  import { RequestResponseStore } from '$lib/stores/RequestResponseStore';
  import PayloadConfirmation from '$lib/components/PayloadConfirmation.svelte';
  import FooterButton from '$lib/components/FooterButton.svelte';
  import { sendWalletProxyResponse } from '$lib/utils';
  import Icon from '@iconify/svelte';
  import copyIcon from '@iconify/icons-ic/baseline-content-copy';
  import { copyToClipboard } from '$lib/utils/browserUtils';
  import { Toast } from 'flowbite-svelte';

  let button: HTMLButtonElement;
  let showCopiedNotification = false;

  const now = new Date();
  const payload: SiwsMessage = new SiwsMessage({
    version: Siws.CURRENT_VERSION,
    domain: window.location.hostname,
    // TODO: Should use CAIP-10 conformant address here, work with Talisman to update their code
    // address: new PolkadotAddress('genesis', $CurrentSelectedMsaAccountStore.account.address).toString(),
    address: $CurrentSelectedMsaAccountStore.account.address,
    uri: window.location.href,
    // version: '1.0',
    chainName: 'Frequency',
    statement:
      $RequestResponseStore.request?.siwsOptions?.statement ||
      `The domain ${new URL(document.referrer).hostname} wants you to sign in with your Frequency account via ${
        window.location.hostname
      }`,
    nonce: generateSIWxNonce(),
    issuedAt: now.valueOf(),
    expirationTime: new Date(
      now.valueOf() + ($RequestResponseStore.request?.siwsOptions?.expiresInMsecs || 300000)
    ).valueOf(), // default 5 minutes
    notBefore: $RequestResponseStore.request?.siwsOptions?.notBefore || now.valueOf(),
    requestId: $RequestResponseStore.request?.siwsOptions?.requestId,
    resources: [`dsnp://${$CurrentSelectedMsaAccountStore.msaId}`],
  });

  if ($RequestResponseStore.request?.siwsOptions?.resources?.length) {
    payload.resources!.push(...$RequestResponseStore.request.siwsOptions.resources);
  }

  async function signPayload() {
    const extension =
      $ConnectedExtensionsDerivedStore?.[$CurrentSelectedMsaAccountStore.account.wallets.values().next().value];
    if (!extension?.connector) {
      throw new Error(`Did not get loaded/connected extension for ${extension?.displayName}`);
    }

    const { signature, message } = await payload.sign(extension.connector.injectedExtension!);

    const signInMessage: SignInResponse = {
      siwsPayload: { message, signature: signature as `0x${string}` },
    };

    RequestResponseStore.updateSignInResponse(signInMessage);

    await sendWalletProxyResponse($RequestResponseStore.response!);
    console.info(`Message:
    ${message}

    Signature:
    ${signature}`);
  }

  async function copyAddress() {
    const copied = await copyToClipboard(button.title);
    if (copied) {
      showCopiedNotification = true;
      setTimeout(() => {
        showCopiedNotification = false;
      }, 3000);
    }
  }
</script>

<PayloadConfirmation payload={payload.prepareMessage()} isRaw={true}>
  <span slot="heading" class="text-md font-bold">Here is what you are going to sign</span>
  <span slot="subheading">Make sure to come back</span>
  <div slot="payloadDescription">
    <div>
      <span class="text-sm font-normal"
        >The domain <a class=" underline" href={new URL(document.referrer).hostname} target="_blank"
          >{new URL(document.referrer).hostname}</a
        > is requesting you to sign in via Frequency. Please ensure you trust the application before continuing.</span
      >
    </div>
    <div class="pb-1 pt-2"><hr class="flex-grow pb-1 pt-2" /></div>
    <div class="text-sm font-bold">From:</div>
    <div>
      <button
        class="min-w-full"
        title={$CurrentSelectedMsaAccountStore.account.address}
        on:click={copyAddress}
        bind:this={button}
        ><div class="flow-root">
          <div class="float-left pr-2">
            <span class="text-sm font-normal">{$CurrentSelectedMsaAccountStore.account.name}</span>
          </div>
          <div><Icon icon={copyIcon} /></div>
        </div></button
      >
    </div>
    <div class="pb-1 pt-2"><hr class="flex-grow pb-1 pt-2" /></div>
    <div class="text-sm font-bold">Domain:</div>
    <div class="text-sm font-normal">{new URL(payload.uri).hostname}</div>
    <div class="pb-1 pt-2"><hr class="flex-grow pb-1 pt-2" /></div>
    <div class="text-sm font-bold">Chain name:</div>
    <div class="text-sm font-normal">{payload.chainName}</div>
  </div>
</PayloadConfirmation>
<Toast bind:open={showCopiedNotification} dismissable={true} position="top-right">Address copied to clipboard</Toast>
<FooterButton on:click={signPayload}>Next > Sign</FooterButton>
