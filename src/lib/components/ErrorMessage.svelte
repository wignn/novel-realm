<script lang="ts">
	interface ErrorMessageProps {
		message: string;
		onRetry: () => void;
	}

	let { message, onRetry }: ErrorMessageProps = $props();
</script>

<div class="rounded-lg bg-red-50 p-6 text-center">
	<svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
	<h3 class="mt-4 text-lg font-semibold text-red-900">Error Loading Novels</h3>
	<p class="mt-2 text-red-700">{message}</p>
	<button
		onclick={onRetry}
		class="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
	>
		Try Again
	</button>
</div>
