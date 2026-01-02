<script lang="ts">
	import { onMount } from 'svelte';
	import { GenreService } from '$lib/services/genreService';
	import { AdminService, type CreateGenreDto, type UpdateGenreDto } from '$lib/services/adminService';
	import type { Genre } from '$lib/types/novel';

	let genres: Genre[] = $state([]);
	let loading = $state(true);
	let showModal = $state(false);
	let editingGenre: Genre | null = $state(null);
	let saving = $state(false);
	let error = $state('');

	let title = $state('');
	let description = $state('');

	async function loadGenres() {
		loading = true;
		try {
			const response = await GenreService.fetchGenres();
			genres = response.data || [];
		} catch (err) {
			console.error('Failed to load genres:', err);
		} finally {
			loading = false;
		}
	}

	function openCreate() {
		editingGenre = null;
		title = '';
		description = '';
		error = '';
		showModal = true;
	}

	function openEdit(genre: Genre) {
		editingGenre = genre;
		title = genre.title;
		description = genre.description;
		error = '';
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingGenre = null;
	}

	async function handleSubmit() {
		saving = true;
		error = '';
		try {
			if (editingGenre) {
				const data: UpdateGenreDto = { title, description };
				await AdminService.updateGenre(editingGenre.id, data);
			} else {
				const data: CreateGenreDto = { title, description };
				await AdminService.createGenre(data);
			}
			closeModal();
			await loadGenres();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save';
		} finally {
			saving = false;
		}
	}

	async function handleDelete(genre: Genre) {
		if (!confirm(`Delete "${genre.title}"?`)) return;
		try {
			await AdminService.deleteGenre(genre.id);
			await loadGenres();
		} catch (err) {
			alert('Failed to delete genre');
		}
	}

	onMount(loadGenres);
</script>

<svelte:head>
	<title>Manage Genres - Admin Panel</title>
</svelte:head>

<div class="p-6 sm:p-8">
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold text-foreground">Genres</h1>
			<p class="text-muted-foreground text-sm">Manage genre categories</p>
		</div>
		<button onclick={openCreate} class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
			Add Genre
		</button>
	</div>

	{#if loading}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each Array(6) as _}
				<div class="h-24 bg-card border border-border rounded-xl animate-pulse"></div>
			{/each}
		</div>
	{:else if genres.length === 0}
		<div class="text-center py-12 bg-card border border-border rounded-xl">
			<p class="text-muted-foreground">No genres yet</p>
		</div>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each genres as genre (genre.id)}
				<div class="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
					<div class="flex items-start justify-between gap-3">
						<div class="flex-1 min-w-0">
							<h3 class="font-semibold text-foreground">{genre.title}</h3>
							<p class="text-sm text-muted-foreground line-clamp-2 mt-1">{genre.description || 'No description'}</p>
						</div>
						<div class="flex items-center gap-1">
							<button onclick={() => openEdit(genre)} class="p-2 hover:bg-muted rounded-lg transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
							</button>
							<button onclick={() => handleDelete(genre)} class="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-400"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Modal -->
{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
		<div class="w-full max-w-md bg-card border border-border rounded-2xl p-6">
			<h2 class="text-xl font-bold text-foreground mb-4">{editingGenre ? 'Edit Genre' : 'Create Genre'}</h2>

			{#if error}
				<div class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-foreground mb-1">Title</label>
					<input bind:value={title} required class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Fantasy, Romance..." />
				</div>
				<div>
					<label class="block text-sm font-medium text-foreground mb-1">Description</label>
					<textarea bind:value={description} rows="3" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Brief description..."></textarea>
				</div>
				<div class="flex gap-3 pt-4">
					<button type="button" onclick={closeModal} class="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors">Cancel</button>
					<button type="submit" disabled={saving} class="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors">
						{saving ? 'Saving...' : editingGenre ? 'Update' : 'Create'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
