<script lang="ts">
	import * as siwa from '@projectlibertylabs/siwa';
	export let credentials = [];

	let selectedCredentials = {
		VerifiedGraphKeyCredential: false,
		VerifiedEmailAddressCredential: false,
		VerifiedPhoneNumberCredential: false
	};

	// Build the request based on selected credentials
	$: credentials = buildCredentialsRequest(selectedCredentials);

	function buildCredentialsRequest(selected: typeof selectedCredentials) {
		const request: siwa.SiwaCredentialRequest[] = [];

		// Add VerifiedGraphKeyCredential if selected
		if (selected.VerifiedGraphKeyCredential) {
			request.push(siwa.VerifiedGraphKeyCredential);
		}

		// Add anyOf block for contact methods
		const anyOfCredentials = [];
		if (selected.VerifiedEmailAddressCredential) {
			anyOfCredentials.push(siwa.VerifiedEmailAddressCredential);
		}
		if (selected.VerifiedPhoneNumberCredential) {
			anyOfCredentials.push(siwa.VerifiedPhoneNumberCredential);
		}

		if (anyOfCredentials.length > 0) {
			request.push({ anyOf: anyOfCredentials });
		}

		// Sort the Arrays first
		return request.toSorted((a) => (Array.isArray(a) ? 1 : -1));
	}
</script>

<fieldset>
	<legend>Select Credentials</legend>

	<div class="checkboxes">
		<label>
			<input type="checkbox" bind:checked={selectedCredentials.VerifiedGraphKeyCredential} />
			Graph Key (Required for reading private graph)
		</label>

		<label>
			<input type="checkbox" bind:checked={selectedCredentials.VerifiedEmailAddressCredential} />
			Verified Email Address
		</label>

		<label>
			<input type="checkbox" bind:checked={selectedCredentials.VerifiedPhoneNumberCredential} />
			Verified SMS/Phone Number
		</label>
	</div>
</fieldset>
