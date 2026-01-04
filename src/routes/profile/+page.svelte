<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { AuthService, type User } from '$lib/services/authService';
	import { authStore } from '$lib/stores/authStore';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { PUBLIC_API_URL, PUBLIC_API_KEY } from '$env/static/public';

	let loading = $state(true);
	let saving = $state(false);
	let uploadingAvatar = $state(false);
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);

	// Form fields
	let username = $state('');
	let bio = $state('');
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let passwordError = $state<string | null>(null);
	let passwordSuccess = $state<string | null>(null);
	let changingPassword = $state(false);

	// Avatar
	let avatarUrl = $state<string | null>(null);
	let fileInput: HTMLInputElement;

	onMount(async () => {
		if (!AuthService.isAuthenticated()) {
			goto('/auth/login');
			return;
		}

		try {
			const response = await AuthService.getMe();
			authStore.setUser(response.data);
			username = response.data.username || '';
			bio = response.data.bio || '';
			avatarUrl = response.data.profile_pic || null;
		} catch (err) {
			error = 'Failed to load profile';
			authStore.clearUser();
			goto('/auth/login');
		} finally {
			loading = false;
		}
	});

	async function handleSaveProfile() {
		saving = true;
		error = null;
		success = null;

		try {
			const response = await AuthService.fetchWithAuth(`${PUBLIC_API_URL}/api/auth/profile`, {
				method: 'PUT',
				body: JSON.stringify({
					username: username || null,
					bio: bio || null
				})
			});

			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				throw new Error(data.error || 'Failed to update profile');
			}

			// Refresh user data
			const meResponse = await AuthService.getMe();
			authStore.setUser(meResponse.data);
			success = 'Profile updated successfully!';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to update profile';
		} finally {
			saving = false;
		}
	}

	async function handleChangePassword() {
		passwordError = null;
		passwordSuccess = null;

		if (newPassword !== confirmPassword) {
			passwordError = 'Passwords do not match';
			return;
		}

		if (newPassword.length < 6) {
			passwordError = 'Password must be at least 6 characters';
			return;
		}

		changingPassword = true;

		try {
			const response = await AuthService.fetchWithAuth(`${PUBLIC_API_URL}/api/auth/password`, {
				method: 'PUT',
				body: JSON.stringify({
					current_password: currentPassword,
					new_password: newPassword
				})
			});

			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				throw new Error(data.error || 'Invalid current password');
			}

			passwordSuccess = 'Password changed successfully!';
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
		} catch (err) {
			passwordError = err instanceof Error ? err.message : 'Failed to change password';
		} finally {
			changingPassword = false;
		}
	}

	function triggerFileInput() {
		fileInput?.click();
	}

	async function handleAvatarUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			error = 'Please select an image file';
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			error = 'Image must be less than 5MB';
			return;
		}

		uploadingAvatar = true;
		error = null;

		try {
			const formData = new FormData();
			formData.append('avatar', file);

			const token = AuthService.getToken();
			const response = await fetch(`${PUBLIC_API_URL}/api/auth/avatar`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'x-api-key': PUBLIC_API_KEY
				},
				body: formData
			});

			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				throw new Error(data.error || 'Failed to upload avatar');
			}

			const result = await response.json();
			avatarUrl = result.data?.profile_pic || result.profile_pic;

			// Refresh user data
			const meResponse = await AuthService.getMe();
			authStore.setUser(meResponse.data);
			avatarUrl = meResponse.data.profile_pic || null;
			
			success = 'Profile photo updated!';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to upload avatar';
		} finally {
			uploadingAvatar = false;
		}
	}

	function getInitial(name: string | undefined): string {
		return name?.charAt(0)?.toUpperCase() || 'U';
	}
</script>

<svelte:head>
	<title>Edit Profile - Wign Realm</title>
	<meta name="description" content="Edit your profile settings" />
</svelte:head>

