<script lang="ts">
	import { BookmarkService } from '$lib/services/bookmarkService';
	import { AuthService } from '$lib/services/authService';
	import { onMount } from 'svelte';

	interface Props {
		bookId: string;
		size?: 'sm' | 'md' | 'lg';
		showText?: boolean;
	}

	let { bookId, size = 'md', showText = false }: Props = $props();

	let isBookmarked = $state(false);
	let bookmarkId = $state<string | null>(null);
	let loading = $state(false);
	let isAuthenticated = $state(false);

	const sizeClasses = {
		sm: 'p-1.5',
		md: 'p-2',
		lg: 'p-3'
	};

	const iconSizes = {
		sm: 16,
		md: 20,
		lg: 24
	};

	onMount(async () => {
		isAuthenticated = AuthService.isAuthenticated();
		if (isAuthenticated) {
			try {
				const status = await BookmarkService.checkBookmark(bookId);
				isBookmarked = status.is_bookmarked;
				bookmarkId = status.bookmark_id;
			} catch (err) {
				console.error('Failed to check bookmark status:', err);
			}
		}
	});

	async function handleToggle() {
		if (!isAuthenticated) {
			// Redirect to login
			window.location.href = '/auth/login';
			return;
		}

		loading = true;
		try {
			const result = await BookmarkService.toggleBookmark(bookId);
			isBookmarked = result.isBookmarked;
			bookmarkId = result.bookmarkId;
		} catch (err) {
			console.error('Failed to toggle bookmark:', err);
		} finally {
			loading = false;
		}
	}
</script>

<button
	type="button"
	onclick={handleToggle}
	disabled={loading}
	class="
		inline-flex items-center gap-2 rounded-lg transition-all duration-200
		{sizeClasses[size]}
		{isBookmarked 
			? 'bg-primary/20 text-primary hover:bg-primary/30' 
			: 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'}
		disabled:opacity-50 disabled:cursor-not-allowed
	"
	title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
>
	{#if loading}
		<svg 
			class="animate-spin" 
			width={iconSizes[size]} 
			height={iconSizes[size]} 
			viewBox="0 0 24 24" 
			fill="none" 
			stroke="currentColor" 
			stroke-width="2"
		>
			<path d="M21 12a9 9 0 1 1-6.219-8.56"/>
		</svg>
	{:else if isBookmarked}
		<!-- Filled bookmark icon -->
		<svg 
			width={iconSizes[size]} 
			height={iconSizes[size]} 
			viewBox="0 0 24 24" 
			fill="currentColor"
			stroke="currentColor" 
			stroke-width="2" 
			stroke-linecap="round" 
			stroke-linejoin="round"
		>
			<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
		</svg>
	{:else}
		<!-- Outline bookmark icon -->
		<svg 
			width={iconSizes[size]} 
			height={iconSizes[size]} 
			viewBox="0 0 24 24" 
			fill="none" 
			stroke="currentColor" 
			stroke-width="2" 
			stroke-linecap="round" 
			stroke-linejoin="round"
		>
			<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
		</svg>
	{/if}
	
	{#if showText}
		<span class="text-sm font-medium">
			{isBookmarked ? 'Bookmarked' : 'Bookmark'}
		</span>
	{/if}
</button>
