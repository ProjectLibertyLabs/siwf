# Signed Request Generator

A simple site that generates signed requests for SIWA.

## Developing

1. Build the `siwa` package
   - `cd ../../libraries/js`
   - `npm install`
   - `npm run build`
   - `cd dist`
   - `npm pack`
2. Install the build `siwa` package

   - `npm install ../../libraries/js/dist/projectlibertylabs-siwa-0.0.0.tgz`

3. Start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build && rm -Rf ../../docs/src/Generator && cp -a build ../../docs/src/Generator
```

## Deployment

The Generator is deployed as a part of the SIWA docs.
