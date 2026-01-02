<script lang="ts">
	import { onMount } from 'svelte';
	import type { Novel } from '$lib/types/novel';
	import { NovelService } from '$lib/services/novelService';
	import { AuthService } from '$lib/services/authService';
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import logoWeb from '$lib/assets/logo_web.png';

	interface HeaderProps {
		novelCount: number;
	}

	let { novelCount }: HeaderProps = $props();
	
	let userMenuOpen = $state(false);

	// Check auth status on mount
	onMount(async () => {
		// Only check if we have a token
		if (!AuthService.isAuthenticated()) {
			authStore.clearUser();
			return;
		}
		
		try {
			const response = await AuthService.getMe();
			authStore.setUser(response.data);
		} catch (err) {
			authStore.clearUser();
		}
	});

	async function handleLogout() {
		await AuthService.logout();
		authStore.clearUser();
		userMenuOpen = false;
		goto('/');
	}
	
	// Mobile menu state
	let mobileMenuOpen = $state(false);
	let mobileSearchOpen = $state(false);
	
	// Search state
	let searchQuery = $state('');
	let searchResults: Novel[] = $state([]);
	let isSearching = $state(false);
	let showDropdown = $state(false);
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
		if (mobileMenuOpen) mobileSearchOpen = false;
	}

	function toggleMobileSearch() {
		mobileSearchOpen = !mobileSearchOpen;
		if (mobileSearchOpen) mobileMenuOpen = false;
	}

	function debounceSearch(query: string) {
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}
		
		if (query.length < 2) {
			searchResults = [];
			showDropdown = false;
			return;
		}

		isSearching = true;
		showDropdown = true;
		
		searchTimeout = setTimeout(async () => {
			try {
				const response = await NovelService.searchNovels(query);
				searchResults = response.data.slice(0, 5);
			} catch (error) {
				console.error('Search error:', error);
				searchResults = [];
			} finally {
				isSearching = false;
			}
		}, 300);
	}

	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;
		debounceSearch(searchQuery);
	}

	function handleResultClick(novelId: string) {
		showDropdown = false;
		searchQuery = '';
		searchResults = [];
		mobileSearchOpen = false;
		mobileMenuOpen = false;
		goto(`/view/${novelId}`);
	}

	function handleSearchBlur() {
		setTimeout(() => {
			showDropdown = false;
		}, 200);
	}

	function handleSearchFocus() {
		if (searchQuery.length >= 2 && searchResults.length > 0) {
			showDropdown = true;
		}
	}
</script>

