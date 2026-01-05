<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { NovelService } from '$lib/services/novelService';
	import { AdminService, type CreateChapterDto, type UpdateChapterDto } from '$lib/services/adminService';
	import type { Novel, Chapter } from '$lib/types/novel';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';

	let novels: Novel[] = $state([]);
	let chapters: Chapter[] = $state([]);
	let selectedNovelId = $state('');
	let loading = $state(true);
	let showModal = $state(false);
	let editingChapter: Chapter | null = $state(null);
	let saving = $state(false);
	let error = $state('');
	let hasDraft = $state(false);

	// Form
	let title = $state('');
	let book_id = $state('');
	let description = $state('');
	let content = $state('');
	let chapter_num = $state(1);
	
	// Editor key for forcing re-render
	let editorKey = $state(0);

	const DRAFT_KEY = 'chapter_draft';

	// Auto-save draft to localStorage
	function saveDraft() {
		if (!browser) return;
		const draft = {
			title,
			description,
			content,
			chapter_num,
			book_id,
			editingId: editingChapter?.id || null,
			timestamp: Date.now()
		};
		localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
	}

	// Load draft from localStorage
	function loadDraft(): boolean {
		if (!browser) return false;
		const saved = localStorage.getItem(DRAFT_KEY);
		if (!saved) return false;
		
		try {
			const draft = JSON.parse(saved);
			// Only restore if draft is less than 24 hours old
			if (Date.now() - draft.timestamp > 24 * 60 * 60 * 1000) {
				clearDraft();
				return false;
			}
			return true;
		} catch {
			return false;
		}
	}

	function restoreDraft() {
		if (!browser) return;
		const saved = localStorage.getItem(DRAFT_KEY);
		if (!saved) return;
		
		try {
			const draft = JSON.parse(saved);
			title = draft.title || '';
			description = draft.description || '';
			content = draft.content || '';
			chapter_num = draft.chapter_num || 1;
			book_id = draft.book_id || selectedNovelId;
			editorKey++;
			showModal = true;
			hasDraft = false;
		} catch {
			clearDraft();
		}
	}

	function clearDraft() {
		if (!browser) return;
		localStorage.removeItem(DRAFT_KEY);
		hasDraft = false;
	}

	async function loadNovels() {
		const response = await NovelService.fetchNovels(1);
		novels = response.data;
		if (novels.length > 0 && !selectedNovelId) {
			selectedNovelId = novels[0].id;
		}
	}

	async function loadChapters() {
		if (!selectedNovelId) return;
		loading = true;
		try {
			const response = await NovelService.fetchChaptersByNovelId(selectedNovelId);
			chapters = response.data?.sort((a, b) => a.chapter_num - b.chapter_num) || [];
		} catch (err) {
			console.error('Failed to load chapters:', err);
			chapters = [];
		} finally {
			loading = false;
		}
	}

	function openCreate() {
		editingChapter = null;
		book_id = selectedNovelId;
		title = '';
		description = '';
		content = '';
		chapter_num = chapters.length > 0 ? Math.max(...chapters.map(c => c.chapter_num)) + 1 : 1;
		error = '';
		editorKey++;
		showModal = true;
	}

	function openEdit(chapter: Chapter) {
		editingChapter = chapter;
		book_id = chapter.book_id;
		title = chapter.title;
		description = chapter.description;
		content = chapter.content || '';
		chapter_num = chapter.chapter_num;
		error = '';
		editorKey++;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingChapter = null;
		clearDraft(); // Clear draft when closing
	}

	function handleContentUpdate(html: string) {
		content = html;
		saveDraft(); // Auto-save on content change
	}

	// Also save draft when other fields change
	$effect(() => {
		if (showModal && (title || description)) {
			saveDraft();
		}
	});

	async function handleSubmit() {
		saving = true;
		error = '';
		try {
			if (editingChapter) {
				const data: UpdateChapterDto = { title, description, content, chapter_num };
				await AdminService.updateChapter(editingChapter.id, data);
			} else {
				const data: CreateChapterDto = { title, book_id, description, content, chapter_num };
				await AdminService.createChapter(data);
			}
			clearDraft(); // Clear draft on successful save
			closeModal();
			await loadChapters();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save';
		} finally {
			saving = false;
		}
	}

	async function handleDelete(chapter: Chapter) {
		if (!confirm(`Delete Chapter ${chapter.chapter_num}?`)) return;
		try {
			await AdminService.deleteChapter(chapter.id);
			await loadChapters();
		} catch (err) {
			alert('Failed to delete chapter');
		}
	}

	onMount(async () => {
		await loadNovels();
		await loadChapters();
		// Check for saved draft
		hasDraft = loadDraft();
	});

	$effect(() => {
		if (selectedNovelId) loadChapters();
	});
