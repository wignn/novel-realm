<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { BookmarkService, type BookmarkWithBook } from '$lib/services/bookmarkService';
	import { AuthService } from '$lib/services/authService';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let bookmarks: BookmarkWithBook[] = $state([]);
	let loading = $state(true);
	let error = $state('');

	onMount(async () => {
		if (!AuthService.isAuthenticated()) {
			goto('/auth/login');
			return;
		}

		try {
			bookmarks = await BookmarkService.getBookmarks();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load bookmarks';
		} finally {
			loading = false;
		}
	});

	async function handleRemoveBookmark(bookmarkId: string, event: MouseEvent) {
		event.stopPropagation();
		try {
			await BookmarkService.removeBookmark(bookmarkId);
			bookmarks = bookmarks.filter(b => b.id !== bookmarkId);
		} catch (err) {
			console.error('Failed to remove bookmark:', err);
		}
	}

	function navigateToNovel(bookId: string) {
		goto(`/view/${bookId}`);
	}
</script>

<svelte:head>
	<title>My Bookmarks - Wign Realm</title>
</svelte:head>

<div class="min-h-screen bg-background flex flex-col">
	<Header novelCount={0} />
	
	<main class="flex-1">
		<div class="container mx-auto px-4 py-8">
			<!-- Page Header -->
			<div class="mb-8">
				<div class="flex items-center gap-4">
					<div class="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
						<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
							<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
						</svg>
					</div>
					<div>
						<h1 class="text-2xl sm:text-3xl font-bold text-foreground">My Bookmarks</h1>
						<p class="text-sm text-muted-foreground mt-1">
							{#if loading}
								Loading your saved novels...
							{:else}
								{bookmarks.length} {bookmarks.length === 1 ? 'novel' : 'novels'} saved
							{/if}
						</p>
					</div>
				</div>
			</div>

			<!-- Content -->
			{#if loading}
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{#each Array(8) as _}
						<div class="animate-pulse rounded-xl bg-card border border-border p-4">
							<div class="flex gap-4">
								<div class="w-20 h-28 rounded-lg bg-muted"></div>
								<div class="flex-1 space-y-3">
									<div class="h-4 bg-muted rounded w-3/4"></div>
									<div class="h-3 bg-muted rounded w-1/2"></div>
									<div class="h-3 bg-muted rounded w-full"></div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else if error}
				<div class="text-center py-16">
					<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-400">
							<circle cx="12" cy="12" r="10"/>
							<line x1="12" x2="12" y1="8" y2="12"/>
							<line x1="12" x2="12.01" y1="16" y2="16"/>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
					<p class="text-muted-foreground">{error}</p>
				</div>
			{:else if bookmarks.length === 0}
				<div class="text-center py-16">
					<div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
						<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
							<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
						</svg>
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-2">No Bookmarks Yet</h3>
					<p class="text-muted-foreground mb-6 max-w-md mx-auto">
						Start exploring novels and bookmark your favorites to find them here later!
					</p>
					<a href="/" class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
							<polyline points="9 22 9 12 15 12 15 22"/>
						</svg>
						Explore Novels
					</a>
				</div>
			{:else}
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{#each bookmarks as bookmark (bookmark.id)}
						<div 
							class="group relative rounded-xl bg-card border border-border overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
							onclick={() => navigateToNovel(bookmark.book.id)}
							onkeydown={(e) => e.key === 'Enter' && navigateToNovel(bookmark.book.id)}
							tabindex="0"
							role="button"
						>
							<div class="flex gap-4 p-4">
								<!-- Cover -->
								<div class="relative w-20 flex-shrink-0">
									<img 
										src="{bookmark.book.cover}?w=160&q=75" 
										alt={bookmark.book.title}
										class="w-full h-28 object-cover rounded-lg shadow-md"
										loading="lazy"
									/>
								</div>
								
								<!-- Info -->
								<div class="flex-1 min-w-0 flex flex-col">
									<h3 class="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
										{bookmark.book.title}
									</h3>
									<p class="text-xs text-muted-foreground mt-1 flex items-center gap-1">
										<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
											<circle cx="9" cy="7" r="4"/>
										</svg>
										{bookmark.book.author}
									</p>
									<p class="text-xs text-muted-foreground mt-2 line-clamp-2">
										{bookmark.book.description}
									</p>
									<div class="mt-auto pt-2">
										<span class="text-[10px] text-muted-foreground">
											Saved {new Date(bookmark.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
										</span>
									</div>
								</div>
							</div>
							
							<!-- Remove Button -->
							<button
								type="button"
								onclick={(e) => handleRemoveBookmark(bookmark.id, e)}
								class="absolute top-2 right-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all"
								title="Remove bookmark"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M3 6h18"/>
									<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
									<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
								</svg>
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</main>
	
	<Footer />
</div>
