<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Placeholder from '@tiptap/extension-placeholder';
	import Underline from '@tiptap/extension-underline';
	import TextAlign from '@tiptap/extension-text-align';
	import { UploadService } from '$lib/services/uploadService';

	interface Props {
		content?: string;
		placeholder?: string;
		bookId?: string;
		onUpdate?: (html: string) => void;
	}

	let { content = '', placeholder = 'Start writing your chapter...', bookId = '', onUpdate }: Props = $props();

	let element: HTMLDivElement;
	let editor: Editor | null = $state(null);
	let showPreview = $state(false);
	let previewContent = $state('');
	let fileInput: HTMLInputElement;
	let uploading = $state(false);
	let uploadError = $state('');

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit.configure({
					heading: {
						levels: [1, 2, 3]
					}
				}),
				Placeholder.configure({
					placeholder
				}),
				Underline.configure({
					HTMLAttributes: {
						class: 'underline-text'
					}
				}),
				TextAlign.configure({
					types: ['heading', 'paragraph']
				})
			],
			content: content,
			editorProps: {
				attributes: {
					class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3'
				}
			},
			onUpdate: ({ editor }) => {
				const html = editor.getHTML();
				previewContent = html;
				if (onUpdate) {
					onUpdate(html);
				}
			}
		});

		previewContent = content;
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	function togglePreview() {
		showPreview = !showPreview;
	}

	// Toolbar actions
	function toggleBold() {
		editor?.chain().focus().toggleBold().run();
	}

	function toggleItalic() {
		editor?.chain().focus().toggleItalic().run();
	}

	function toggleUnderline() {
		editor?.chain().focus().toggleUnderline().run();
	}

	function toggleStrike() {
		editor?.chain().focus().toggleStrike().run();
	}

	function toggleHeading(level: 1 | 2 | 3) {
		editor?.chain().focus().toggleHeading({ level }).run();
	}

	function toggleBulletList() {
		editor?.chain().focus().toggleBulletList().run();
	}

	function toggleOrderedList() {
		editor?.chain().focus().toggleOrderedList().run();
	}

	function toggleBlockquote() {
		editor?.chain().focus().toggleBlockquote().run();
	}

	function setTextAlign(align: 'left' | 'center' | 'right' | 'justify') {
		editor?.chain().focus().setTextAlign(align).run();
	}

	function undo() {
		editor?.chain().focus().undo().run();
	}

	function redo() {
		editor?.chain().focus().redo().run();
	}

	function insertHorizontalRule() {
		editor?.chain().focus().setHorizontalRule().run();
	}

	// Check if format is active
	function isActive(name: string, attrs?: Record<string, unknown>): boolean {
		return editor?.isActive(name, attrs) ?? false;
	}

	// File import functions
	function triggerFileInput() {
		fileInput?.click();
	}

	async function handleFileImport(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		// Validate file type
		const validTypes = [
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'application/epub+zip'
		];
		const validExtensions = ['.docx', '.epub'];
		const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
		
		if (!validTypes.includes(file.type) && !hasValidExtension) {
			uploadError = 'Please select a DOCX or EPUB file';
			return;
		}

		uploading = true;
		uploadError = '';

		try {
			const response = await UploadService.uploadContent(file, bookId || undefined);
			
			// Insert the extracted HTML content into the editor
			if (editor && response.html_content) {
				editor.commands.setContent(response.html_content);
				previewContent = response.html_content;
				
				// Notify parent of content update
				if (onUpdate) {
					onUpdate(response.html_content);
				}
			}
		} catch (err) {
			uploadError = err instanceof Error ? err.message : 'Failed to import file';
		} finally {
			uploading = false;
			// Reset file input so same file can be selected again
			input.value = '';
		}
	}
</script>

