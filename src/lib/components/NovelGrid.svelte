<script lang="ts">
	import type { Novel, Chapter } from '$lib/types/novel';
	import NovelCard from './NovelCard.svelte';

	interface NovelGridProps {
		novels: Novel[];
		chaptersMap?: Map<string, Chapter[]>;
	}

	let { novels, chaptersMap = new Map() }: NovelGridProps = $props();
</script>

<!-- Responsive grid: 1 column on mobile, 2 on tablet, 3 on laptop, 4 on desktop -->
<div class="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each novels as novel, index (novel.id)}
		<NovelCard {novel} chapters={chaptersMap.get(novel.id) || []} priority={index < 8} />
	{/each}
</div>
