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
	<div class="p-4 sm:p-6">
		{#if sortedChapters.length === 0}
			<div class="py-12 sm:py-16 text-center">
				<div class="mx-auto mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-muted">
					<BookIcon class="h-8 w-8 sm:h-10 sm:w-10" />
				</div>
				<h3 class="mb-2 text-base sm:text-lg font-semibold text-foreground">No Chapters Available</h3>
				<p class="text-sm text-muted-foreground">Chapters haven't been added yet. Check back later!</p>
			</div>
		{:else}
			<div class="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{#each sortedChapters as chapter (chapter.id)}
					<a
						href="/read/{novelId}/{chapter.id}"
						class="group relative overflow-hidden rounded-lg sm:rounded-xl border-2 border-border bg-card p-3 sm:p-4 transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/20"
					>
						<div class="mb-2 sm:mb-3 flex items-start justify-between gap-1 sm:gap-2">
							<div class="flex-1">
								<div class="mb-0.5 sm:mb-1 text-[10px] sm:text-xs font-medium text-muted-foreground">Chapter</div>
								<div class="text-xl sm:text-2xl font-bold text-primary group-hover:text-primary">
									{chapter.chapter_num}
								</div>
							</div>
							<svg 
								class="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" 
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
							</svg>
						</div>
						
						<h3 class="mb-1 sm:mb-2 line-clamp-2 text-xs sm:text-sm font-medium text-foreground/80 group-hover:text-foreground">
							{chapter.title}
						</h3>
						
						<div class="text-[10px] sm:text-xs text-muted-foreground">
							{new Date(chapter.created_at).toLocaleDateString('en-US', {
								month: 'short',
								day: 'numeric'
							})}
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
