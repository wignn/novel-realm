<script lang="ts">
	import { onMount } from 'svelte';
	import { NovelService } from '$lib/services/novelService';
	import { AdminService, type CreateNovelDto, type UpdateNovelDto } from '$lib/services/adminService';
	import type { Novel } from '$lib/types/novel';

	let novels: Novel[] = $state([]);
	let loading = $state(true);
	let showModal = $state(false);
	let editingNovel: Novel | null = $state(null);
	let saving = $state(false);
	let error = $state('');

	// Form fields
	let title = $state('');
	let author = $state('');
	let cover = $state('');
	let description = $state('');
	let status = $state('Ongoing');
	let language = $state('ID');
	let release_date = $state(new Date().getFullYear());
	let popular = $state(false);

	async function loadNovels() {
		loading = true;
		try {
			const response = await NovelService.fetchNovels(1);
			novels = response.data;
		} catch (err) {
			console.error('Failed to load novels:', err);
		} finally {
			loading = false;
		}
	}

	function openCreate() {
		editingNovel = null;
		resetForm();
		showModal = true;
	}

	function openEdit(novel: Novel) {
		editingNovel = novel;
		title = novel.title;
		author = novel.author;
		cover = novel.cover;
		description = novel.description;
		status = novel.status;
		language = novel.language;
		release_date = novel.release_date;
		popular = novel.popular;
		showModal = true;
	}

	function resetForm() {
		title = '';
		author = '';
		cover = '';
		description = '';
		status = 'Ongoing';
		language = 'ID';
		release_date = new Date().getFullYear();
		popular = false;
		error = '';
	}

	function closeModal() {
		showModal = false;
		editingNovel = null;
		resetForm();
	}

	async function handleSubmit() {
		saving = true;
		error = '';
		try {
			if (editingNovel) {
				const data: UpdateNovelDto = { title, author, cover, description, status, language, release_date, popular };
				await AdminService.updateNovel(editingNovel.id, data);
			} else {
				const data: CreateNovelDto = { title, author, cover, description, status, language, release_date, popular };
				await AdminService.createNovel(data);
			}
			closeModal();
			await loadNovels();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save';
		} finally {
			saving = false;
		}
	}

	async function handleDelete(novel: Novel) {
		if (!confirm(`Delete "${novel.title}"?`)) return;
		try {
			await AdminService.deleteNovel(novel.id);
			await loadNovels();
		} catch (err) {
			alert('Failed to delete novel');
		}
	}

	onMount(loadNovels);
</script>

<svelte:head>
	<title>Manage Novels - Admin Panel</title>
</svelte:head>

<div class="p-6 sm:p-8">
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold text-foreground">Novels</h1>
			<p class="text-muted-foreground text-sm">Manage your novel collection</p>
		</div>
		<button
			onclick={openCreate}
			class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
			Add Novel
		</button>
	</div>

	{#if loading}
		<div class="space-y-3">
			{#each Array(5) as _}
				<div class="h-20 bg-card border border-border rounded-lg animate-pulse"></div>
			{/each}
		</div>
	{:else if novels.length === 0}
		<div class="text-center py-12 bg-card border border-border rounded-xl">
			<p class="text-muted-foreground">No novels yet</p>
		</div>
	{:else}
		<div class="bg-card border border-border rounded-xl overflow-hidden">
			<table class="w-full">
				<thead class="bg-muted/50 border-b border-border">
					<tr>
						<th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Novel</th>
						<th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">Status</th>
						<th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Language</th>
						<th class="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each novels as novel (novel.id)}
						<tr class="hover:bg-muted/30">
							<td class="px-4 py-3">
								<div class="flex items-center gap-3">
									<img src="{novel.cover}?w=60&q=75" alt="" class="w-10 h-14 object-cover rounded" />
									<div>
										<p class="font-medium text-foreground text-sm">{novel.title}</p>
										<p class="text-xs text-muted-foreground">{novel.author}</p>
									</div>
								</div>
							</td>
							<td class="px-4 py-3 hidden sm:table-cell">
								<span class="px-2 py-1 text-xs rounded-full {novel.status === 'Ongoing' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}">
									{novel.status}
								</span>
							</td>
							<td class="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{novel.language}</td>
							<td class="px-4 py-3 text-right">
								<div class="flex items-center justify-end gap-2">
									<button onclick={() => openEdit(novel)} class="p-2 hover:bg-muted rounded-lg transition-colors" title="Edit">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
									</button>
									<button onclick={() => handleDelete(novel)} class="p-2 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-400"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<!-- Modal -->
{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
		<div class="w-full max-w-lg bg-card border border-border rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
			<h2 class="text-xl font-bold text-foreground mb-4">{editingNovel ? 'Edit Novel' : 'Create Novel'}</h2>

			{#if error}
				<div class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-foreground mb-1">Title</label>
					<input bind:value={title} required class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
				</div>
				<div>
					<label class="block text-sm font-medium text-foreground mb-1">Author</label>
					<input bind:value={author} required class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
				</div>
				<div>
					<label class="block text-sm font-medium text-foreground mb-1">Cover URL</label>
					<input bind:value={cover} required class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
				</div>
				<div>
					<label class="block text-sm font-medium text-foreground mb-1">Description</label>
					<textarea bind:value={description} rows="3" class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"></textarea>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-foreground mb-1">Status</label>
						<select bind:value={status} class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
							<option>Ongoing</option>
							<option>Completed</option>
							<option>Hiatus</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium text-foreground mb-1">Language</label>
						<select bind:value={language} class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
							<option value="ID">Indonesian</option>
							<option value="EN">English</option>
							<option value="JP">Japanese</option>
							<option value="KR">Korean</option>
							<option value="CN">Chinese</option>
						</select>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-foreground mb-1">Release Year</label>
						<input type="number" bind:value={release_date} class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
					</div>
					<div class="flex items-center pt-6">
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" bind:checked={popular} class="w-4 h-4 rounded border-border" />
							<span class="text-sm text-foreground">Mark as Popular</span>
						</label>
					</div>
				</div>
				<div class="flex gap-3 pt-4">
					<button type="button" onclick={closeModal} class="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors">Cancel</button>
					<button type="submit" disabled={saving} class="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors">
						{saving ? 'Saving...' : editingNovel ? 'Update' : 'Create'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
