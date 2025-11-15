<script lang="ts">
	import NovelCardSkeleton from './NovelCardSkeleton.svelte';

	interface NovelGridSkeletonProps {
		count?: number;
	}

	let { count = 12 }: NovelGridSkeletonProps = $props();
</script>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each Array(count) as _, index (index)}
		<NovelCardSkeleton />
	{/each}
</div>
