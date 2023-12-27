
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const NVM_INC: string;
	export const MANPATH: string;
	export const npm_package_dependencies__iconify_icons_eos_icons: string;
	export const npm_package_devDependencies_prettier: string;
	export const TERM_PROGRAM: string;
	export const NODE: string;
	export const INIT_CWD: string;
	export const NVM_CD_FLAGS: string;
	export const npm_package_devDependencies_prettier_plugin_svelte: string;
	export const npm_package_devDependencies_typescript: string;
	export const TERM: string;
	export const SHELL: string;
	export const npm_package_devDependencies_vite: string;
	export const npm_config_20_10_0: string;
	export const HOMEBREW_REPOSITORY: string;
	export const TMPDIR: string;
	export const npm_package_scripts_lint: string;
	export const TERM_PROGRAM_VERSION: string;
	export const npm_package_scripts_dev: string;
	export const ZDOTDIR: string;
	export const FIG_NEW_SESSION: string;
	export const ORIGINAL_XDG_CURRENT_DESKTOP: string;
	export const MallocNanoZone: string;
	export const TERM_SESSION_ID: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_config_registry: string;
	export const npm_package_devDependencies_tsconfig_paths: string;
	export const NVM_DIR: string;
	export const USER: string;
	export const npm_package_description: string;
	export const npm_package_dependencies__frequency_control_panel_common: string;
	export const npm_config_recursive: string;
	export const npm_package_scripts_check_watch: string;
	export const npm_package_license: string;
	export const COMMAND_MODE: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const npm_package_devDependencies_vite_tsconfig_paths: string;
	export const SSH_AUTH_SOCK: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_package_devDependencies_tslib: string;
	export const npm_execpath: string;
	export const npm_package_devDependencies_svelte: string;
	export const npm_config_frozen_lockfile: string;
	export const PATH: string;
	export const USER_ZDOTDIR: string;
	export const __CFBundleIdentifier: string;
	export const npm_package_author: string;
	export const PWD: string;
	export const npm_package_devDependencies_tailwindcss: string;
	export const npm_command: string;
	export const npm_package_scripts_preview: string;
	export const npm_lifecycle_event: string;
	export const LANG: string;
	export const npm_package_name: string;
	export const npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
	export const ITERM_PROFILE: string;
	export const npm_package_scripts_test_integration: string;
	export const NODE_PATH: string;
	export const npm_package_scripts_build: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const XPC_FLAGS: string;
	export const npm_package_devDependencies_vitest: string;
	export const npm_package_main: string;
	export const npm_config_node_gyp: string;
	export const XPC_SERVICE_NAME: string;
	export const npm_package_version: string;
	export const npm_package_devDependencies__sveltejs_adapter_auto: string;
	export const VSCODE_INJECTION: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const COLORFGBG: string;
	export const SHLVL: string;
	export const HOME: string;
	export const npm_package_type: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const npm_package_scripts_test: string;
	export const LC_TERMINAL_VERSION: string;
	export const HOMEBREW_PREFIX: string;
	export const ITERM_SESSION_ID: string;
	export const LOGNAME: string;
	export const npm_package_scripts_format: string;
	export const npm_package_dependencies__iconify_svelte: string;
	export const npm_package_devDependencies_svelte_eslint_parser: string;
	export const npm_package_dependencies_svelte: string;
	export const npm_lifecycle_script: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const npm_package_devDependencies_prettier_plugin_tailwindcss: string;
	export const NVM_BIN: string;
	export const npm_config_user_agent: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const GIT_ASKPASS: string;
	export const HOMEBREW_CELLAR: string;
	export const INFOPATH: string;
	export const npm_package_devDependencies__playwright_test: string;
	export const LC_TERMINAL: string;
	export const npm_package_dependencies__iconify_icons_ic: string;
	export const npm_config_stream: string;
	export const npm_package_scripts_check: string;
	export const COLORTERM: string;
	export const npm_package_scripts_test_unit: string;
	export const npm_node_execpath: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		NVM_INC: string;
		MANPATH: string;
		npm_package_dependencies__iconify_icons_eos_icons: string;
		npm_package_devDependencies_prettier: string;
		TERM_PROGRAM: string;
		NODE: string;
		INIT_CWD: string;
		NVM_CD_FLAGS: string;
		npm_package_devDependencies_prettier_plugin_svelte: string;
		npm_package_devDependencies_typescript: string;
		TERM: string;
		SHELL: string;
		npm_package_devDependencies_vite: string;
		npm_config_20_10_0: string;
		HOMEBREW_REPOSITORY: string;
		TMPDIR: string;
		npm_package_scripts_lint: string;
		TERM_PROGRAM_VERSION: string;
		npm_package_scripts_dev: string;
		ZDOTDIR: string;
		FIG_NEW_SESSION: string;
		ORIGINAL_XDG_CURRENT_DESKTOP: string;
		MallocNanoZone: string;
		TERM_SESSION_ID: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_config_registry: string;
		npm_package_devDependencies_tsconfig_paths: string;
		NVM_DIR: string;
		USER: string;
		npm_package_description: string;
		npm_package_dependencies__frequency_control_panel_common: string;
		npm_config_recursive: string;
		npm_package_scripts_check_watch: string;
		npm_package_license: string;
		COMMAND_MODE: string;
		PNPM_SCRIPT_SRC_DIR: string;
		npm_package_devDependencies_vite_tsconfig_paths: string;
		SSH_AUTH_SOCK: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_package_devDependencies_tslib: string;
		npm_execpath: string;
		npm_package_devDependencies_svelte: string;
		npm_config_frozen_lockfile: string;
		PATH: string;
		USER_ZDOTDIR: string;
		__CFBundleIdentifier: string;
		npm_package_author: string;
		PWD: string;
		npm_package_devDependencies_tailwindcss: string;
		npm_command: string;
		npm_package_scripts_preview: string;
		npm_lifecycle_event: string;
		LANG: string;
		npm_package_name: string;
		npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
		ITERM_PROFILE: string;
		npm_package_scripts_test_integration: string;
		NODE_PATH: string;
		npm_package_scripts_build: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		XPC_FLAGS: string;
		npm_package_devDependencies_vitest: string;
		npm_package_main: string;
		npm_config_node_gyp: string;
		XPC_SERVICE_NAME: string;
		npm_package_version: string;
		npm_package_devDependencies__sveltejs_adapter_auto: string;
		VSCODE_INJECTION: string;
		npm_package_devDependencies_svelte_check: string;
		COLORFGBG: string;
		SHLVL: string;
		HOME: string;
		npm_package_type: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		npm_package_scripts_test: string;
		LC_TERMINAL_VERSION: string;
		HOMEBREW_PREFIX: string;
		ITERM_SESSION_ID: string;
		LOGNAME: string;
		npm_package_scripts_format: string;
		npm_package_dependencies__iconify_svelte: string;
		npm_package_devDependencies_svelte_eslint_parser: string;
		npm_package_dependencies_svelte: string;
		npm_lifecycle_script: string;
		VSCODE_GIT_IPC_HANDLE: string;
		npm_package_devDependencies_prettier_plugin_tailwindcss: string;
		NVM_BIN: string;
		npm_config_user_agent: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		GIT_ASKPASS: string;
		HOMEBREW_CELLAR: string;
		INFOPATH: string;
		npm_package_devDependencies__playwright_test: string;
		LC_TERMINAL: string;
		npm_package_dependencies__iconify_icons_ic: string;
		npm_config_stream: string;
		npm_package_scripts_check: string;
		COLORTERM: string;
		npm_package_scripts_test_unit: string;
		npm_node_execpath: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
