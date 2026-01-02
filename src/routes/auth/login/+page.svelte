<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { AuthService } from '$lib/services/authService';
	import { authStore } from '$lib/stores/authStore';
	import logoWeb from '$lib/assets/logo_web.png';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	// Redirect if already logged in
	onMount(async () => {
		if (!AuthService.isAuthenticated()) return;
		
		try {
			const response = await AuthService.getMe();
			authStore.setUser(response.data);
			if (response.data.role === 'Admin') {
				goto('/admin');
			} else {
				goto('/');
			}
		} catch (err) {
			// Token invalid, ignore
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			const response = await AuthService.login({ email, password });
			authStore.setUser(response.data);
			
			// Redirect to admin if admin, otherwise home
			if (response.data.role === 'Admin') {
				goto('/admin');
			} else {
				goto('/');
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Login failed';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Login - Wign Realm</title>
</svelte:head>

<div class="min-h-screen bg-background flex items-center justify-center px-4">
	<div class="w-full max-w-md">
		<!-- Logo -->
		<div class="text-center mb-8">
			<a href="/" class="inline-flex items-center gap-3">
				<img src={logoWeb} alt="Wign Realm" class="h-12 w-auto" />
				<span class="text-2xl font-bold text-foreground">Wign Realm</span>
			</a>
		</div>

		<!-- Login Card -->
		<div class="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
			<h1 class="text-xl sm:text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
			<p class="text-sm text-muted-foreground mb-6">Sign in to your account</p>

			{#if error}
				<div class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
					{error}
				</div>
			{/if}

			<form onsubmit={handleSubmit} class="space-y-4">
				<div>
					<label for="email" class="block text-sm font-medium text-foreground mb-1.5">Email</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						required
						class="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
						placeholder="you@example.com"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-foreground mb-1.5">Password</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						required
						class="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
						placeholder="••••••••"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full py-3 px-4 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{#if loading}
						<span class="inline-flex items-center gap-2">
							<svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Signing in...
						</span>
					{:else}
						Sign In
					{/if}
				</button>
			</form>

			<div class="mt-6 text-center space-y-3">
				<p class="text-sm text-muted-foreground">
					Don't have an account? 
					<a href="/auth/register" class="text-primary hover:underline font-medium">Create one</a>
				</p>
				<a href="/" class="text-sm text-muted-foreground hover:text-primary transition-colors block">
					← Back to Home
				</a>
			</div>
		</div>
	</div>
</div>
