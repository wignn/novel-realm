<script lang="ts">
	interface NovelGridSkeletonProps {
		count?: number;
	}
	
	let { count = 12 }: NovelGridSkeletonProps = $props();
</script>

<div class="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each Array(count) as _}
		<div class="flex gap-3 sm:gap-4 rounded-xl bg-card border border-border p-3 sm:p-4 animate-pulse">
			<div class="w-20 sm:w-24 h-28 sm:h-32 rounded-lg bg-muted flex-shrink-0"></div>
			<div class="flex-1 space-y-2 sm:space-y-3">
				<div class="h-4 sm:h-5 bg-muted rounded w-3/4"></div>
				<div class="h-3 bg-muted rounded w-1/2"></div>
				<div class="space-y-1.5">
					<div class="h-3 bg-muted rounded w-full"></div>
					<div class="h-3 bg-muted rounded w-full"></div>
					<div class="h-3 bg-muted rounded w-full"></div>
				</div>
			</div>
		</div>
	{/each}
</div>
