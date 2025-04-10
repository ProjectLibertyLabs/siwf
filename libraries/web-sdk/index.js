/**
 * SIWF Button - SSO Authentication Link for Sign In With Frequency
 *
 * The Element tagged MUST be a `div` tag.
 * ## Initialize via data tags:
 * - `data-siwf-button`: Insert the linked button inside of this div
 * - `data-siwf-assets-url`: Instead of the default assets URL, use this one
 * - `data-mode`: MUST be `primary` (default), `light`, or `dark`
 * - `data-endpoint` MUST be `mainnet` (default), `testnet`, or a custom endpoint URL
 * - `data-additional-callback-url-params`: A search query string that can be parsed by `new URLSearchParams(value)`
 */
(function (window, document) {
  // Namespace for the library
  window.SiwfButton = window.SiwfButton || {};

  // This is a ASCII only version of Poppins
  const fontFace = new FontFace(
    "Poppins-SemiBold-ascii",
    "url(data:application/woff2;charset=utf-8;base64,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)",
    {
      weight: "700",
    },
  );

  // Default assets pulled on 2025-04-09 from defaultConfig.assetUrl
  const defaultAssets = {
    colors: {
      bg: {
        primary: "#54B2AB",
        light: "#ffffff",
        dark: "#000000",
      },
      fg: {
        primary: "#000000",
        light: "#000000",
        dark: "#ffffff",
      },
      border: {
        primary: "#54B2AB",
        light: "#000000",
        dark: "#000000",
      },
    },
    content: {
      title: "Continue with Frequency",
    },
    images: {
      logo: {
        primary:
          "iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAQAAABJXchjAAACrklEQVR42s3ZT2scZQDH8Q+bwxptvXhQ2kyikaKxWASxnrV/PIVSeog5C74Eb9KQQ7v1IF3BxgT0EKQ1N6EHD76ETRM8aYhb281GBLOhF7G7CXk8B7NmZ+bZGb+/+/KBgZ2ZZ2QoMWveinVNu7q6djWt+c68DyWG2ojLlmwKx2zToksqojfulraQYm0146I1qe6pkGE9y16Xu+fU7Ak5tqfueTm6ZluIsLarMlVVFyJu2aiUTVgXIm9NIkVTWoL4+905A/aujjCkdZw3QGd1hCHuiXOOaaLPX9K+3QzbF45YS0L/qtb6+DdkaUM4cj95Rt8WhEIQwRf6dE0oDBFccUQntQtFbDnhX90WCkUEn3G41+wVjuh51aG+EVIhXjI5wB4K/7klAEh0UyJ+ECKsZwKAW0IpiOAmQMVWaYi2EeCyUBoiuAAslYpYAH4tFfELJEKpiGCM2dIRM8xHRez73gcpEXOsREM8UfcKRlIi7rIWBbHuI6OQAbHKo5yIffddBDIiHtLJgfhDzTjkQvxJNyNi1cdGITfiaVbEKSAWYicFYrDOpr8cjyIiKi667yAlosmDSIgXfOI3IcMarERAvGXRX0LG3WU+F2LEtB+FXLvObGbEiz61HecGlmRCvO1bXSHKTsNmqbfyn4HFUhF3gEulIt77Hz3yUysNcYPyXwPHAeDrUhBfOdQZe4UjeiY53OeFI2ppj4viI1pOOKKrBSIOTOvTl4Uhbutb1YNCEA1V+pfYGuhYuZeD8NiYY3rDjjDE7ZgyQOd1hkh4x4BNeTwUwrY3pSixGp3QMJblQ9xBRMKiqkxdsRUF0DItR8+a080F6Kk7KXcvq/s7E6Br2RnRStzUSnkJbhgTvYoLFmwMcDJ5x/sqhtppM+bc09DU0dXV0dRwz3UzTqX/wX8AL5Yi61hKoK8AAAAASUVORK5CYII=",
        dark: "iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAQAAABJXchjAAACt0lEQVR42s3ZvU8TYRzA8V/aAV/AxUEDLSiGKBKJiRFn5cWJEOJQmU38E9wMpAMUB0NNBEuiAzEgmwmDg39CocRJCBahLcZESliMXNvwdbihvJSW57nn7vjc/ss3uT69u+cRdYQZIso8y6TZwcJihzQpPhHlKWFxE0H6mGaNWtZI0EtATKOZcXKoyBGjWUyhlTh76Cgwwy1xiovEKOJEkTiXRB9P2MKEHIOigzrimDTDeVFDC8uYllJavrSTwQ2/6JTT4QF53JKnS2qjgzxu2qWz9m8hRyUldjSuEpVkCFdfESkqWxUNrFLZN87JSZgCTyLgzcl/TXgWAQNyHA3kPI3IUi9HMQGeRsArOYybFD2PKHBDDuIDqERwlVZqX+tUNy1lhLEUI75gQoGW8shx8CUCxsRGgKxvETmC9sA+8C0Cuu2B075GTNkDf/gasWKvDHyNgJAw5HtERIgajSjxmceoGRHmjUXsEue6CEHUzAopIxHLPLNf6TUiFoUNhxElFugRm17EupB3EPG7/NHrIOKPYGlGLPLcvgGOI/Z0IxrFZihiWy2iNjrUb8eGuQgC9LDAPmrSwpKZCC7zgp/oSArzziO4S4K/6JoVok4iCNLPV5wZFoZ0I7jCS7ZwLqL7KL/HRyzMaBIR1nx9lH+3ByZ8jZi0B/b6GvHwbLzy24j5FjF6Fj4Dm6WM975EvJODaKPoeUSBVjmM155HxFS3i8xHZKiX4xj0MGKffqmMt55FTFTbTF3yJCJJXfWTvuyptpUL6NskJNVxm23ctE271EYXeRcT7p/+0GUTN2xxR+0UeBHTkoR0DuL2MSdBnehggCwmZOgXfVxgBAsnCsRpEKe4Rpx/6LCYoU1MIcwYGVRkGCUkphGgmylWqWWFSR4REDfRRIQR5kiSJo+FRZ40SeYYJkKj+sT/4VHvuFGgLiwAAAAASUVORK5CYII=",
        light:
          "iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAQAAABJXchjAAACrklEQVR42s3ZT2scZQDH8Q+bwxptvXhQ2kyikaKxWASxnrV/PIVSeog5C74Eb9KQQ7v1IF3BxgT0EKQ1N6EHD76ETRM8aYhb281GBLOhF7G7CXk8B7NmZ+bZGb+/+/KBgZ2ZZ2QoMWveinVNu7q6djWt+c68DyWG2ojLlmwKx2zToksqojfulraQYm0146I1qe6pkGE9y16Xu+fU7Ak5tqfueTm6ZluIsLarMlVVFyJu2aiUTVgXIm9NIkVTWoL4+905A/aujjCkdZw3QGd1hCHuiXOOaaLPX9K+3QzbF45YS0L/qtb6+DdkaUM4cj95Rt8WhEIQwRf6dE0oDBFccUQntQtFbDnhX90WCkUEn3G41+wVjuh51aG+EVIhXjI5wB4K/7klAEh0UyJ+ECKsZwKAW0IpiOAmQMVWaYi2EeCyUBoiuAAslYpYAH4tFfELJEKpiGCM2dIRM8xHRez73gcpEXOsREM8UfcKRlIi7rIWBbHuI6OQAbHKo5yIffddBDIiHtLJgfhDzTjkQvxJNyNi1cdGITfiaVbEKSAWYicFYrDOpr8cjyIiKi667yAlosmDSIgXfOI3IcMarERAvGXRX0LG3WU+F2LEtB+FXLvObGbEiz61HecGlmRCvO1bXSHKTsNmqbfyn4HFUhF3gEulIt77Hz3yUysNcYPyXwPHAeDrUhBfOdQZe4UjeiY53OeFI2ppj4viI1pOOKKrBSIOTOvTl4Uhbutb1YNCEA1V+pfYGuhYuZeD8NiYY3rDjjDE7ZgyQOd1hkh4x4BNeTwUwrY3pSixGp3QMJblQ9xBRMKiqkxdsRUF0DItR8+a080F6Kk7KXcvq/s7E6Br2RnRStzUSnkJbhgTvYoLFmwMcDJ5x/sqhtppM+bc09DU0dXV0dRwz3UzTqX/wX8AL5Yi61hKoK8AAAAASUVORK5CYII=",
      },
    },
  };
  /**
   * Determines the correct authentication endpoint based on the input environment.
   *
   * @param environment The environment name (e.g., "mainnet", "testnet").
   * @return The URL to the authentication endpoint.
   */
  function resolveEndpoint(environment) {
    switch (environment) {
      case "mainnet":
      case "production":
      case "prod":
        return new URL("https://www.frequencyaccess.com/siwa/start");
      case "testnet":
      case "staging":
        return new URL("https://testnet.frequencyaccess.com/siwa/start");
      default:
        print("⚠️ Using custom authentication endpoint");
        return new URL(environment.replace(/\/+$/, ""));
    }
  }

  function validateAndBuildConfig(inputConfig) {
    const config = {
      ...defaultConfig,
      ...inputConfig,
    };
    // Allowed Modes
    const allowedModes = ["primary", "dark", "light"];
    if (!allowedModes.includes(config.mode)) {
      throw new Error(`Invalid SIWF Button mode ${config.mode}. Allowed values are ${allowedModes.join(", ")}`);
    }
    // Auth Endpoint
    try {
      config.endpoint = new URL(resolveEndpoint(config.endpoint));
    } catch (_e) {
      throw new Error(`Unable to parse endpoint config: "${config.endpoint}"`);
    }
    // Additional Callback Param Check
    try {
      config.additionalCallbackUrlParams = new URLSearchParams(config.additionalCallbackUrlParams);
    } catch (_e) {
      throw new Error(
        `Unable to parse additionalCallbackUrlParams! Make sure they follow the rules for the URLSearchParams constructor.`,
      );
    }
    // Assets URL Check
    try {
      config.assetsUrl = new URL(config.assetsUrl);
    } catch (_e) {
      throw new Error(`Unable to parse assets URL config: "${config.assetsUrl}"`);
    }

    return config;
  }

  // Configuration options
  const defaultConfig = {
    // primary, dark, light
    mode: "primary",
    // mainnet, testnet, or custom URL
    endpoint: "mainnet",
    // URL to get the assets from
    assetsUrl: "https://projectlibertylabs.github.io/siwf/v2/assets/assets-v2.json",
    // Should be anything that can be used with new URLSearchParams(config.additionalCallbackUrlParams)
    additionalCallbackUrlParams: [],
  };

  let loadedAssets = { ...defaultAssets };

  /**
   * Get the logo URI based on the button mode
   */
  function getLogoUri(mode, assets) {
    // Light style logo
    if (mode === "light" && assets.images.logo.light) {
      return `data:image/png;base64,${assets.images.logo.light}`;
      // Dark style logo
    } else if (mode === "dark" && assets.images.logo.dark) {
      return `data:image/png;base64,${assets.images.logo.dark}`;
    }
    // Default to primary logo
    return `data:image/png;base64,${assets.images.logo.primary}`;
  }

  /**
   * Render a SIWF button in the specified container
   * @param {string|Element} container - Element or selector to render button in
   * @param {string} encodedSignedRequest - The SIWF base64url encoded signed request
   * @param {Object} options - Button-specific options
   */
  SiwfButton.render = function (container, encodedSignedRequest, options = {}) {
    const targetElement = typeof container === "string" ? document.querySelector(container) : container;

    if (!targetElement) {
      console.error("Target container not found");
      return;
    }

    // Merge default config with button-specific options
    const config = validateAndBuildConfig(options);
    config.encodedSignedRequest = encodedSignedRequest;

    if (config.assetsUrl) {
      return fetchWithTimeout(config.assetsUrl)
        .then((assets) => renderFinal(targetElement, config, assets))
        .catch((e) => {
          console.log("Error fetching assets:", e);
          return renderFinal(targetElement, config, defaultAssets);
        });
    }
    return renderFinal(targetElement, config, defaultAssets);
  };

  function renderFinal(targetElement, config, assets) {
    // Container for the Shadow Dom
    const innerContainer = document.createElement("div");
    const shadow = innerContainer.attachShadow({ mode: "closed" });

    // Create button element
    const button = createButtonElement(config, assets);
    const css = generateStyles(config.mode, assets);
    shadow.innerHTML = `<style>${css}</style>`;
    shadow.appendChild(button);

    // Clear container and append button
    targetElement.innerHTML = "";
    targetElement.appendChild(innerContainer);

    return innerContainer;
  }

  // ----- Helper Functions -----

  /**
   * A fetch replacement, as not all browsers support fetch
   */
  function fetchWithTimeout(url, timeout = 1500) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Set timeout
      xhr.timeout = timeout;

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const jsonResponse = JSON.parse(xhr.responseText);
              resolve(jsonResponse);
            } catch (e) {
              reject(new Error("Error parsing JSON: " + e.message));
            }
          } else {
            reject(new Error("Request failed with status: " + xhr.status));
          }
        }
      };

      xhr.ontimeout = function () {
        reject(new Error(`Request timed out after ${timeout}ms`));
      };

      xhr.onerror = function () {
        reject(new Error("Network error occurred"));
      };

      xhr.open("GET", url, true);
      xhr.send();
    });
  }

  /**
   * Styles for the setup
   */
  function generateStyles(mode, assets) {
    return `
a.siwf-button,
a.siwf-button:hover,
a.siwf-button:hover:visited,
a.siwf-button:visited {
  display: inline-block;
  font-family: 'Poppins', 'Poppins-SemiBold-ascii', 'Arial Black', sans-serif;
  font-size: 17px;
  color: ${assets.colors.fg[mode] || assets.colors.fg.primary};
  background-color: ${assets.colors.bg[mode] || assets.colors.bg.primary};
  border: 1px solid ${assets.colors.border[mode]};
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  box-sizing: border-box;
  margin: 0;
  padding: 5px 20px;
  height: 45px;
  border-radius: 24px;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  cursor: pointer;
  user-select: none;
}
a.siwf-button:hover,
a.siwf-button:focus {
  outline: 1px solid ${assets.colors.border[mode] || assets.colors.border.primary};
}
a.siwf-button > img {
  background-color: transparent;
  box-sizing: border-box;
  height: 33px;
  margin: 0;
  padding: 0;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  display: inline-block;
}
a.siwf-button > span {
  padding-left: 10px;
  position: relative;
  top: -11px;
}`;
  }

  /**
   * Create the button element based on configuration
   */
  function createButtonElement(config, assets) {
    const anchor = document.createElement("a");
    const uniqueId = "siwf-" + Math.random().toString(36).substring(2, 11);
    anchor.id = uniqueId;
    anchor.href = generateStartUrl(config).toString();
    anchor.className = `siwf-button siwf-mode-${config.mode.toLowerCase()}`;

    // Add icon if logo URL is available
    const logoUrl = getLogoUri(config.mode, assets);
    if (logoUrl) {
      const icon = document.createElement("img");
      icon.src = logoUrl;
      icon.alt = "";
      icon.className = "siwf-button-icon";
      anchor.appendChild(icon);
    }

    // Add text
    const text = document.createElement("span");
    text.textContent = assets.content.title;
    text.className = "siwf-content-title";
    anchor.appendChild(text);

    return anchor;
  }

  /**
   * Generate the authentication URL based on configuration
   */
  function generateStartUrl(config) {
    const baseUrl = config.options?.endpoint || config.endpoint;
    const startUrl = new URL(baseUrl.toString());

    // Add additional callback parameters
    if (config.additionalCallbackUrlParams instanceof URLSearchParams) {
      config.additionalCallbackUrlParams.forEach((key, value) => {
        startUrl.searchParams.append(key, value);
      });
    }

    // Add signed request last so that nothing can override it
    if (typeof config.encodedSignedRequest === "string") {
      startUrl.searchParams.append("signedRequest", config.encodedSignedRequest);
    }

    return startUrl;
  }

  /**
   * Find and render any auto-init buttons on the page
   */
  function renderAutoButtons() {
    document.querySelectorAll("div[data-siwf-button]").forEach((container) => {
      const encodedSignedRequest = container.dataset.siwfButton;
      if (!encodedSignedRequest) {
        console.warn("An element with data-siwf-button was found, but it had no encoded signed request value");
        return;
      }
      // Extract options from data attributes
      const options = {};
      if (container.dataset.siwfEndpoint) {
        options.endpoint = container.dataset.siwfEndpoint;
      }
      if (container.dataset.siwfMode) {
        options.mode = container.dataset.siwfMode;
      }
      if (container.dataset.siwfAssetsUrl) {
        options.assetsUrl = container.dataset.siwfAssetsUrl;
      }
      if (container.dataset.additionalCallbackUrlParams) {
        options.additionalCallbackUrlParams = container.dataset.additionalCallbackUrlParams;
      }

      // Render the button
      SiwfButton.render(container, encodedSignedRequest, options);
    });
  }

  // Try to auto-initialize buttons after loading the font and the resources

  if (document.fonts) {
    fontFace.load().then((x) => {
      document.fonts.add(x);
      renderAutoButtons();
    });
  } else {
    // No font loading support
    renderAutoButtons();
  }
})(window, document);