</script>

<svelte:head>
	<title>Manage Chapters - Admin Panel</title>
</svelte:head>

<div class="p-6 sm:p-8">
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
		<div>
			<h1 class="text-2xl font-bold text-foreground">Chapters</h1>
			<p class="text-muted-foreground text-sm">Manage chapters for your novels</p>
		</div>
		<button onclick={openCreate} disabled={!selectedNovelId} class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors">
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
			Add Chapter
		</button>
	</div>

	<!-- Draft Recovery Banner -->
	{#if hasDraft}
		<div class="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
			<div class="flex items-center gap-3">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400 flex-shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9.5 15.5 12 18l2.5-2.5"/></svg>
				<div>
					<p class="text-sm font-medium text-amber-400">Unsaved draft found</p>
					<p class="text-xs text-muted-foreground">You have an unsaved chapter draft. Would you like to continue editing?</p>
				</div>
			</div>
			<div class="flex items-center gap-2 flex-shrink-0">
				<button onclick={clearDraft} class="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
					Discard
				</button>
				<button onclick={restoreDraft} class="px-3 py-1.5 text-sm bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors font-medium">
					Restore Draft
				</button>
			</div>
		</div>
	{/if}

	<!-- Novel Selector -->
	<div class="mb-6">
		<label class="block text-sm font-medium text-foreground mb-2">Select Novel</label>
		<select bind:value={selectedNovelId} class="w-full sm:w-80 px-4 py-2.5 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
			{#each novels as novel (novel.id)}
				<option value={novel.id}>{novel.title}</option>
			{/each}
		</select>
	</div>

	{#if loading}
		<div class="space-y-3">
			{#each Array(5) as _}
				<div class="h-16 bg-card border border-border rounded-lg animate-pulse"></div>
			{/each}
		</div>
	{:else if chapters.length === 0}
		<div class="text-center py-12 bg-card border border-border rounded-xl">
			<p class="text-muted-foreground">No chapters yet</p>
		</div>
	{:else}
		<div class="bg-card border border-border rounded-xl overflow-hidden">
			<table class="w-full">
				<thead class="bg-muted/50 border-b border-border">
					<tr>
						<th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase w-16">#</th>
						<th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Title</th>
						<th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">Date</th>
						<th class="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each chapters as chapter (chapter.id)}
						<tr class="hover:bg-muted/30">
							<td class="px-4 py-3 text-lg font-bold text-primary">{chapter.chapter_num}</td>
							<td class="px-4 py-3">
								<p class="font-medium text-foreground text-sm">{chapter.title}</p>
								<p class="text-xs text-muted-foreground line-clamp-1">{chapter.description || 'No description'}</p>
							</td>
							<td class="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
								{new Date(chapter.created_at).toLocaleDateString()}
							</td>
							<td class="px-4 py-3 text-right">
								<div class="flex items-center justify-end gap-2">
									<button onclick={() => openEdit(chapter)} class="p-2 hover:bg-muted rounded-lg transition-colors" title="Edit">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
									</button>
									<button onclick={() => handleDelete(chapter)} class="p-2 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
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
	<div class="fixed inset-0 z-50 overflow-y-auto bg-black/60">
		<div class="min-h-full flex items-start justify-center p-4 py-8">
		<div class="w-full max-w-4xl bg-card border border-border rounded-2xl p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-bold text-foreground">{editingChapter ? 'Edit Chapter' : 'Create Chapter'}</h2>
				<button onclick={closeModal} class="p-2 hover:bg-muted rounded-lg transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
				</button>
			</div>

			{#if error}
				<div class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
			{/if}

			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div>
						<label class="block text-sm font-medium text-foreground mb-1">Chapter Number</label>
						<input type="number" bind:value={chapter_num} required class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
					</div>
					<div class="sm:col-span-2">
						<label class="block text-sm font-medium text-foreground mb-1">Title</label>
						<input bind:value={title} required class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Chapter title" />
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium text-foreground mb-1">Description (optional)</label>
					<input bind:value={description} class="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Brief description of this chapter" />
				</div>
				<div>
					<label class="block text-sm font-medium text-foreground mb-2">Content</label>
					{#key editorKey}
						<RichTextEditor 
							content={content} 
							placeholder="Start writing your chapter content..."
							bookId={book_id}
							onUpdate={handleContentUpdate}
						/>
					{/key}
				</div>
				<div class="flex gap-3 pt-4">
					<button type="button" onclick={closeModal} class="flex-1 px-4 py-2.5 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors">Cancel</button>
					<button type="submit" disabled={saving} class="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors">
						{saving ? 'Saving...' : editingChapter ? 'Update Chapter' : 'Create Chapter'}
					</button>
				</div>
			</form>
		</div>
		</div>
	</div>
{/if}
