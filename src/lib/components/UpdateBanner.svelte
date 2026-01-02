<script lang="ts">
	let { onClose }: { onClose?: () => void } = $props();
</script>

<div class="border-b border-primary/20 bg-gradient-to-r from-primary/10 to-red-900/10">
	<div class="container mx-auto px-4">
		<button 
			type="button" 
			onclick={onClose}
			class="flex w-full flex-wrap items-center justify-between gap-2 py-3 text-left text-sm transition hover:opacity-90 sm:text-base"
		>
			<span class="flex min-w-0 flex-1 items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 shrink-0 text-primary">
					<path d="m3 11 18-5v12L3 14v-3z"></path>
					<path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
				</svg>
				<span class="truncate font-medium text-primary">Latest Update:</span>
				<span class="min-w-0 truncate font-medium text-foreground/90">Fresh Chapters, Refined Reader Experience</span>
			</span>
			<span class="flex items-center gap-1 text-sm text-primary">
				<span>Read more</span>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
					<path d="m9 18 6-6-6-6"></path>
				</svg>
			</span>
		</button>
	</div>
</div>
