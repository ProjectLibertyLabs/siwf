# **Sign-In With Frequency (SIWF) Web Button SDK**

🚀 **[Sign-In With Frequency (SIWF)](https://github.com/ProjectLibertyLabs/siwf)** is an authentication SDK designed for seamless integration with web applications.

This repository contains the SIWF Button Web SDK and example implementation for seamless integration and as a reference for how to use the SIWF Button in your web app.

## 📌 **Index**

1. 🚀 [Getting Started - SIWF Button Demo](#-getting-started---siwf-button-demo)
2. 📝 [Getting Started - SIWF Button For Your Web App](#-getting-started---siwf-button-for-your-web-app)
3. 🛠 [Usage For Your Web App](#-usage-for-your-web-app)
4. ⚙️ [Configuration Options](#%EF%B8%8F-configuration-options)
5. 🤝 [Contributing](#-contributing)

## 🚀 **Getting Started - SIWF Button Demo**

Follow these steps to set up and run the demo:

### 1️⃣ Clone the Repository

Run the following command in your terminal to clone the repository:

```sh
git clone git@github.com:ProjectLibertyLabs/siwf.git
cd siwf/libraries/sdk-web
```

### 2️⃣ Install Dependencies (if any)

No external dependencies are required! The SDK is designed to be lightweight and dependency-free.

### 3️⃣ Run the Demo

Start a local server to view the example (for example using `npx serve`):

```sh
npx serve -p 3000 .
```

### 4️⃣ Open in Browser

Open your browser and navigate to:

```
http://localhost:3000/example.html
```

Your SIWF Button Example should now be running! 🚀

## 📝 **Getting Started - SIWF Button For Your Web App**

### ⚙️ Requirements

The SIWF Button SDK is compatible with all modern browsers:

- Chrome v53+
- Firefox v63+
- Edge v79+
- Safari (macOS) v10+
- Safari (iOS) v11+
- Opera v40+

### 📥 Installation

Simply include the SDK in your HTML from [jsDelivr](https://www.jsdelivr.com/package/npm/@projectlibertylabs/siwf-sdk-web) (update the version as needed):

```html
<script src="https://cdn.jsdelivr.net/npm/@projectlibertylabs/siwf-sdk-web@1.0.1/siwf-sdk-web.min.js"></script>
```

Or download from [GitHub Releases](https://github.com/ProjectLibertyLabs/siwf/releases?q=sdk-web&expanded=true) and include it locally:

```html
<script src="path/to/siwf-sdk-web.min.js"></script>
```

## 🛠 **Usage For Your Web App**

When you decide to use the SIWF Button in your own web app, follow the steps below for easy integration:

### **1️⃣ Define the SIWF Authentication Details**

- Refer to the Demo App for examples of encoded signed requests.
- To create your own, use [Frequency's Signed Request Generator](https://projectlibertylabs.github.io/siwf/v2/docs/Generate.html).

### **2️⃣ Display the SIWF Sign-In Button**

You have two options to add the button to your UI:

#### Option A: Declarative HTML Implementation

```html
<!-- Add a button container with data attributes -->
<div data-siwf-button="YOUR_ENCODED_SIGNED_REQUEST" data-siwf-mode="primary" data-siwf-endpoint="mainnet"></div>
```

#### Option B: JavaScript Implementation

```html
<div id="siwf-button-container"></div>

<script>
  // Render a button
  SiwfButton.render("#siwf-button-container", "YOUR_ENCODED_SIGNED_REQUEST", {
    mode: "primary",
    endpoint: "mainnet",
  });
</script>
```

### **3️⃣ Handle Authentication Callbacks**

Make sure your backend is configured to handle the authentication callback:

1. The authentication callback URL must match what was specified in your signed request
2. When the authentication flow completes, the user will be redirected to your callback URL
3. Your backend should process the authentication response and initiate a session

Resources:

- [SIWF Documentation on Processing a Result](https://projectlibertylabs.github.io/siwf/v2/docs/Actions/Response.html)
- [Frequency Gateway SSO Tutorial](https://projectlibertylabs.github.io/gateway/GettingStarted/SSO.html)

## ⚙️ **Configuration Options**

### **Button Modes**

The SIWF Button supports three visual styles:

```javascript
// Primary mode (teal background, default)
SiwfButton.render("#container", encodedRequest, { mode: "primary" });

// Light mode (white background with border)
SiwfButton.render("#container", encodedRequest, { mode: "light" });

// Dark mode (black background)
SiwfButton.render("#container", encodedRequest, { mode: "dark" });
```

### **Environments**

Choose the authentication environment:

```javascript
// Production environment
SiwfButton.render("#container", encodedRequest, { endpoint: "mainnet" });

// Testing environment
SiwfButton.render("#container", encodedRequest, { endpoint: "testnet" });

// Custom environment
SiwfButton.render("#container", encodedRequest, { endpoint: "https://custom-mock.example.com" });
```

### **All Configuration Options**

| Option                        | Type   | Default       | Description                                                            |
| ----------------------------- | ------ | ------------- | ---------------------------------------------------------------------- |
| `mode`                        | string | `'primary'`   | Button style: `'primary'`, `'light'`, or `'dark'`                      |
| `endpoint`                    | string | `'mainnet'`   | Authentication environment: `'mainnet'`, `'testnet'`, or a custom URL  |
| `assetsUrl`                   | string | _default URL_ | URL to fetch button assets from                                        |
| `additionalCallbackUrlParams` | string | `''`          | Additional parameters to add to the callback URL (query string format) |

### **Data Attributes**

When using HTML declarative implementation, you can configure the button with these attributes:

| Attribute                             | Description                                          |
| ------------------------------------- | ---------------------------------------------------- |
| `data-siwf-button`                    | _Required_. The encoded signed request               |
| `data-siwf-mode`                      | Button style (`primary`, `light`, or `dark`)         |
| `data-siwf-endpoint`                  | Environment (`mainnet`, `testnet`, or custom URL)    |
| `data-siwf-assets-url`                | Custom assets URL                                    |
| `data-additional-callback-url-params` | Additional callback parameters (query string format) |

## 🤝 **Contributing**

To contribute:

- Fork the repo and create a feature branch.
- Make changes and test.
- Submit a pull request with details.

### **What's an Encoded Signed Request?**

The encoded signed request is a Base64URL-encoded JSON string containing the necessary information for authentication. This includes:

- The public key to verify signatures
- The signature data
- Callback URL
- Requested permissions and credentials

Your application backend or integration partner should provide this encoded signed request.

### **Security Best Practices**

- Always validate authentication responses server-side
- Use HTTPS in production
- Set appropriate Content Security Policy (CSP) headers when deploying
- Never store or expose private keys in client-side code

## **Developing**

### **Running Tests**

This uses visual regression testing.
Therefore it is important to run the tests on the correct platform.
There are Linux and Docker versions of this test setup:

- Run Visual Regression Tests
  - Linux: `npm test`
  - Docker: `npm run test:docker`
- Update Visual Regression Snapshots
  - Linux: `npm run test:update`
  - Docker: `npm run test:update:docker`

### **Release Process**

1. Make a [new GitHub Release](https://github.com/ProjectLibertyLabs/siwf/releases/new).
2. Tag it with the version and the prefix `sdk-web-` i.e. `sdk-web-v1.0.0`.
3. Complete the release notes.
4. CI will run the NPM package release process, tagging it with that version and `latest`.

Note: You may also append the `-rc<int>` (`-rc2`) suffix to generate a pre-release.

## **License**

[Apache-2.0](https://github.com/ProjectLibertyLabs/siwf/blob/main/LICENSE)
