# 📱 Mobile App Integration

## **Sign-In With Frequency (SIWF) SDK Integration Guide**

🚀 **The SIWF SDK provides a seamless authentication experience for mobile apps. This guide walks you through integrating the SIWF SDK into your **iOS** or **Android** app.**



## 📌 **Index**
1. 📱 [iOS](#iOS)
2. 🤖 [Android](#Android)

---

## 📱 **iOS**


<details>
<summary>📥 Installation</summary>

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
  <summary>🛠 Usage</summary>

### **Displaying the SIWF Sign-In Button**
To create a SIWF sign-in button, use the `Siwf.createSignInButton` method:

```swift
import Siwf

Siwf.createSignInButton(mode: .primary, authRequest: authRequest)
```

</details>

<details>
  <summary>🔄 Handling Authorization Callbacks</summary>

### **Handling Authorization Redirects**
Use `onOpenURL` and `Siwf.handleRedirectUrl` to handle deep links and retreive the authentication code.

</details>

<details>
<summary>🔑 Process Authorization Code</summary><br />

On your backend services process the authorization code and start your session.

Resources:
- [SIWF Documentation on Processing a Result](https://projectlibertylabs.github.io/siwf/v2/docs/Actions/Response.html)
- [Frequency Gateway SSO Tutorial](https://projectlibertylabs.github.io/gateway/GettingStarted/SSO.html)
</details>

**For more info see: [SIWF iOS SDK Source Code + Demo App](https://github.com/ProjectLibertyLabs/siwf-sdk-ios)**

---

## 🤖 **Android**

<details>
<summary>📥 Installation</summary>

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

<details>
  <summary>🛠 Usage</summary>

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

<details>
  <summary>🔄 Handling Authorization Callbacks</summary>

### **Handling Authorization Redirects**
Update your `AndroidManifest.xml` with intent filters for authentication callbacks:

```xml
<activity
    android:name="io.projectliberty.helpers.AuthCallbackActivity"
    ...
    <intent-filter android:autoVerify="true">
        ...
        <data
                android:scheme="http"
                android:host="localhost"
                android:port="3000"
                android:path="/login/callback" />
    </intent-filter>
    <intent-filter android:autoVerify="true">
        ... or ...
        <data
                android:scheme="siwfdemoapp"
                android:host="login" />
    </intent-filter>
</activity>
```

Then, use a `BroadcastReceiver()` to receive the authorization code.

</details>

<details>
<summary>🔑 Process Authorization Code</summary><br />

On your backend services process the authorization code and start your session.

Resources:
- [SIWF Documentation on Processing a Result](https://projectlibertylabs.github.io/siwf/v2/docs/Actions/Response.html)
- [Frequency Gateway SSO Tutorial](https://projectlibertylabs.github.io/gateway/GettingStarted/SSO.html)
</details>

**For more info see: [SIWF Android SDK Source Code + Demo App](https://github.com/ProjectLibertyLabs/siwf-sdk-android)**
