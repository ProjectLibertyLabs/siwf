<script lang="ts">
  import { SignInWithPolkadot, type SIWxPayload, PolkadotAddress, generateNonce } from '@frequency-control-panel/utils';
  import { CurrentSelectedAccountWithMsaStore, CurrentSelectedExtensionStore } from '$lib/store';
  import { Modal, Content, Trigger } from 'sv-popup';

  const now = new Date();
  const payload: SIWxPayload = {
    domain: window.location.hostname,
    iss: new PolkadotAddress('genesis', $CurrentSelectedAccountWithMsaStore.address),
    uri: new URL(window.location.href),
    version: '1.0',
    statement: "The app 'Narwhal' wants you to sign in with your Frequency account",
    nonce: generateNonce(),
    issuedAt: now,
    expirationTime: new Date(now.valueOf() + 300000), // valid for 5 minutes
    notBefore: now,
    // requestId: ? TBD pass-through from app
    resources: [`dsnp://${$CurrentSelectedAccountWithMsaStore.msaInfo.msaId}`],
  };

  const payloadApi = new SignInWithPolkadot(payload);
  console.debug(payloadApi.toMessage());

  async function signPayload() {
    const extension = $CurrentSelectedExtensionStore;
    if (!extension?.connector) {
      throw new Error(`Did not get loaded/connected extension for ${extension?.displayName}`);
    }

    const message = payloadApi.toMessage();
    const signature = await extension.connector.signMessage(message, payloadApi.payload.iss.address);
    console.info(`Signature: ${signature}`);
  }
</script>

<div style="width: 100%; height: 100%; position: relative">
  <div
    style="width: 381px; height: 607px; left: 0px; top: -1px; position: absolute; background: linear-gradient(180deg, #007DA1 0%, #2C333D 100%); border: 1px black solid"
  ></div>
  <div
    style="width: 380px; height: 607px; left: 0px; top: -1px; position: absolute; background: linear-gradient(180deg, #007DA1 0%, #2C333D 100%); border: 1px black solid"
  ></div>
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
    <Content style="background: linear-gradient(180deg, #007DA1 0%, #2C333D 100%);"
      ><pre>{payloadApi.toMessage()}</pre></Content
    >
    <Trigger>
      <div
        style="width: 128px; left: 206px; top: 469px; position: absolute; color: white; font-size: 12px; font-family: Poppins; font-weight: 500; text-decoration: underline; line-height: 20px; word-wrap: break-word"
      >
        View Full Payload
      </div>
    </Trigger>
  </Modal>
  <div
    on:click={signPayload}
    on:keyup={() => {}}
    role="button"
    tabindex="0"
    style="width: 235px; height: 40px; left: 72px; top: 523px; position: absolute"
  >
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