<header class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
	<div class="container mx-auto px-4">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2 sm:gap-3">
				<img src={logoWeb} alt="Wign Realm" class="h-9 sm:h-10 w-auto" />
				<h1 class="font-sans text-lg sm:text-xl font-bold text-foreground">Wign Realm</h1>
			</a>
			
			<!-- Desktop Navigation -->
			<nav class="hidden lg:flex items-center gap-8">
				<a href="/" class="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Home</a>
				<a href="/" class="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Novels</a>
			</nav>
			
			<!-- Desktop Search & Actions -->
			<div class="hidden md:flex items-center gap-3">
				<!-- Search Bar -->
				<div class="relative">
					<input 
						type="text" 
						placeholder="Search novels..." 
						value={searchQuery}
						oninput={handleSearchInput}
						onfocus={handleSearchFocus}
						onblur={handleSearchBlur}
						class="w-48 lg:w-64 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
					/>
					<div class="absolute right-3 top-1/2 -translate-y-1/2">
						{#if isSearching}
							<svg class="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
								<circle cx="11" cy="11" r="8"></circle>
								<path d="m21 21-4.3-4.3"></path>
							</svg>
						{/if}
					</div>
					
					<!-- Search Results Dropdown -->
					{#if showDropdown}
						<div class="absolute top-full left-0 right-0 mt-2 rounded-lg border border-border bg-card shadow-xl overflow-hidden z-50">
							{#if isSearching}
								<div class="p-4 text-center text-muted-foreground text-sm">Searching...</div>
							{:else if searchResults.length === 0}
								<div class="p-4 text-center text-muted-foreground text-sm">No results found</div>
							{:else}
								<ul>
									{#each searchResults as novel (novel.id)}
										<li>
											<button
												type="button"
												onclick={() => handleResultClick(novel.id)}
												class="w-full flex items-center gap-3 p-3 text-left hover:bg-primary/10 transition-colors border-b border-border last:border-b-0"
											>
												<img src="{novel.cover}?w=80&q=75" alt={novel.title} class="w-10 h-14 object-cover rounded" />
												<div class="flex-1 min-w-0">
													<p class="text-sm font-medium text-foreground truncate">{novel.title}</p>
													<p class="text-xs text-muted-foreground truncate">{novel.author}</p>
												</div>
											</button>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					{/if}
				</div>
				
				<!-- Auth Section -->
				{#if $authStore.isAuthenticated && $authStore.user}
					<div class="relative">
						<button 
							onclick={() => userMenuOpen = !userMenuOpen}
							class="flex items-center gap-2 rounded-lg bg-card border border-border px-3 py-2 hover:bg-primary/10 transition-colors"
						>
							<div class="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
								<span class="text-xs font-bold text-primary">{$authStore.user?.username?.charAt(0)?.toUpperCase() || 'U'}</span>
							</div>
							<span class="text-sm font-medium text-foreground hidden lg:block">{$authStore.user?.username || 'User'}</span>
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>
						</button>
						
						{#if userMenuOpen && $authStore.user}
							<div class="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card shadow-xl z-50">
								<div class="p-3 border-b border-border">
									<p class="text-sm font-medium text-foreground">{$authStore.user?.username || 'User'}</p>
									<p class="text-xs text-muted-foreground">{$authStore.user?.email || ''}</p>
								</div>
								{#if $authStore.user?.role === 'Admin'}
									<a href="/admin" class="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
										Admin Panel
									</a>
								{/if}
								<a href="/bookmarks" class="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
									My Bookmarks
								</a>
								<button 
									onclick={handleLogout}
									class="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
									Logout
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<a href="/auth/login" class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors shadow-sm">
						Login
					</a>
				{/if}
			</div>
			
			<!-- Mobile Actions -->
			<div class="flex md:hidden items-center gap-2">
				<!-- Mobile Search Button -->
				<button 
					onclick={toggleMobileSearch}
					class="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card hover:bg-primary/10 transition-colors"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-foreground">
						<circle cx="11" cy="11" r="8"></circle>
						<path d="m21 21-4.3-4.3"></path>
					</svg>
				</button>
				
				<!-- Mobile Menu Button -->
				<button 
					onclick={toggleMobileMenu}
					class="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card hover:bg-primary/10 transition-colors"
				>
					{#if mobileMenuOpen}
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-foreground">
							<path d="M18 6 6 18"></path>
							<path d="m6 6 12 12"></path>
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-foreground">
							<line x1="4" x2="20" y1="12" y2="12"></line>
							<line x1="4" x2="20" y1="6" y2="6"></line>
							<line x1="4" x2="20" y1="18" y2="18"></line>
						</svg>
					{/if}
				</button>
			</div>
		</div>
		
		<!-- Mobile Search Panel -->
		{#if mobileSearchOpen}
			<div class="md:hidden py-4 border-t border-border">
				<div class="relative">
					<input 
						type="text" 
						placeholder="Search novels..." 
						value={searchQuery}
						oninput={handleSearchInput}
						onfocus={handleSearchFocus}
						onblur={handleSearchBlur}
						class="w-full rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
					/>
					
					{#if showDropdown}
						<div class="absolute top-full left-0 right-0 mt-2 rounded-lg border border-border bg-card shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
							{#if isSearching}
								<div class="p-4 text-center text-muted-foreground">Searching...</div>
							{:else if searchResults.length === 0}
								<div class="p-4 text-center text-muted-foreground">No results found</div>
							{:else}
								<ul>
									{#each searchResults as novel (novel.id)}
										<li>
											<button
												type="button"
												onclick={() => handleResultClick(novel.id)}
												class="w-full flex items-center gap-3 p-4 text-left hover:bg-primary/10 transition-colors border-b border-border last:border-b-0"
											>
												<img src="{novel.cover}?w=80&q=75" alt={novel.title} class="w-12 h-16 object-cover rounded" />
												<div class="flex-1 min-w-0">
													<p class="font-medium text-foreground truncate">{novel.title}</p>
													<p class="text-sm text-muted-foreground truncate">{novel.author}</p>
												</div>
											</button>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		{/if}
		
		<!-- Mobile Menu Panel -->
		{#if mobileMenuOpen}
			<div class="md:hidden py-4 border-t border-border">
				<nav class="flex flex-col gap-2">
					<a href="/" class="px-4 py-3 text-base font-medium text-foreground hover:bg-primary/10 rounded-lg transition-colors">Home</a>
					<a href="/" class="px-4 py-3 text-base font-medium text-foreground hover:bg-primary/10 rounded-lg transition-colors">Novels</a>
				</nav>
				<div class="mt-4 pt-4 border-t border-border">
					<a href="/auth/login" class="block w-full text-center rounded-lg bg-primary px-4 py-3 font-medium text-white hover:bg-primary-hover transition-colors">
						Login
					</a>
				</div>
			</div>
		{/if}
	</div>
</header>
