<script lang="ts">
	import { onMount } from 'svelte';
	import type { Novel, Genre } from '$lib/types/novel';
	import { NovelService } from '$lib/services/novelService';
	import Header from '$lib/components/Header.svelte';
	import NovelGrid from '$lib/components/NovelGrid.svelte';
	import NovelGridSkeleton from '$lib/components/NovelGridSkeleton.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Footer from '$lib/components/Footer.svelte';

	// State
	let novels: Novel[] = $state([]);
	let genres: Genre[] = $state([]);
	let loading = $state(true);
	let error: string | null = $state(null);
	let currentPage = $state(1);
	let totalPages = $state(1);
	let totalItems = $state(0);

	// Filters
	let searchQuery = $state('');
	let selectedGenres: string[] = $state([]);
	let sortBy: 'newest' | 'oldest' | 'popular' | 'alphabetical' = $state('newest');
	
	// Debounce
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;

	async function fetchNovels(page: number = 1) {
		loading = true;
		error = null;
		
		try {
			const data = await NovelService.fetchNovels({
				page,
				search: searchQuery || undefined,
				genres: selectedGenres.length > 0 ? selectedGenres.join(',') : undefined,
				sort: sortBy
			});
			novels = data.data;
			currentPage = data.page;
			totalPages = data.total_pages;
			totalItems = data.total_items;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	async function fetchGenres() {
		try {
			const data = await NovelService.fetchGenres();
			genres = data.data || [];
		} catch (err) {
			console.error('Failed to fetch genres:', err);
		}
	}

	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;
		
		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			currentPage = 1;
			fetchNovels(1);
		}, 400);
	}

	function toggleGenre(genreTitle: string) {
		if (selectedGenres.includes(genreTitle)) {
			selectedGenres = selectedGenres.filter(g => g !== genreTitle);
		} else {
			selectedGenres = [...selectedGenres, genreTitle];
		}
		currentPage = 1;
		fetchNovels(1);
	}

	function clearGenres() {
		selectedGenres = [];
		currentPage = 1;
		fetchNovels(1);
	}

	function handleSortChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		sortBy = target.value as typeof sortBy;
		currentPage = 1;
		fetchNovels(1);
	}

	function handlePageChange(page: number) {
		fetchNovels(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function handleRetry() {
		fetchNovels(currentPage);
	}

	onMount(() => {
		fetchGenres();
		fetchNovels();
	});
</script>

<svelte:head>
	<title>Browse Novels - Wign Realm</title>
	<meta name="description" content="Browse and discover novels by genre, search, and more" />
</svelte:head>

<div class="min-h-screen bg-background">
	<Header novelCount={totalItems} />
	
	<main class="py-6 sm:py-8 lg:py-12">
		<div class="container mx-auto px-4 sm:px-6">
			<!-- Page Header -->
			<div class="mb-8">
				<h1 class="text-2xl sm:text-3xl font-bold text-foreground mb-2">Browse Novels</h1>
				<p class="text-muted-foreground">Discover stories from our collection</p>
			</div>

			<!-- Filters Section -->
			<div class="mb-8 space-y-4">
				<!-- Search & Sort Row -->
				<div class="flex flex-col sm:flex-row gap-4">
					<!-- Search Bar -->
					<div class="relative flex-1">
						<input 
							type="text" 
							placeholder="Search novels by title..." 
							value={searchQuery}
							oninput={handleSearchInput}
							class="w-full rounded-lg border border-border bg-card px-4 py-3 pl-11 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
						/>
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
							<circle cx="11" cy="11" r="8"></circle>
							<path d="m21 21-4.3-4.3"></path>
						</svg>
					</div>
					
					<!-- Sort Dropdown -->
					<select 
						value={sortBy}
						onchange={handleSortChange}
						class="rounded-lg border border-border bg-card px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer min-w-[160px]"
					>
						<option value="newest">Newest First</option>
						<option value="oldest">Oldest First</option>
						<option value="popular">Most Popular</option>
						<option value="alphabetical">A - Z</option>
					</select>
				</div>

				<!-- Genre Filter -->
				{#if genres.length > 0}
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<span class="text-sm font-medium text-foreground">Filter by Genre</span>
							{#if selectedGenres.length > 0}
								<button 
									onclick={clearGenres}
									class="text-xs text-primary hover:text-primary-hover transition-colors"
								>
									Clear all ({selectedGenres.length})
								</button>
							{/if}
						</div>
						<div class="flex flex-wrap gap-2">
							{#each genres as genre (genre.id)}
								<button
									onclick={() => toggleGenre(genre.title.toLowerCase())}
									class="px-3 py-1.5 rounded-full text-sm font-medium transition-all {selectedGenres.includes(genre.title.toLowerCase()) 
										? 'bg-primary text-white' 
										: 'bg-card border border-border text-foreground hover:bg-primary/10 hover:border-primary/30'}"
								>
									{genre.title}
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- Results Info -->
			{#if !loading && !error}
				<div class="mb-6 flex items-center justify-between">
					<p class="text-sm text-muted-foreground">
						{#if totalItems > 0}
							Showing {novels.length} of {totalItems} novels
							{#if searchQuery}
								for "{searchQuery}"
							{/if}
						{:else}
							No novels found
						{/if}
					</p>
				</div>
			{/if}

			<!-- Content -->
			{#if loading}
				<NovelGridSkeleton count={12} />
			{:else if error}
				<ErrorMessage message={error} onRetry={handleRetry} />
			{:else if novels.length === 0}
				<EmptyState />
			{:else}
				<NovelGrid {novels} chaptersMap={new Map()} />
				
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
