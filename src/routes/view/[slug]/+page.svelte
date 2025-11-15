<script lang="ts">
	import { page } from '$app/stores';
	import { NovelService } from '$lib/services/novelService';
	import type { Novel, Chapter } from '$lib/types/novel';
	import { goto } from '$app/navigation';
	import NovelDetailSkeleton from '$lib/components/NovelDetailSkeleton.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import ChapterList from '$lib/components/ChapterList.svelte';
	import UserIcon from '$lib/components/icons/UserIcon.svelte';
	import CalendarIcon from '$lib/components/icons/CalendarIcon.svelte';
	import BookIcon from '$lib/components/icons/BookIcon.svelte';

	let novel: Novel | null = $state(null);
	let chapters: Chapter[] = $state([]);
	let loading: boolean = $state(true);
	let loadingChapters: boolean = $state(true);
	let error: string | null = $state(null);

	async function fetchNovel(slug: string) {
		loading = true;
		error = null;
		try {
			const data = await NovelService.fetchNovelById(slug);
			novel = data.data;
			
			// Fetch chapters after getting novel data
			await fetchChapters(slug);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}
	
	async function fetchChapters(slug: string) {
		loadingChapters = true;
		try {
			const data = await NovelService.fetchChaptersByNovelId(slug);
			chapters = data.data || [];
		} catch (err) {
			console.error('Failed to fetch chapters:', err);
			chapters = [];
		} finally {
			loadingChapters = false;
		}
	}

	function handleRetry() {
		const slug = $page.params.slug;
		if (slug) {
			fetchNovel(slug);
		}
	}

	function handleBack() {
		goto('/');
	}

	$effect(() => {
		const slug = $page.params.slug;
		if (slug) {
			fetchNovel(slug);
		}
	});
</script>

<svelte:head>
	<title>{novel ? `${novel.title} - Novel Detail` : 'Loading...'}</title>
	<meta name="description" content={novel?.description || 'Novel detail page'} />
	{#if novel}
		<link rel="preload" as="image" href={novel.cover} fetchpriority="high" />
	{/if}
</svelte:head>

<div class="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
	{#if loading}
		<NovelDetailSkeleton />
	{:else if error}
		<div class="container mx-auto px-4 py-8">
			<ErrorMessage message={error} onRetry={handleRetry} />
		</div>
	{:else if novel}
		<div class="relative overflow-hidden bg-white">
			<div class="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<button
					onclick={handleBack}
					class="mb-6 flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-400"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						></path>
					</svg>
					<span>Back to Home</span>
				</button>

				<div class="grid gap-8 lg:grid-cols-[350px_1fr]">
					<div class="lg:sticky lg:top-8 lg:self-start">
						<div class="overflow-hidden rounded-2xl border-2 border-slate-200 shadow-2xl">
							<img
								src={novel.cover}
								alt={novel.title}
								class="w-full object-cover"
								loading="eager"
								fetchpriority="high"
							/>
						</div>
					</div>

					<div class="space-y-6">
						<div>
							<h1 class="mb-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
								{novel.title}
							</h1>

							<div class="flex flex-wrap items-center gap-3">
								<span class="flex items-center gap-2 rounded-full bg-blue-100 border border-blue-200 px-4 py-1.5 text-sm font-semibold text-blue-700">
									<span class="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
									{novel.status}
								</span>
								<span class="rounded-full bg-slate-100 border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700">
									{novel.language}
								</span>
								{#if novel.popular}
									<span class="flex items-center gap-1.5 rounded-full bg-orange-100 border border-orange-200 px-4 py-1.5 text-sm font-semibold text-orange-700">
										<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										Popular
									</span>
								{/if}
							</div>
						</div>

						<div class="grid gap-4 sm:grid-cols-3">
							<div class="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
								<div class="flex items-center gap-3">
									<div class="rounded-lg bg-blue-100 p-2">
										<UserIcon />
									</div>
									<div>
										<p class="text-xs text-slate-500">Author</p>
										<p class="font-semibold text-slate-900">{novel.author}</p>
									</div>
								</div>
							</div>

							<div class="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
								<div class="flex items-center gap-3">
									<div class="rounded-lg bg-blue-100 p-2">
										<CalendarIcon />
									</div>
									<div>
										<p class="text-xs text-slate-500">Release Year</p>
										<p class="font-semibold text-slate-900">{novel.release_date}</p>
									</div>
								</div>
							</div>

							<div class="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
								<div class="flex items-center gap-3">
									<div class="rounded-lg bg-blue-100 p-2">
										<BookIcon />
									</div>
									<div>
										<p class="text-xs text-slate-500">Chapters</p>
										<p class="font-semibold text-slate-900">{loadingChapters ? '...' : chapters.length}</p>
									</div>
								</div>
							</div>
						</div>

						<!-- Description -->
						<div class="rounded-2xl bg-white border border-slate-200 p-6 shadow-lg">
							<p class="mb-3 whitespace-pre-line leading-relaxed text-slate-700">
								{novel.description}
							</p>
							
							<!-- Action Buttons -->
							<div class="mt-6 flex flex-wrap gap-3">
								{#if novel.asset}
									<a
										href={novel.asset}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
									>
										<BookIcon />
										Read Now
									</a>
								{:else}
									<button
										disabled
										class="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-slate-200 px-6 py-3 font-semibold text-slate-400"
									>
										<BookIcon />
										Not Available
									</button>
								{/if}
							</div>
						</div>

						<div class="grid gap-4 sm:grid-cols-2">
							<div class="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
								<h3 class="mb-1 text-sm font-semibold text-slate-600">Created</h3>
								<p class="text-slate-900">
									{new Date(novel.created_at).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</p>
							</div>
							<div class="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
								<h3 class="mb-1 text-sm font-semibold text-slate-600">Last Updated</h3>
								<p class="text-slate-900">
									{new Date(novel.updated_at).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="bg-linear-to-br from-slate-50 to-slate-100 py-12">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{#if loadingChapters}
					<div class="rounded-2xl bg-white border border-slate-200 p-8 shadow-lg">
						<div class="animate-pulse space-y-6">
							<div class="flex items-center gap-4">
								<div class="h-12 w-12 rounded-lg bg-slate-200"></div>
								<div class="space-y-2">
									<div class="h-6 w-48 rounded bg-slate-200"></div>
									<div class="h-4 w-32 rounded bg-slate-200"></div>
								</div>
							</div>
							<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
								{#each Array(10) as _}
									<div class="h-28 rounded-xl bg-slate-100"></div>
								{/each}
							</div>
						</div>
					</div>
				{:else}
					<ChapterList chapters={chapters} novelTitle={novel.title} />
				{/if}
			</div>
		</div>
	{/if}
</div>
