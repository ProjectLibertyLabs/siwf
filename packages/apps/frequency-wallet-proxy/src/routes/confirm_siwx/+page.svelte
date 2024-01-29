<script lang="ts">
  import { SignInWithPolkadot, type SIWxPayload, PolkadotAddress, signMessage } from '@frequency-control-panel/utils';
  import { CurrentSelectedAccountWithMsaStore, CurrentSelectedExtensionStore } from '$lib/store';
  import { Modal, Content, Trigger } from 'sv-popup';

  console.dir($CurrentSelectedAccountWithMsaStore);
  console.dir(window.location);

  const now = new Date();
  const payload: SIWxPayload = {
    domain: window.location.hostname,
    iss: new PolkadotAddress('genesis', $CurrentSelectedAccountWithMsaStore.address),
    uri: new URL(window.location.href),
    version: '1.0',
    statement: "The app 'Narwhal' wants you to sign in with your Frequency account",
    nonce: '',
    issuedAt: now,
    expirationTime: new Date(now.valueOf() + 300000), // valid for 5 minutes
    notBefore: now,
    // requestId: ? TBD pass-through from app
    resources: [`dsnp://${$CurrentSelectedAccountWithMsaStore.msaInfo.msaId}`],
  };

  const payloadApi = new SignInWithPolkadot(payload);
  console.log(payloadApi.toMessage());

  async function signPayload() {
    const extension = $CurrentSelectedExtensionStore;
    const signer = extension?.connector?.injectedExtension?.signer;
    const signature = await signMessage(payloadApi.toMessage(), payloadApi.payload.iss.address, signer);
    console.log(`Signature: ${signature}`);
  }
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<div style="width: 100%; height: 100%; position: relative; background: white">
  <div
    style="width: 381px; height: 607px; left: 0px; top: -1px; position: absolute; background: linear-gradient(180deg, #007DA1 0%, #2C333D 100%); border: 1px black solid"
  ></div>
  <div
    style="width: 380px; height: 607px; left: 0px; top: -1px; position: absolute; background: linear-gradient(180deg, #007DA1 0%, #2C333D 100%); border: 1px black solid"
  ></div>
  <div style="width: 532px; height: 355px; left: -93px; top: -162px; position: absolute; opacity: 0.50">
    <!-- svelte-ignore a11y-missing-attribute -->
    <img
      style="width: 532px; height: 355px; left: 0px; top: 0px; position: absolute"
      src="https://via.placeholder.com/532x355"
    />
    <div style="width: 380px; height: 399px; left: 94px; top: -79px; position: absolute; background: #D9D9D9"></div>
  </div>
  <img
    style="width: 226px; height: 44px; left: 75px; top: 63px; position: absolute"
    src="https://via.placeholder.com/226x44"
  />
  <div
    style="width: 380px; left: 0px; top: 161px; position: absolute; text-align: center; color: white; font-size: 16px; font-family: Poppins; font-weight: 700; line-height: 22px; word-wrap: break-word"
  >
    Here is what you are going to sign
  </div>
  <div
    style="width: 307px; height: 81px; left: 37px; top: 193px; position: absolute; text-align: center; color: #FFFFFF; font-size: 12px; font-family: Poppins; font-weight: 400; line-height: 20px; word-wrap: break-word"
  >
    Make sure to come back
  </div>
  <div
    style="width: 290px; height: 287px; left: 42px; top: 217px; position: absolute; background: #477889; border-radius: 5px; border: 1px #FFFFFF solid"
  ></div>
  <div
    style="left: 70px; top: 239px; position: absolute; color: white; font-size: 12px; font-family: Poppins; font-weight: 700; line-height: 22px; word-wrap: break-word"
  >
    Message:
  </div>
  <div
    style="left: 70px; top: 261px; position: absolute; color: white; font-size: 12px; font-family: Poppins; font-weight: 400; line-height: 22px; word-wrap: break-word"
  >
    {payload.statement}
  </div>
  <div
    style="left: 70px; top: 296px; position: absolute; color: white; font-size: 12px; font-family: Poppins; font-weight: 700; line-height: 22px; word-wrap: break-word"
  >
    URI:
  </div>
  <div
    style="left: 70px; top: 318px; position: absolute; color: white; font-size: 12px; font-family: Poppins; font-weight: 400; line-height: 22px; word-wrap: break-word"
  >
    {payload.uri}
  </div>
  <div
    style="left: 70px; top: 351px; position: absolute; color: white; font-size: 12px; font-family: Poppins; font-weight: 700; line-height: 22px; word-wrap: break-word"
  >
    Chain ID:
  </div>
  <div
    style="left: 70px; top: 373px; position: absolute; color: white; font-size: 12px; font-family: Poppins; font-weight: 400; line-height: 22px; word-wrap: break-word"
  >
    {payload.iss.toString()}
  </div>
  <div
    style="left: 70px; top: 408px; position: absolute; color: white; font-size: 12px; font-family: Poppins; font-weight: 700; line-height: 22px; word-wrap: break-word"
  >
    Nonce:
  </div>
  <div
    style="left: 70px; top: 430px; position: absolute; color: white; font-size: 12px; font-family: Poppins; font-weight: 400; line-height: 22px; word-wrap: break-word"
  >
    {payload.nonce}
  </div>
  <div
    style="width: 250px; height: 0px; left: 61px; top: 293px; position: absolute; border: 1px rgba(255, 255, 255, 0.25) solid"
  ></div>
  <div
    style="width: 250px; height: 0px; left: 61px; top: 348px; position: absolute; border: 1px rgba(255, 255, 255, 0.25) solid"
  ></div>
  <div
    style="width: 250px; height: 0px; left: 61px; top: 403px; position: absolute; border: 1px rgba(255, 255, 255, 0.25) solid"
  ></div>
  <div
    style="width: 250px; height: 0px; left: 61px; top: 458px; position: absolute; border: 1px rgba(255, 255, 255, 0.25) solid"
  ></div>
  <Modal basic big={true}>
    <Content><pre>{payloadApi.toMessage()}</pre></Content>
    <Trigger>
      <div
        style="width: 128px; left: 206px; top: 469px; position: absolute; color: white; font-size: 12px; font-family: Poppins; font-weight: 500; text-decoration: underline; line-height: 20px; word-wrap: break-word"
      >
        View Full Payload
      </div>
    </Trigger>
  </Modal>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click={signPayload} style="width: 235px; height: 40px; left: 72px; top: 523px; position: absolute">
    <div
      style="width: 235px; height: 40px; left: 0px; top: 0px; position: absolute; background: #1B9EA3; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); border-radius: 50px"
    ></div>
    <div
      style="left: 68px; top: 9px; position: absolute; color: #FFFFFF; font-size: 12px; font-family: Poppins; font-weight: 700; letter-spacing: 0.04px; word-wrap: break-word"
    >
      Next > Sign
    </div>
  </div>
</div>