<div class="min-h-screen bg-background flex flex-col">
	<Header novelCount={0} />

	<main class="flex-1 py-8 lg:py-12">
		<div class="container mx-auto px-4 max-w-2xl">
			{#if loading}
				<div class="flex items-center justify-center py-20">
					<div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
				</div>
			{:else}
				<!-- Page Header -->
				<div class="mb-8">
					<h1 class="text-2xl lg:text-3xl font-bold text-foreground">Edit Profile</h1>
					<p class="mt-2 text-muted-foreground">Update your profile information and settings</p>
				</div>

				<!-- Avatar Section -->
				<div class="bg-card border border-border rounded-xl p-6 mb-6">
					<h2 class="text-lg font-semibold text-foreground mb-4">Profile Photo</h2>
					
					<div class="flex items-center gap-6">
						<div class="relative group">
							<div class="h-24 w-24 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center ring-4 ring-primary/30">
								{#if avatarUrl}
									<img 
										src={avatarUrl} 
										alt="Profile" 
										class="h-full w-full object-cover"
									/>
								{:else}
									<span class="text-3xl font-bold text-primary">{getInitial($authStore.user?.username)}</span>
								{/if}
							</div>
							
							<!-- Upload overlay -->
							<button
								onclick={triggerFileInput}
								disabled={uploadingAvatar}
								class="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer disabled:cursor-wait"
							>
								{#if uploadingAvatar}
									<div class="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
								{:else}
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
										<circle cx="12" cy="13" r="4"/>
									</svg>
								{/if}
							</button>
						</div>

						<div class="flex-1">
							<p class="text-sm text-foreground font-medium">Change your photo</p>
							<p class="text-sm text-muted-foreground mt-1">JPG, PNG or GIF. Max 5MB.</p>
							<button
								onclick={triggerFileInput}
								disabled={uploadingAvatar}
								class="mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
							>
								{uploadingAvatar ? 'Uploading...' : 'Upload new photo'}
							</button>
						</div>
					</div>

					<input
						bind:this={fileInput}
						type="file"
						accept="image/*"
						onchange={handleAvatarUpload}
						class="hidden"
					/>
				</div>

				<!-- Success/Error Messages -->
				{#if success}
					<div class="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
						{success}
					</div>
				{/if}

				{#if error}
					<div class="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
						{error}
					</div>
				{/if}

				<!-- Profile Info Section -->
				<div class="bg-card border border-border rounded-xl p-6 mb-6">
					<h2 class="text-lg font-semibold text-foreground mb-4">Profile Information</h2>
					
					<form onsubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} class="space-y-4">
						<div>
							<label for="username" class="block text-sm font-medium text-foreground mb-2">Username</label>
							<input
								id="username"
								type="text"
								bind:value={username}
								class="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
								placeholder="Your username"
							/>
						</div>

						<div>
							<label for="email" class="block text-sm font-medium text-foreground mb-2">Email</label>
							<input
								id="email"
								type="email"
								value={$authStore.user?.email || ''}
								disabled
								class="w-full rounded-lg border border-border bg-muted px-4 py-3 text-muted-foreground cursor-not-allowed"
							/>
							<p class="mt-1 text-xs text-muted-foreground">Email cannot be changed</p>
						</div>

						<div>
							<label for="bio" class="block text-sm font-medium text-foreground mb-2">Bio</label>
							<textarea
								id="bio"
								bind:value={bio}
								rows={3}
								class="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
								placeholder="Tell us about yourself..."
							></textarea>
						</div>

						<div class="pt-2">
							<button
								type="submit"
								disabled={saving}
								class="w-full sm:w-auto rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								{#if saving}
									<div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
									Saving...
								{:else}
									Save Changes
								{/if}
							</button>
						</div>
					</form>
				</div>

				<!-- Change Password Section -->
				<div class="bg-card border border-border rounded-xl p-6">
					<h2 class="text-lg font-semibold text-foreground mb-4">Change Password</h2>

					{#if passwordSuccess}
						<div class="mb-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
							{passwordSuccess}
						</div>
					{/if}

					{#if passwordError}
						<div class="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
							{passwordError}
						</div>
					{/if}
					
					<form onsubmit={(e) => { e.preventDefault(); handleChangePassword(); }} class="space-y-4">
						<div>
							<label for="currentPassword" class="block text-sm font-medium text-foreground mb-2">Current Password</label>
							<input
								id="currentPassword"
								type="password"
								bind:value={currentPassword}
								class="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
								placeholder="Enter current password"
							/>
						</div>

						<div>
							<label for="newPassword" class="block text-sm font-medium text-foreground mb-2">New Password</label>
							<input
								id="newPassword"
								type="password"
								bind:value={newPassword}
								class="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
								placeholder="Enter new password"
							/>
						</div>

						<div>
							<label for="confirmPassword" class="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
							<input
								id="confirmPassword"
								type="password"
								bind:value={confirmPassword}
								class="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
								placeholder="Confirm new password"
							/>
						</div>

						<div class="pt-2">
							<button
								type="submit"
								disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
								class="w-full sm:w-auto rounded-lg bg-card border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								{#if changingPassword}
									<div class="animate-spin h-4 w-4 border-2 border-foreground border-t-transparent rounded-full"></div>
									Changing...
								{:else}
									Change Password
								{/if}
							</button>
						</div>
					</form>
				</div>
			{/if}
		</div>
	</main>

	<Footer />
</div>
