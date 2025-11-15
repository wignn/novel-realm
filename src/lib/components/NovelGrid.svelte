<script lang="ts">
	import type { Novel } from '$lib/types/novel';
	import NovelCard from './NovelCard.svelte';

	interface NovelGridProps {
		novels: Novel[];
	}

	let { novels }: NovelGridProps = $props();
</script>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each novels as novel (novel.id)}
		<NovelCard {novel} />
	{/each}
</div>
