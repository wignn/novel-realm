<script lang="ts">
	import type { Novel, Chapter } from '$lib/types/novel';
	import { goto } from '$app/navigation';

	interface NovelCardProps {
		novel: Novel;
		chapters?: Chapter[];
		priority?: boolean;
	}

	let { novel, chapters = [], priority = false }: NovelCardProps = $props();
	
	function getResponsiveImageUrl(url: string, width: number): string {
		return `${url}?w=${width}&q=75`;
	}

	function formatRelativeTime(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'just now';
		if (diffMins < 60) return `${diffMins}m`;
		if (diffHours < 24) return `${diffHours}h`;
		if (diffDays < 7) return `${diffDays}d`;
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	function handleCardClick(event: MouseEvent | KeyboardEvent) {
		if ((event.target as HTMLElement).tagName !== 'BUTTON') {
			goto(`/view/${novel.id}`);
		}
	}

	// Get latest 3 chapters sorted by chapter number (descending)
	const latestChapters = $derived(
		[...chapters]
			.sort((a, b) => b.chapter_num - a.chapter_num)
			.slice(0, 3)
	);
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<article 
	class="group relative flex gap-3 sm:gap-4 overflow-hidden rounded-xl bg-card border border-border p-3 sm:p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
	onclick={handleCardClick}
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && handleCardClick(e)}
>
	<!-- Cover Image -->
	<div class="relative w-20 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg">
		<img
			src={getResponsiveImageUrl(novel.cover, 200)}
			alt={novel.title}
			class="h-28 sm:h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
			loading={priority ? 'eager' : 'lazy'}
			fetchpriority={priority ? 'high' : 'auto'}
		/>
		
		{#if novel.popular}
			<div class="absolute top-1 left-1">
				<span class="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-primary to-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-lg">
					<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
					</svg>
					HOT
				</span>
			</div>
		{/if}
		
		<!-- Language badge -->
		<div class="absolute bottom-1 left-1">
			<span class="rounded bg-background/80 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-medium text-foreground/80">
				{novel.language}
			</span>
		</div>
	</div>

	<!-- Content -->
	<div class="flex flex-1 flex-col min-w-0 justify-between">
		<!-- Title & Status -->
		<div class="mb-2">
			<h3 class="line-clamp-2 text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
				{novel.title}
			</h3>
			<div class="mt-1 flex items-center gap-2">
				<span class="inline-flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
					<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
						<circle cx="9" cy="7" r="4"></circle>
					</svg>
					{novel.author}
				</span>
			</div>
		</div>
		
		<!-- Chapter List -->
		<div class="space-y-1">
			{#if latestChapters.length > 0}
				{#each latestChapters as chapter (chapter.id)}
					<div class="flex items-center justify-between text-xs group/chapter">
						<span class="flex items-center gap-1.5 text-foreground/70 group-hover/chapter:text-primary transition-colors">
							<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-50">
								<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
							</svg>
							<span class="truncate">Ch. {chapter.chapter_num}</span>
						</span>
						<span class="text-[10px] text-muted-foreground flex-shrink-0">{formatRelativeTime(chapter.created_at)}</span>
					</div>
				{/each}
			{:else}
				<div class="text-[10px] sm:text-xs text-muted-foreground italic py-1">
					No chapters yet
				</div>
			{/if}
		</div>
	</div>
	
	<!-- Hover Indicator -->
	<div class="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
			<path d="m9 18 6-6-6-6"></path>
		</svg>
	</div>
</article>
