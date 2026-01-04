<script lang="ts">
	import type { Chapter } from '$lib/types/novel';
	import BookIcon from './icons/BookIcon.svelte';

	interface ChapterListProps {
		chapters: Chapter[];
		novelTitle: string;
		novelId: string;
	}

	let { chapters, novelTitle, novelId }: ChapterListProps = $props();
	
	const sortedChapters = $derived(
		[...chapters].sort((a, b) => a.chapter_num - b.chapter_num)
	);
</script>

<div class="rounded-xl sm:rounded-2xl bg-card border border-border shadow-lg">
	<!-- Header -->
	<div class="border-b border-border p-4 sm:p-6">
		<div class="flex items-center gap-3">
			<div class="rounded-lg bg-primary/10 p-2 sm:p-3">
				<BookIcon class="h-5 w-5 sm:h-6 sm:w-6" />
			</div>
			<div>
				<h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Chapters</h2>
				<p class="text-xs sm:text-sm text-muted-foreground">
					{sortedChapters.length} {sortedChapters.length === 1 ? 'chapter' : 'chapters'} available
				</p>
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="p-3 sm:p-4">
		{#if sortedChapters.length === 0}
			<div class="py-8 sm:py-12 text-center">
				<div class="mx-auto mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-muted">
					<BookIcon class="h-6 w-6 sm:h-7 sm:w-7" />
				</div>
				<h3 class="mb-1 text-sm sm:text-base font-semibold text-foreground">No Chapters Available</h3>
				<p class="text-xs sm:text-sm text-muted-foreground">Chapters haven't been added yet. Check back later!</p>
			</div>
		{:else}
			<div class="grid gap-1.5 sm:gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
				{#each sortedChapters as chapter (chapter.id)}
					<a
						href="/read/{novelId}/{chapter.id}"
						class="group relative overflow-hidden rounded-lg border border-border bg-card p-2 sm:p-2.5 transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:shadow-md"
					>
						<div class="flex items-center justify-between gap-1 mb-1">
							<span class="text-[9px] sm:text-[10px] font-medium text-muted-foreground">Ch.</span>
							<span class="text-sm sm:text-base font-bold text-primary">{chapter.chapter_num}</span>
						</div>
						
						<h3 class="line-clamp-1 text-[10px] sm:text-xs font-medium text-foreground/70 group-hover:text-foreground">
							{chapter.title}
						</h3>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
