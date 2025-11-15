<script lang="ts">
	import { onMount } from 'svelte';
	import type { Novel } from '$lib/types/novel';
	import { NovelService } from '$lib/services/novelService';
	import Header from '$lib/components/Header.svelte';
	import NovelGrid from '$lib/components/NovelGrid.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let novels: Novel[] = $state([]);
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
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
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
	<title>Novel Collection - Discover Amazing Stories</title>
	<meta name="description" content="Browse our collection of novels from various languages and genres" />
</svelte:head>

<div class="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
	<Header novelCount={novels.length} />

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if loading}
			<LoadingSpinner />
		{:else if error}
			<ErrorMessage message={error} onRetry={handleRetry} />
		{:else if novels.length === 0}
			<EmptyState />
		{:else}
			<NovelGrid {novels} />
			<Pagination 
				{currentPage} 
				{totalPages} 
				onPageChange={handlePageChange} 
			/>
		{/if}
	</main>

	<Footer />
</div>
