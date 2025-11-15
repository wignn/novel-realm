<script lang="ts">
	interface PaginationProps {
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
	}

	let { currentPage, totalPages, onPageChange }: PaginationProps = $props();

	function handlePageChange(page: number) {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
		}
	}

	let visiblePages = $derived(() => {
		const pages: (number | 'ellipsis')[] = [];
		
		for (let i = 1; i <= totalPages; i++) {
			if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
				pages.push(i);
			} else if (i === currentPage - 2 || i === currentPage + 2) {
				pages.push('ellipsis');
			}
		}
		
		return pages;
	});
</script>

{#if totalPages > 1}
	<div class="mt-12 flex items-center justify-center gap-2">
		<button
			onclick={() => handlePageChange(currentPage - 1)}
			disabled={currentPage === 1}
			aria-label="Previous page"
			class="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<div class="flex items-center gap-2">
			{#each visiblePages() as page}
				{#if page === 'ellipsis'}
					<span class="px-2 text-slate-500">...</span>
				{:else}
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						onclick={() => handlePageChange(page)}
						class="min-w-10 rounded-lg px-4 py-2 text-sm font-medium transition-colors {page === currentPage
							? 'bg-blue-600 text-white'
							: 'bg-white text-slate-700 hover:bg-slate-50'}"
					>
					</button>
				{/if}
			{/each}
		</div>

		<button
			onclick={() => handlePageChange(currentPage + 1)}
			disabled={currentPage === totalPages}
			aria-label="Next page"
			class="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>
{/if}
