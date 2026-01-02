<script lang="ts">
	import { onMount } from 'svelte';
	import { NovelService } from '$lib/services/novelService';
	import { GenreService } from '$lib/services/genreService';

	let novelCount = $state(0);
	let chapterCount = $state(0);
	let genreCount = $state(0);
	let loading = $state(true);

	onMount(async () => {
		try {
			const [novels, genres] = await Promise.all([
				NovelService.fetchNovels(1),
				GenreService.fetchGenres()
			]);
			novelCount = novels.total_items;
			genreCount = genres.data?.length || 0;
		} catch (err) {
			console.error('Failed to load stats:', err);
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Dashboard - Admin Panel</title>
</svelte:head>

<div class="p-6 sm:p-8">
	<div class="mb-8">
		<h1 class="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
		<p class="text-muted-foreground mt-1">Welcome to the admin panel</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
		<!-- Novels -->
		<div class="bg-card border border-border rounded-xl p-5">
			<div class="flex items-center gap-4">
				<div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
						<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
					</svg>
				</div>
				<div>
					<p class="text-2xl font-bold text-foreground">
						{#if loading}<span class="animate-pulse">--</span>{:else}{novelCount}{/if}
					</p>
					<p class="text-sm text-muted-foreground">Novels</p>
				</div>
			</div>
		</div>

		<!-- Genres -->
		<div class="bg-card border border-border rounded-xl p-5">
			<div class="flex items-center gap-4">
				<div class="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500">
						<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path>
						<circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>
					</svg>
				</div>
				<div>
					<p class="text-2xl font-bold text-foreground">
						{#if loading}<span class="animate-pulse">--</span>{:else}{genreCount}{/if}
					</p>
					<p class="text-sm text-muted-foreground">Genres</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="mt-8">
		<h2 class="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			<a href="/admin/novels" class="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
					<path d="M5 12h14"></path>
					<path d="M12 5v14"></path>
				</svg>
				<span class="font-medium text-foreground">Add Novel</span>
			</a>
			<a href="/admin/chapters" class="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
					<path d="M5 12h14"></path>
					<path d="M12 5v14"></path>
				</svg>
				<span class="font-medium text-foreground">Add Chapter</span>
			</a>
			<a href="/admin/genres" class="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
					<path d="M5 12h14"></path>
					<path d="M12 5v14"></path>
				</svg>
				<span class="font-medium text-foreground">Add Genre</span>
			</a>
			<a href="/" target="_blank" class="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
					<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
					<polyline points="15 3 21 3 21 9"></polyline>
					<line x1="10" x2="21" y1="14" y2="3"></line>
				</svg>
				<span class="font-medium text-foreground">View Site</span>
			</a>
		</div>
	</div>
</div>
