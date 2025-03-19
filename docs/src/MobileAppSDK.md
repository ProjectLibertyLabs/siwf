<!-- MOBILE DEVELOPMENT -->

# 📱 Mobile Development

## **Sign-In With Frequency (SIWF) SDK Integration Guide**

🚀 **The SIWF SDK provides a seamless authentication experience for mobile apps. This guide walks you through integrating the SIWF SDK into your **iOS** or **Android** app.**

---

## 📌 **Index**
1. 📥 [Installation](#installation)
2. 🛠 [Usage](#usage)
3. 🔄 [Handling Authorization Callbacks](#handling-authorization-callbacks)
4. 🔑 [Process Authorization Code](#process-authorization-code)

---

## 📥 **Installation**

<details>
  <summary>📱 iOS</summary>

### ⚙️ Requirements
- iOS 15.0 or later
- macOS 11.0 or later
- Swift

### 📦 Installing the SIWF SDK
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

### ⚙️ Requirements
- Android API level **24** or later
- Java **11+**

### 📦 Installing the SIWF SDK
To install the SIWF SDK via **Gradle**, add the following to your `build.gradle` file:

```gradle
dependencies {
    implementation 'io.projectliberty:siwf:1.0.0'
}
```

</details>

---

## 🛠 **Usage**

<details>
  <summary>📱 iOS</summary>

### **Displaying the SIWF Sign-In Button**
To create a SIWF sign-in button, use the `Siwf.createSignInButton` method:

```swift
import Siwf

Siwf.createSignInButton(mode: .primary, authRequest: authRequest)
```

</details>

<details>
  <summary>🤖 Android</summary>

### **Displaying the SIWF Sign-In Button**
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

---

## 🔄 **Handling Authorization Callbacks**

<details>
  <summary>📱 iOS</summary>

### **Handling Authorization Redirects**
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

### **Handling Authorization Redirects**
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

---

## **🔑 Process Authorization Code**

On your backend services process the authorization code and start your session.

Resources:
- [SIWF Documentation on Processing a Result](https://projectlibertylabs.github.io/siwf/v2/docs/Actions/Response.html)
- [Frequency Gateway SSO Tutorial](https://projectlibertylabs.github.io/gateway/GettingStarted/SSO.html)
