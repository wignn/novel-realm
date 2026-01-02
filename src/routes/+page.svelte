<script lang="ts">
	import { onMount } from 'svelte';
	import type { Novel, Chapter } from '$lib/types/novel';
	import { NovelService } from '$lib/services/novelService';
	import Header from '$lib/components/Header.svelte';
	import HeroBanner from '$lib/components/HeroBanner.svelte';
	import HeroBannerSkeleton from '$lib/components/HeroBannerSkeleton.svelte';
	import NovelGrid from '$lib/components/NovelGrid.svelte';
	import NovelGridSkeleton from '$lib/components/NovelGridSkeleton.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let novels: Novel[] = $state([]);
	let chaptersMap: Map<string, Chapter[]> = $state(new Map());
	let loading: boolean = $state(true);
	let error: string | null = $state(null);
	let currentPage: number = $state(1);
	let totalPages: number = $state(1);

	async function fetchNovels(page: number = 1) {
		loading = true;
		error = null;
		
		try {
			const data = await NovelService.fetchNovels(page);
			novels = data.data;
			currentPage = data.page;
			totalPages = data.total_pages;
			
			// Fetch chapters for all novels in parallel
			await fetchChaptersForNovels(novels);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	async function fetchChaptersForNovels(novelList: Novel[]) {
		const newChaptersMap = new Map<string, Chapter[]>();
		
		// Fetch chapters for each novel in parallel
		const promises = novelList.map(async (novel) => {
			try {
				const data = await NovelService.fetchChaptersByNovelId(novel.id);
				newChaptersMap.set(novel.id, data.data || []);
			} catch {
				newChaptersMap.set(novel.id, []);
			}
		});
		
		await Promise.all(promises);
		chaptersMap = newChaptersMap;
	}

	function handlePageChange(page: number) {
		fetchNovels(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function handleRetry() {
		fetchNovels(currentPage);
	}

	onMount(() => {
		fetchNovels();
	});
</script>

<svelte:head>
	<title>Wign Realm - Discover Amazing Web Novels</title>
	<meta name="description" content="Browse our collection of novels from various languages and genres" />
	
	<link rel="preconnect" href="https://cdn.othinus.cloud" />
	<link rel="dns-prefetch" href="https://cdn.othinus.cloud" />
	
	{#if novels.length > 0 && novels[0]}
		<link 
			rel="preload" 
			as="image" 
			href="{novels[0].cover}?w=400&q=75"
			fetchpriority="high"
		/>
	{/if}
</svelte:head>

<div class="min-h-screen bg-background">
	<Header novelCount={novels.length} />
	
	{#if loading}
		<HeroBannerSkeleton />
	{:else if novels.length > 0 && novels[0]}
		<HeroBanner novel={novels[0]} />
	{/if}

	<main class="py-6 sm:py-8 lg:py-12">
		<div class="container mx-auto px-4 sm:px-6">
			<!-- Section Header -->
			<div class="mb-6 sm:mb-8">
				<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h2 class="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 sm:h-6 sm:w-6 text-primary">
								<path d="M11 12H3"></path>
								<path d="M16 6H3"></path>
								<path d="M16 18H3"></path>
								<path d="M18 9v6"></path>
								<path d="M21 12h-6"></path>
							</svg>
							Latest Releases
						</h2>
						<p class="mt-1 text-sm text-muted-foreground hidden sm:block">
							Discover the newest chapters from your favorite novels
						</p>
					</div>
					
					<!-- Stats Badge (Desktop) -->
					<div class="hidden sm:flex items-center gap-4">
						<div class="flex items-center gap-2 rounded-lg bg-card border border-border px-3 py-2">
							<span class="text-sm text-muted-foreground">Total:</span>
							<span class="text-sm font-semibold text-foreground">{novels.length} novels</span>
						</div>
					</div>
				</div>
			</div>

			{#if loading}
				<NovelGridSkeleton count={12} />
			{:else if error}
				<ErrorMessage message={error} onRetry={handleRetry} />
			{:else if novels.length === 0}
				<EmptyState />
			{:else}
				<NovelGrid {novels} {chaptersMap} />
				
				{#if totalPages > 1}
					<div class="mt-8 sm:mt-10">
						<Pagination 
							{currentPage} 
							{totalPages} 
							onPageChange={handlePageChange} 
						/>
					</div>
				{/if}
			{/if}
		</div>
	</main>

	<Footer />
</div>
