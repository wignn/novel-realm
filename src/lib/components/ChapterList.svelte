<script lang="ts">
	import type { Chapter } from '$lib/types/novel';
	import BookIcon from './icons/BookIcon.svelte';

	interface ChapterListProps {
		chapters: Chapter[];
		novelTitle: string;
	}

	let { chapters, novelTitle }: ChapterListProps = $props();
	
	const sortedChapters = $derived(
		[...chapters].sort((a, b) => a.chapter_number - b.chapter_number)
	);
</script>

<div class="rounded-2xl bg-white border border-slate-200 shadow-lg">
	<div class="border-b border-slate-200 p-6">
		<div class="flex items-center gap-3">
			<div class="rounded-lg bg-blue-100 p-3">
				<BookIcon />
			</div>
			<div>
				<h2 class="text-2xl font-bold text-slate-900">Chapters</h2>
				<p class="text-sm text-slate-600">
					{sortedChapters.length} {sortedChapters.length === 1 ? 'chapter' : 'chapters'} available
				</p>
			</div>
		</div>
	</div>

	<div class="p-6">
		{#if sortedChapters.length === 0}
			<div class="py-16 text-center">
				<div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
					<BookIcon />
				</div>
				<h3 class="mb-2 text-lg font-semibold text-slate-900">No Chapters Available</h3>
				<p class="text-sm text-slate-600">Chapters haven't been added yet. Check back later!</p>
			</div>
		{:else}
			<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
				{#each sortedChapters as chapter (chapter.id)}
					{#if chapter.asset}
						<a
							href={chapter.asset}
							target="_blank"
							rel="noopener noreferrer"
							class="group relative overflow-hidden rounded-xl border-2 border-slate-200 bg-white p-4 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-500/20"
						>
							<div class="mb-3 flex items-start justify-between gap-2">
								<div class="flex-1">
									<div class="mb-1 text-xs font-medium text-slate-500">Chapter</div>
									<div class="text-2xl font-bold text-blue-600 group-hover:text-blue-700">
										{chapter.chapter_number}
									</div>
								</div>
								<svg 
									class="h-5 w-5 shrink-0 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-blue-600" 
									fill="none" 
									stroke="currentColor" 
									viewBox="0 0 24 24"
								>
									<path 
										stroke-linecap="round" 
										stroke-linejoin="round" 
										stroke-width="2" 
										d="M9 5l7 7-7 7"
									></path>
								</svg>
							</div>
							
							<h3 class="mb-2 line-clamp-2 text-sm font-medium text-slate-700 group-hover:text-slate-900">
								{chapter.title}
							</h3>
							
							<div class="text-xs text-slate-500">
								{new Date(chapter.created_at).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric'
								})}
							</div>
						</a>
					{:else}
						<div
							class="relative overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-50 p-4 opacity-60"
						>
							<div class="mb-3 flex items-start justify-between gap-2">
								<div class="flex-1">
									<div class="mb-1 text-xs font-medium text-slate-400">Chapter</div>
									<div class="text-2xl font-bold text-slate-400">
										{chapter.chapter_number}
									</div>
								</div>
								<svg 
									class="h-5 w-5 shrink-0 text-slate-300" 
									fill="none" 
									stroke="currentColor" 
									viewBox="0 0 24 24"
								>
									<path 
										stroke-linecap="round" 
										stroke-linejoin="round" 
										stroke-width="2" 
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									></path>
								</svg>
							</div>
							
							<h3 class="mb-2 line-clamp-2 text-sm font-medium text-slate-500">
								{chapter.title}
							</h3>
							
							<div class="text-xs text-slate-400">
								Locked
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</div>