<div class="rounded-xl border border-border bg-card overflow-hidden">
	<!-- Toolbar -->
	<div class="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
		<!-- History -->
		<div class="flex items-center gap-0.5 mr-2">
			<button type="button" onclick={undo} class="p-2 rounded hover:bg-muted transition-colors" title="Undo">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
			</button>
			<button type="button" onclick={redo} class="p-2 rounded hover:bg-muted transition-colors" title="Redo">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
			</button>
		</div>

		<div class="w-px h-6 bg-border mx-1"></div>

		<!-- Headings -->
		<div class="flex items-center gap-0.5 mr-2">
			<button type="button" onclick={() => toggleHeading(1)} class="px-2 py-1 rounded text-sm font-bold hover:bg-muted transition-colors {isActive('heading', { level: 1 }) ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}" title="Heading 1">H1</button>
			<button type="button" onclick={() => toggleHeading(2)} class="px-2 py-1 rounded text-sm font-bold hover:bg-muted transition-colors {isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}" title="Heading 2">H2</button>
			<button type="button" onclick={() => toggleHeading(3)} class="px-2 py-1 rounded text-sm font-bold hover:bg-muted transition-colors {isActive('heading', { level: 3 }) ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}" title="Heading 3">H3</button>
		</div>

		<div class="w-px h-6 bg-border mx-1"></div>

		<!-- Text Formatting -->
		<div class="flex items-center gap-0.5 mr-2">
			<button type="button" onclick={toggleBold} class="p-2 rounded hover:bg-muted transition-colors {isActive('bold') ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}" title="Bold">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
			</button>
			<button type="button" onclick={toggleItalic} class="p-2 rounded hover:bg-muted transition-colors {isActive('italic') ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}" title="Italic">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>
			</button>
			<button type="button" onclick={toggleUnderline} class="p-2 rounded hover:bg-muted transition-colors {isActive('underline') ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}" title="Underline">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/></svg>
			</button>
			<button type="button" onclick={toggleStrike} class="p-2 rounded hover:bg-muted transition-colors {isActive('strike') ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}" title="Strikethrough">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" x2="20" y1="12" y2="12"/></svg>
			</button>
		</div>

		<div class="w-px h-6 bg-border mx-1"></div>

		<!-- Alignment -->
		<div class="flex items-center gap-0.5 mr-2">
			<button type="button" onclick={() => setTextAlign('left')} class="p-2 rounded hover:bg-muted transition-colors {isActive({ textAlign: 'left' }) ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}" title="Align Left">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>
			</button>
			<button type="button" onclick={() => setTextAlign('center')} class="p-2 rounded hover:bg-muted transition-colors {isActive({ textAlign: 'center' }) ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}" title="Align Center">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="18" x2="6" y1="12" y2="12"/><line x1="21" x2="3" y1="18" y2="18"/></svg>
			</button>
			<button type="button" onclick={() => setTextAlign('right')} class="p-2 rounded hover:bg-muted transition-colors {isActive({ textAlign: 'right' }) ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}" title="Align Right">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="9" y1="12" y2="12"/><line x1="21" x2="7" y1="18" y2="18"/></svg>
			</button>
			<button type="button" onclick={() => setTextAlign('justify')} class="p-2 rounded hover:bg-muted transition-colors {isActive({ textAlign: 'justify' }) ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}" title="Justify">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="3" y1="12" y2="12"/><line x1="21" x2="3" y1="18" y2="18"/></svg>
			</button>
		</div>

		<div class="w-px h-6 bg-border mx-1"></div>

		<!-- Lists & Quote -->
		<div class="flex items-center gap-0.5 mr-2">
			<button type="button" onclick={toggleBulletList} class="p-2 rounded hover:bg-muted transition-colors {isActive('bulletList') ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}" title="Bullet List">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
			</button>
			<button type="button" onclick={toggleOrderedList} class="p-2 rounded hover:bg-muted transition-colors {isActive('orderedList') ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}" title="Numbered List">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
			</button>
			<button type="button" onclick={toggleBlockquote} class="p-2 rounded hover:bg-muted transition-colors {isActive('blockquote') ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}" title="Quote">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/></svg>
			</button>
			<button type="button" onclick={insertHorizontalRule} class="p-2 rounded hover:bg-muted transition-colors text-muted-foreground" title="Horizontal Line">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="12" y2="12"/></svg>
			</button>
		</div>

		<div class="flex-1"></div>

		<!-- Hidden file input -->
		<input 
			type="file" 
			accept=".docx,.epub,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/epub+zip"
			bind:this={fileInput}
			onchange={handleFileImport}
			class="hidden"
		/>

		<!-- Import Button -->
		<button 
			type="button" 
			onclick={triggerFileInput}
			disabled={uploading}
			class="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-50 mr-2"
			title="Import from Word or EPUB"
		>
			{#if uploading}
				<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
				Importing...
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
				Import
			{/if}
		</button>

		<!-- Preview Toggle -->
		<button 
			type="button" 
			onclick={togglePreview} 
			class="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors {showPreview ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground'}"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
			Preview
		</button>
	</div>

	<!-- Upload Error -->
	{#if uploadError}
		<div class="mx-2 mb-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
			<span>{uploadError}</span>
			<button type="button" onclick={() => uploadError = ''} class="text-red-400 hover:text-red-300" title="Dismiss error">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
			</button>
		</div>
	{/if}

	<!-- Editor / Preview -->
	<div class="relative">
		{#if showPreview}
			<!-- Preview Mode -->
			<div class="min-h-[300px] px-4 py-3 prose prose-invert max-w-none">
				{@html previewContent || '<p class="text-muted-foreground">Nothing to preview</p>'}
			</div>
		{:else}
			<!-- Editor Mode -->
			<div bind:this={element} class="min-h-[300px]"></div>
		{/if}
	</div>
</div>

<style>
	:global(.ProseMirror) {
		min-height: 300px;
		padding: 0.75rem 1rem;
		outline: none;
	}

	:global(.ProseMirror p.is-editor-empty:first-child::before) {
		color: #6b7280;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}

	:global(.ProseMirror h1) {
		font-size: 1.875rem;
		font-weight: 700;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
	}

	:global(.ProseMirror h2) {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 1.25rem;
		margin-bottom: 0.5rem;
	}

	:global(.ProseMirror h3) {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}

	:global(.ProseMirror p) {
		margin-bottom: 0.75rem;
	}

	:global(.ProseMirror ul),
	:global(.ProseMirror ol) {
		padding-left: 1.5rem;
		margin-bottom: 0.75rem;
	}

	:global(.ProseMirror blockquote) {
		border-left: 3px solid #dc2626;
		padding-left: 1rem;
		margin-left: 0;
		color: #9ca3af;
		font-style: italic;
	}

	:global(.ProseMirror hr) {
		border: none;
		border-top: 1px solid #374151;
		margin: 1.5rem 0;
	}
</style>
