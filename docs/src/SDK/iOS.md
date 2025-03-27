# iOS SIWF SDK

## Quick Reference

- [SIWF iOS SDK Source Code + Demo App](https://github.com/ProjectLibertyLabs/siwf-sdk-ios)
- [Swift Package](https://swiftpackageindex.com/ProjectLibertyLabs/siwf-sdk-ios) `https://github.com/ProjectLibertyLabs/siwf-sdk-ios.git`

## 1. Installation

### Requirements
- iOS 15.0 or later
- Swift Package Manager

### Installing the SIWF SDK
You can install the SIWF SDK via **Swift Package Manager (SPM)**:

1. Open Xcode and navigate to **File → Add Packages**.
2. Enter the repository URL:
   ```
   https://github.com/ProjectLibertyLabs/siwf-sdk-ios.git
   ```
3. Select the latest stable version and add it to your project.

[Xcode Documentation Reference](https://developer.apple.com/documentation/xcode/adding-package-dependencies-to-your-app)

## 2. Displaying the SIWF Button

To create a SIWF Button, use the `Siwf.createSignInButton` method:

```swift
import Siwf

Siwf.createSignInButton(mode: .primary, authRequest: authRequest)
```

## 3. Handling Authorization Callbacks

Use `onOpenURL` and `Siwf.handleRedirectUrl` to handle deep links and retrieve the authentication code.

## 4. Process Authorization Code

On your backend service, process the authorization code and start your session.

Resources:
- [Documentation on Processing a Result](../Actions/Response.html)
- [Frequency Gateway SSO Tutorial](https://projectlibertylabs.github.io/gateway/GettingStarted/SSO.html)
