# Android SIWF SDK

## Quick Reference

- [SIWF Android SDK Source Code + Demo App](https://github.com/ProjectLibertyLabs/siwf-sdk-android)
- [Maven Central Package](https://central.sonatype.com/artifact/io.projectliberty/siwf) `implementation("io.projectliberty:siwf:1.0.0")`

## 1. Installation

### Requirements
- Android API level **24** or later
- Java **11+**

### Installing the SIWF SDK
To install the SIWF SDK via **Gradle**, add the following to your `build.gradle` file:

```gradle
dependencies {
    implementation 'io.projectliberty:siwf:1.0.0'
}
```

[Maven Central Package Page](https://central.sonatype.com/artifact/io.projectliberty/siwf)


## 2. Displaying the SIWF Button

To create a SIWF Button in your Android app, use:

```kotlin
import io.projectliberty.siwf.Siwf
import io.projectliberty.models.SiwfButtonMode

Siwf.CreateSignInButton(
    mode = SiwfButtonMode.PRIMARY,
    authRequest = authRequest
)
```

## 3. Handling Authorization Callbacks

Update your `AndroidManifest.xml` with your own intent filters for authentication callbacks. Example:

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

Then, use a `BroadcastReceiver()` to receive the authorization code with `AuthConstants.AUTH_INTENT_KEY`.

## 4. Process Authorization Code

On your backend service, process the authorization code and start your session.

Resources:
- [Documentation on Processing a Result](../Actions/Response.html)
- [Frequency Gateway SSO Tutorial](https://projectlibertylabs.github.io/gateway/GettingStarted/SSO.html)
