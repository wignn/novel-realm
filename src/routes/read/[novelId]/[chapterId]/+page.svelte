<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { NovelService } from '$lib/services/novelService';
	import type { Chapter, Novel } from '$lib/types/novel';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';

	let chapter: Chapter | null = $state(null);
	let novel: Novel | null = $state(null);
	let allChapters: Chapter[] = $state([]);
	let loading = $state(true);
	let error: string | null = $state(null);

	async function fetchData(novelId: string, chapterId: string) {
		loading = true;
		error = null;
		try {
			// Fetch chapter content
			const chapterRes = await NovelService.fetchChapter(chapterId);
			chapter = chapterRes.data;
			
			// Fetch novel info for title and navigation
			const novelRes = await NovelService.fetchNovelById(novelId);
			novel = novelRes.data;
			
			// Fetch all chapters for navigation
			const chaptersRes = await NovelService.fetchChaptersByNovelId(novelId);
			allChapters = chaptersRes.data?.sort((a, b) => a.chapter_num - b.chapter_num) || [];
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load chapter';
		} finally {
			loading = false;
		}
	}

	function handleRetry() {
		const { novelId, chapterId } = $page.params;
		if (novelId && chapterId) fetchData(novelId, chapterId);
	}

	function goToNovel() {
		if (novel) goto(`/view/${novel.id}`);
	}

	function goToChapter(chapterId: string) {
		const { novelId } = $page.params;
		goto(`/read/${novelId}/${chapterId}`);
	}

	// Find prev/next chapters
	const currentIndex = $derived(
		chapter ? allChapters.findIndex(c => c.id === chapter!.id) : -1
	);
	const prevChapter = $derived(currentIndex > 0 ? allChapters[currentIndex - 1] : null);
	const nextChapter = $derived(currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null);

	$effect(() => {
		const { novelId, chapterId } = $page.params;
		if (novelId && chapterId) fetchData(novelId, chapterId);
	});
</script>

<svelte:head>
	<title>{chapter ? `${chapter.title} - ${novel?.title || 'Reading'}` : 'Loading...'}</title>
	<meta name="description" content={chapter?.description || 'Read chapter'} />
</svelte:head>

<div class="min-h-screen bg-background">
	<Header novelCount={0} />
	
	{#if loading}
		<div class="container mx-auto px-4 py-8">
			<div class="max-w-3xl mx-auto animate-pulse space-y-4">
				<div class="h-8 w-48 bg-muted rounded"></div>
				<div class="h-12 w-3/4 bg-muted rounded"></div>
				<div class="space-y-3 mt-8">
					{#each Array(10) as _}
						<div class="h-4 w-full bg-muted rounded"></div>
					{/each}
				</div>
			</div>
		</div>
	{:else if error}
		<div class="container mx-auto px-4 py-8">
			<ErrorMessage message={error} onRetry={handleRetry} />
		</div>
	{:else if chapter && novel}
		<!-- Breadcrumb & Navigation -->
		<div class="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
			<div class="container mx-auto px-4 py-3">
				<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<!-- Breadcrumb -->
					<div class="flex items-center gap-2 text-sm text-muted-foreground overflow-hidden">
						<button onclick={goToNovel} class="hover:text-primary transition-colors truncate max-w-[150px] sm:max-w-[200px]">
							{novel.title}
						</button>
						<span>/</span>
						<span class="text-foreground font-medium truncate">Chapter {chapter.chapter_num}</span>
					</div>
					
					<!-- Chapter Navigation -->
					<div class="flex items-center gap-2">
						<button
							onclick={() => prevChapter && goToChapter(prevChapter.id)}
							disabled={!prevChapter}
							class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-card border border-border hover:bg-primary/10 hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
							</svg>
							<span class="hidden sm:inline">Prev</span>
						</button>
						
						<select
							onchange={(e) => goToChapter((e.target as HTMLSelectElement).value)}
							class="px-3 py-1.5 text-sm rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[120px]"
						>
							{#each allChapters as ch (ch.id)}
								<option value={ch.id} selected={ch.id === chapter.id}>
									Ch. {ch.chapter_num}
								</option>
							{/each}
						</select>
						
						<button
							onclick={() => nextChapter && goToChapter(nextChapter.id)}
							disabled={!nextChapter}
							class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-card border border-border hover:bg-primary/10 hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							<span class="hidden sm:inline">Next</span>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Chapter Content -->
		<main class="container mx-auto px-4 py-6 sm:py-10">
			<article class="max-w-3xl mx-auto">
				<!-- Chapter Header -->
				<header class="mb-6 sm:mb-8 text-center">
					<h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
						Chapter {chapter.chapter_num}: {chapter.title}
					</h1>
					<p class="text-sm text-muted-foreground">
						{new Date(chapter.created_at).toLocaleDateString('en-US', { 
							year: 'numeric', 
							month: 'long', 
							day: 'numeric' 
						})}
					</p>
				</header>
				
				<!-- Chapter Content (HTML from backend) -->
				<div 
					class="prose prose-invert prose-lg max-w-none
						prose-headings:text-foreground prose-headings:font-bold
						prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-4
						prose-a:text-primary prose-a:hover:text-primary-hover
						prose-strong:text-foreground prose-em:text-foreground/90
						prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
						prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded
						prose-hr:border-border
						text-base sm:text-lg leading-relaxed sm:leading-loose"
				>
					{@html chapter.content}
				</div>
				
				<!-- Bottom Navigation -->
				<div class="mt-8 sm:mt-12 pt-6 border-t border-border">
					<div class="flex flex-col sm:flex-row justify-between gap-4">
						{#if prevChapter}
							<button
								onclick={() => goToChapter(prevChapter.id)}
								class="flex-1 flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
							>
								<svg class="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
								</svg>
								<div>
									<div class="text-xs text-muted-foreground">Previous</div>
									<div class="text-sm font-medium text-foreground">Chapter {prevChapter.chapter_num}</div>
								</div>
							</button>
						{:else}
							<div class="flex-1"></div>
						{/if}
						
						{#if nextChapter}
							<button
								onclick={() => goToChapter(nextChapter.id)}
								class="flex-1 flex items-center justify-end gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-right"
							>
								<div>
									<div class="text-xs text-muted-foreground">Next</div>
									<div class="text-sm font-medium text-foreground">Chapter {nextChapter.chapter_num}</div>
								</div>
								<svg class="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
								</svg>
							</button>
						{:else}
							<div class="flex-1 text-center">
								<button
									onclick={goToNovel}
									class="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
									</svg>
									Finished! Back to Novel
								</button>
							</div>
						{/if}
					</div>
				</div>
			</article>
		</main>
	{/if}
	
	<Footer />
</div>

<style>
	/* Custom styles for HTML content */
	:global(.prose p) {
		text-indent: 2em;
	}
	:global(.prose p:first-of-type) {
		text-indent: 0;
	}
</style>
