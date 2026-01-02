<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { AuthService } from '$lib/services/authService';
	import { authStore } from '$lib/stores/authStore';
	import logoWeb from '$lib/assets/logo_web.png';

	let { children } = $props();

	let sidebarOpen = $state(true);

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: 'dashboard' },
		{ href: '/admin/novels', label: 'Novels', icon: 'book' },
		{ href: '/admin/chapters', label: 'Chapters', icon: 'file' },
		{ href: '/admin/genres', label: 'Genres', icon: 'tag' },
	];

	async function checkAuth() {
		try {
			const response = await AuthService.getMe();
			if (response.data.role !== 'Admin') {
				goto('/');
			}
			authStore.setUser(response.data);
		} catch {
			goto('/auth/login');
		}
	}

	async function handleLogout() {
		await AuthService.logout();
		authStore.clearUser();
		goto('/auth/login');
	}

	onMount(() => {
		checkAuth();
	});

	function isActive(href: string): boolean {
		return $page.url.pathname === href;
	}
</script>

<div class="min-h-screen bg-background flex">
	<!-- Sidebar -->
	<aside class="w-64 bg-card border-r border-border flex flex-col {sidebarOpen ? '' : 'hidden lg:flex'}">
		<!-- Logo -->
		<div class="p-4 border-b border-border">
			<a href="/admin" class="flex items-center gap-3">
				<img src={logoWeb} alt="Wign Realm" class="h-10 w-auto" />
				<div>
					<span class="font-bold text-foreground">Admin Panel</span>
					<p class="text-xs text-muted-foreground">Wign Realm</p>
				</div>
			</a>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 p-4 space-y-1">
			{#each navItems as item}
				<a
					href={item.href}
					class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors {isActive(item.href) ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
				>
					{#if item.icon === 'dashboard'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect width="7" height="9" x="3" y="3" rx="1"></rect>
							<rect width="7" height="5" x="14" y="3" rx="1"></rect>
							<rect width="7" height="9" x="14" y="12" rx="1"></rect>
							<rect width="7" height="5" x="3" y="16" rx="1"></rect>
						</svg>
					{:else if item.icon === 'book'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
						</svg>
					{:else if item.icon === 'file'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
							<path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
						</svg>
					{:else if item.icon === 'tag'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path>
							<circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>
						</svg>
					{/if}
					{item.label}
				</a>
			{/each}
		</nav>

		<!-- User & Logout -->
		<div class="p-4 border-t border-border">
			<div class="flex items-center gap-3 mb-3">
				<div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
						<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
						<circle cx="12" cy="7" r="4"></circle>
					</svg>
				</div>
				<div class="flex-1 min-w-0">
					{#if $authStore.user}
						<p class="text-sm font-medium text-foreground truncate">{$authStore.user.username}</p>
						<p class="text-xs text-muted-foreground">{$authStore.user.role}</p>
					{/if}
				</div>
			</div>
			<button
				onclick={handleLogout}
				class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
					<polyline points="16 17 21 12 16 7"></polyline>
					<line x1="21" x2="9" y1="12" y2="12"></line>
				</svg>
				Logout
			</button>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 overflow-auto">
		{@render children()}
	</main>
</div>
