# Sign In With Frequency Documentation & Tools

<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [📖 About the Project](#about-project)
- [🚀 Quick Resources](#-quick)
- [💻 Prerequisites](#-prerequisites)
- [🛠 Libraries](#-libraries)
- [⚙️ Development](#-development)
- [📱️ Mobile Development](#-mobile-development)
- [🔍 Arch Map](#-arch-maps)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

<!-- PROJECT DESCRIPTION -->

# 📖 Sign In With Frequency V2<a name="about-project"></a>

Sign In With Frequency (SIWF) is the developer documentation and toolset to integrate with [Frequency Access](https://frequencyaccess.com), an easy to use custodial social wallet for users on Frequency.

Looking for SIWF v1 resources? [Go to the `v1` branch](https://github.com/ProjectLibertyLabs/siwf/tree/v1).

## 🚀 Quick Resources<a name="-quick"></a>

- [Frequency Access Home Page](https://frequencyaccess.com)
- [Frequency Access Swagger/Open API Docs](https://testnet.frequencyaccess.com/webjars/swagger-ui/index.html)
- [Frequency Documentation](https://docs.frequency.xyz)
- [Frequency on GitHub](https://github.com/frequency-chain/frequency)
- [Frequency Provider Dashboard](https://provider.frequency.xyz)
- [Sign In With Frequency UI V2](https://github.com/ProjectLibertyLabs/siwf) (Onboarding tool that supports both Frequency Access and other wallets)

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>

## 💻 Prerequisites<a name="-prerequisites"></a>

Using Sign In With Frequency requires:

- Frequency Provider setup
- Frequency Node RPC access

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>

## 🛠 Libraries<a name="-libraries"></a>

These libraries can help make integrating with SIWF easier, but are not required.

### TypeScript/JavaScript

The NPM package `@projectlibertylabs/siwf` offers both CommonJS and ESM exports.

### Install
- NPM: `npm i @projectlibertylabs/siwf`
- Yarn: `yarn add @projectlibertylabs/siwf`

### Documentation

See [Markdown/GitHub Docs](./docs/src/QuickStart.md) or [Live Docs](https://projectlibertylabs.github.io/siwf/v2/docs/QuickStart.html).

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>

## ⚙️ Development<a name="-development"></a>

### Documentation

Documentation is written in [CommonMark Markdown](https://rust-lang.github.io/mdBook/format/markdown.html) and converted to HTML via [mdBook](https://rust-lang.github.io/mdBook/).

#### Prerequisites

- [mdBook](https://rust-lang.github.io/mdBook/)
  - Cargo: `cargo install mdbook@0.4.42`
  - Mac Brew `brew install mdbook`
  - Binaries: [Download Release](https://github.com/rust-lang/mdBook/releases)
- [Node.js v20+](https://nodejs.org)

#### Local Development
- Build the signed-request-generator: follow the "Development" and "Build" steps in `[tools/signed-request-generator/README.md]`.
- Copy the new Generator to the docs directory: `rm -Rf docs/src/Generator && cp -a tools/signed-request-generator/build docs/src/Generator`
- `cd ../../docs`
- Serve the HTML locally and watch for changes: `mdbook serve` or `mdbook serve -p <port, default 3000>`
- For style edits see: [`docs/css/overrides.css`](./docs/css/overrides.css)
- For changes to the custom preprocessor see: [`docs/preprocessors/README.md`](./docs/preprocessors/README.md)

#### Deployment

The documentation is deployed to GitHub Pages automatically on merge to `main` branch.

### Library: TypeScript/JavaScript

Library is published on merge to `main` with a development tag `0.0.0-[SHA:6]`.
Releases are made via GitHub Releases with tags in the style: `vX.Y.Z`.

<!-- MOBILE DEVELOPMENT -->

## 📱 Mobile Development

<details>
<summary>iOS</summary>

### Install

1. Install the sdk into your project
  ```shell
  installation command
  ```

2. Add 

### Demo App
To checkout Frequency's iOS SDK source code and demo app, [go here](https://github.com/ProjectLibertyLabs/liwl-sdk-android).
</details>

<details>
<summary>Android</summary>

### Install
1. Install the sdk into your project
```shell
installation command
```

2. Create a file titled `AuthCallbackActivity.kt` in your project and populate it with the code below.
```javascript
  package YOUR_PACKAGE
  
  import android.content.Intent
  import android.net.Uri
  import android.os.Bundle
  import android.util.Log
  import androidx.activity.ComponentActivity
  
  class AuthCallbackActivity : ComponentActivity() {
      override fun onCreate(savedInstanceState: Bundle?) {
          super.onCreate(savedInstanceState)
          handleDeepLink(intent)
      }
  
      override fun onNewIntent(intent: Intent?) {
          super.onNewIntent(intent)
          handleDeepLink(intent)
      }
  
      private fun handleDeepLink(intent: Intent?) {
          val data: Uri? = intent?.data
          if (data != null) {
              Log.d("AuthCallback", "Deep Link received: $data")
  
              val authCode = data.getQueryParameter("authorizationCode")
              if (authCode != null) {
                  Log.d("AuthCallback", "Auth Code: $authCode")
  
                  val broadcastIntent = Intent("com.example.siwf.AUTH_RESULT")
                  broadcastIntent.putExtra("authorizationCode", authCode)
                  sendBroadcast(broadcastIntent)
              }
          }
          finish()
      }
  }
```

3. Update your `AndroidManifest` to contain an intent filter that handles the callback from SIWF.
```javascript
    <activity
        android:name="com.example.app.AuthCallbackActivity"
        android:exported="true"
        android:launchMode="singleTask">
        <intent-filter>
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <data android:scheme="http" />
            <data android:host="localhost" android:port="3000"/>
            <data android:path="/login/callback"/>
        </intent-filter>
    </activity>
```

4. Set the value of `signedRequest` using either of the two options below:
  - Create a `signedRequest` of type `SiwfEncodedSignedRequest` using Frequency's [Signed Request Generator](https://projectlibertylabs.github.io/siwf/v2/docs/Generate.html).
  - Create a `signedRequest` of type `SiwfSignedRequest`.

5. Set the value of `authData`:
```javascript
      val authData = GenerateAuthData(
          signedRequest = signedRequest,
          additionalCallbackUrlParams = emptyMap(),
          options = SiwfOptions(
              endpoint = "testnet" // alternatively, "mainnet"
          )
      )
```
6. Add the SIWF Button to your UI.
```javascript
    Siwf.CreateSignInButton(authData = authData)
```

7. Determine LIGHT/DARK/PRIMARY color mode
```javascript
    Siwf.CreateSignInButton(mode = SiwfButtonMode.DARK, authData = authData)
```

### Demo App
For additional info, checkout [Frequency's Android SDK source code and demo app](https://github.com/ProjectLibertyLabs/liwl-sdk-android).

</details>

<details>
<summary>React Native</summary>
<br>
...coming soon
</details>

<details>
<summary>Web</summary>
<br>
...coming soon
</details>

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

- [Contributing Guidelines](./CONTRIBUTING.md)
- [Open Issues](https://github.com/ProjectLibertyLabs/siwf/issues)

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>

<!-- LICENSE -->

## 📝 License

This project is [Apache 2.0](./LICENSE) licensed.

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>
