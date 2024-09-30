# Sign In With Access Documentation & Tools

<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [📖 About the Project](#about-project)
- [🚀 Quick Resources](#-quick)
- [💻 Prerequisites](#-prerequisites)
- [🛠 Libraries](#-libraries)
- [⚙️ Development](#-development)
- [🔍 Arch Map](#-arch-maps)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

<!-- PROJECT DESCRIPTION -->

# 📖 Sign In With Access<a name="about-project"></a>

Sign In With Access (SIWA) is the developer documentation and toolset to integrate with [Frequency Access](https://frequencyaccess.com), an easy to use custodial social wallet for users on Frequency.

## 🚀 Quick Resources<a name="-quick"></a>

- [Frequency Access Home Page](https://frequencyaccess.com)
- [Frequency Access Swagger/Open API Docs](https://testnet.frequencyaccess.com/webjars/swagger-ui/index.html)
- [Frequency Documentation](https://docs.frequency.xyz)
- [Frequency on GitHub](https://github.com/frequency-chain/frequency)
- [Frequency Provider Dashboard](https://provider.frequency.xyz)
- [Sign In With Frequency](https://github.com/ProjectLibertyLabs/siwf) (Onboarding tool that supports both Frequency Access and other wallets)

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>

## 💻 Prerequisites<a name="-prerequisites"></a>

Using Sign In With Access requires:

- Frequency Provider setup
- Frequency Node RPC access

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>

## 🛠 Libraries<a name="-libraries"></a>

These libraries can help make integrating with SIWA easier, but are not required.

### TypeScript/JavaScript

The NPM package `@projectlibertylabs/siwa` offers both CommonJS and ESM exports.

### Install
- NPM: `npm i @projectlibertylabs/siwa`
- Yarn: `yarn add @projectlibertylabs/siwa`

### Documentation

See [Markdown/GitHub Docs](./docs/src/QuickStart.md) or [Live Docs](https://projectlibertylabs.github.io/siwa/QuickStart.html).

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>

## ⚙️ Development<a name="-development"></a>

### Documentation

Documentation is written in [CommonMark Markdown](https://rust-lang.github.io/mdBook/format/markdown.html) and converted to HTML via [mdBook](https://rust-lang.github.io/mdBook/).

#### Prerequisites

- [mdBook](https://rust-lang.github.io/mdBook/)
  - Cargo: `cargo install mdbook`
  - Mac Brew `brew install mdbook`
  - Binaries: [Download Release](https://github.com/rust-lang/mdBook/releases)
- [Node.js v20+](https://nodejs.org)

#### Local Development

- Serve the HTML locally and watch for changes: `mdbook serve` or `mdbook serve -p <port, default 3000>`
- For style edits see: [`docs/css/extended.css`](./docs/css/extended.css)
- For changes to the custom preprocessor see: [`docs/preprocessor.mjs`](./docs/preprocessor.mjs)

#### Deployment

The documentation is deployed to GitHub Pages automatically on merge to `main` branch.

### Library: TypeScript/JavaScript

Library is published on merge to `main` with a development tag `0.0.0-[SHA:6]`.
Releases are made via GitHub Releases with tags in the style: `vX.Y.Z`.

<!-- CONTRIBUTING -->

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

- [Contributing Guidelines](./CONTRIBUTING.md)
- [Open Issues](https://github.com/ProjectLibertyLabs/siwa/issues)

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>

<!-- LICENSE -->

## 📝 License

This project is [Apache 2.0](./LICENSE) licensed.

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>
