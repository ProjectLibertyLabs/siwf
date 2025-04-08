## Improved Usage Example

### Basic Usage (HTML Declarative)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SIWF Auth Example</title>
  <!-- Load the script -->
  <script src="siwf-auth.js"></script>
</head>
<body>
  <!-- Auto-initialized button -->
  <div data-siwf data-siwf-mode="primary" data-siwf-callback="https://yourapp.com/callback"></div>

  <!-- Auto-init the library -->
  <script data-siwf-auto></script>
</body>
</html>
```

### Programmatic Usage (JavaScript)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SIWF Auth Example</title>
  <script src="siwf-auth.js"></script>
</head>
<body>
  <div id="siwf-container"></div>

  <script>
    // Initialize the library
    SiwfAuth.init({
      endpoint: 'https://api.example.com/mainnet',
      assets: {
        buttonText: 'Continue with SIWF'
      }
    });

    // Wait for the library to load
    SiwfAuth.load(function() {
      // Render a button
      SiwfAuth.renderButton('#siwf-container', {
        mode: 'primary',
        signedRequest: {
          requestedSignatures: {
            // Your signature data
          },
          requestedCredentials: [],
          applicationContext: {
            url: "https://yourapp.com"
          }
        },
        additionalCallbackUrlParams: {
          redirect_uri: "https://yourapp.com/callback"
        },
        // Callbacks
        onSuccess: function(userData) {
          console.log('Authentication successful', userData);
        },
        onError: function(error) {
          console.error('Authentication failed', error);
        }
      });
    });

    // Listen for events
    document.querySelector('#siwf-container').addEventListener('siwf:success', function(e) {
      console.log('User logged in:', e.detail);
    });
  </script>
</body>
</html>
```

## Key Improvements to Match Google/Facebook SSO Patterns

1. **Global Namespace**: Uses a single global object (`SiwfAuth`) like Google's `gapi` or Facebook's `FB`

2. **Initialization Flow**: Separate `init()` and `load()` methods similar to:
   ```javascript
   gapi.load('auth2', function() {
     gapi.auth2.init({...});
   });
   ```

3. **Declarative HTML Integration**: Supports automatic initialization with data attributes:
   ```html
   <div data-siwf data-siwf-mode="primary"></div>
   ```

4. **Event-based Communication**: Uses both callbacks and custom events for flexibility:
   ```javascript
   SiwfAuth.renderButton('#container', {
     onSuccess: function(user) { ... }
   });

   element.addEventListener('siwf:success', function(e) { ... });
   ```

5. **Promise-based Authentication**: Uses modern Promise API for auth flow:
   ```javascript
   SiwfAuth.signIn().then(user => {
     console.log(user);
   });
   ```

6. **Consistent Styling**: Follows the same visual styling pattern as Google/Facebook SSO buttons

7. **Popup Management**: Handles the popup window lifecycle similar to OAuth implementations

This implementation now much more closely aligns with how Google, Facebook, and other major SSO providers structure their button implementations, while still maintaining your specific configuration needs.

### Run the Example

- `npx serve .`
