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

--- 
<!-- MOBILE DEVELOPMENT -->

## 📱 Mobile Development<a name="-mobile-development"></a>
### **Sign-In With Frequency (SIWF) SDK Integration Guide**

🚀 **The SIWF SDK provides a seamless authentication experience for mobile apps. This guide walks you through integrating the SIWF SDK into your **iOS** or **Android** app.


### 📥 **Installation**

<details>
  <summary>📱 iOS</summary>

#### ⚙️ Requirements
- iOS 15.0 or later
- macOS 11.0 or later
- Swift

#### 📦 Installing the SIWF SDK
You can install the SIWF SDK via **Swift Package Manager (SPM)**:

1. Open Xcode and navigate to **File → Add Packages**.
2. Enter the repository URL:
   ```
   https://github.com/ProjectLibertyLabs/siwf-sdk-ios
   ```
3. Select the latest stable version and add it to your project.

</details>

<details>
  <summary>🤖 Android</summary>

#### ⚙️ Requirements
- Android API level **24** or later
- Java **11+**

#### 📦 Installing the SIWF SDK
To install the SIWF SDK via **Gradle**, add the following to your `build.gradle` file:

```gradle
dependencies {
    implementation 'io.projectliberty:siwf:1.0.0'
}
```

</details>


### 🛠 **Usage**

<details>
  <summary>📱 iOS</summary>

#### **Displaying the SIWF Sign-In Button**
To create a SIWF sign-in button, use the `Siwf.createSignInButton` method:

```swift
import Siwf

Siwf.createSignInButton(mode: .primary, authRequest: authRequest)
```

</details>

<details>
  <summary>🤖 Android</summary>

#### **Displaying the SIWF Sign-In Button**
To create a SIWF sign-in button in your Android app, use:

```kotlin
import io.projectliberty.siwf.Siwf
import io.projectliberty.models.SiwfButtonMode

Siwf.CreateSignInButton(
    mode = SiwfButtonMode.PRIMARY,
    authRequest = authRequest
)
```

</details>


### 🔄 **Handling Authorization Callbacks**

<details>
  <summary>📱 iOS</summary>

#### **Handling Authorization Redirects**
Use `onOpenURL` to handle deep links for authentication:

```swift
Siwf.createSignInButton(authRequest: authRequest)
    .onOpenURL { url in
        guard let redirectUrl = URL(string: "siwfdemoapp://login") else {
            print("❌ Error: Invalid redirect URL.")
            return
        }
        Siwf.handleRedirectUrl(
            incomingUrl: url,
            redirectUrl: redirectUrl,
            processAuthorization: { authorizationCode in
                print("✅ Successfully extracted authorization code: \(authorizationCode) ")
                // Process the authorizationCode by sending it it your backend servers
                // See https://projectlibertylabs.github.io/siwf/v2/docs/Actions/Response.html
            }
        )
    }
```

</details>

<details>
  <summary>🤖 Android</summary>

#### **Handling Authorization Redirects**
Update your `AndroidManifest.xml` with intent filters for authentication callbacks:

```xml
<activity
        android:name="io.projectliberty.helpers.AuthCallbackActivity"
        android:exported="true"
        android:launchMode="singleTask">

    <!-- HTTP Callback Example. Requires a Verified App Link: https://developer.android.com/training/app-links/verify-android-applinks -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
                android:scheme="http"
                android:host="localhost"
                android:port="3000"
                android:path="/login/callback" />
    </intent-filter>

    <!-- Custom Schema Support Example -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
                android:scheme="siwfdemoapp"
                android:host="login" />
    </intent-filter>
</activity>
```

Then, use a `BroadcastReceiver` to extract the authorization code:

```kotlin
setContent {
    var authorizationCode by remember { mutableStateOf<String?>(null) }

    val authReceiver = remember {
        object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                val receivedCode = intent?.getStringExtra(AuthConstants.AUTH_INTENT_KEY)
                authorizationCode = receivedCode
                // Process the authorizationCode by sending it it your backend servers
                // See https://projectlibertylabs.github.io/siwf/v2/docs/Actions/Response.html
            }
        }
    }

    val authFilter = IntentFilter(AuthConstants.AUTH_RESULT_ACTION)

    ContextCompat.registerReceiver(
        this,
        authReceiver,
        authFilter,
        ContextCompat.RECEIVER_NOT_EXPORTED
    )

    // Render UI content
}
```

</details>


### **🔑 Process Authorization Code**

On your backend services process the authorization code and start your session.

Resources:
- [SIWF Documentation on Processing a Result](https://projectlibertylabs.github.io/siwf/v2/docs/Actions/Response.html)
- [Frequency Gateway SSO Tutorial](https://projectlibertylabs.github.io/gateway/GettingStarted/SSO.html)

---

<!-- CONTRIBUTING -->

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

- [Contributing Guidelines](./CONTRIBUTING.md)
- [Open Issues](https://github.com/ProjectLibertyLabs/siwf/issues)

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>

<!-- LICENSE -->

## 📝 License

This project is [Apache 2.0](./LICENSE) licensed.

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>
