<script lang="ts">
	import { page } from '$app/stores';
	import { NovelService } from '$lib/services/novelService';
	import type { Novel, Chapter, Genre } from '$lib/types/novel';
	import { goto } from '$app/navigation';
	import NovelDetailSkeleton from '$lib/components/NovelDetailSkeleton.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import ChapterList from '$lib/components/ChapterList.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import UserIcon from '$lib/components/icons/UserIcon.svelte';
	import CalendarIcon from '$lib/components/icons/CalendarIcon.svelte';
	import BookIcon from '$lib/components/icons/BookIcon.svelte';
	import BookmarkButton from '$lib/components/BookmarkButton.svelte';

	let novel: Novel | null = $state(null);
	let chapters: Chapter[] = $state([]);
	let genres: Genre[] = $state([]);
	let loading: boolean = $state(true);
	let loadingChapters: boolean = $state(true);
	let error: string | null = $state(null);

	async function fetchNovel(slug: string) {
		loading = true;
		error = null;
		try {
			const data = await NovelService.fetchNovelById(slug);
			novel = data.data;
			await Promise.all([fetchChapters(slug), fetchGenres(slug)]);
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

	async function fetchGenres(slug: string) {
		try {
			const data = await NovelService.fetchGenresByBook(slug);
			genres = data.data || [];
		} catch (err) {
			console.error('Failed to fetch genres:', err);
			genres = [];
		}
	}

	function handleRetry() {
		const slug = $page.params.slug;
		if (slug) fetchNovel(slug);
	}

	function handleBack() {
		goto('/');
	}

	$effect(() => {
		const slug = $page.params.slug;
		if (slug) fetchNovel(slug);
	});
</script>

<svelte:head>
	<title>{novel ? `${novel.title} - Wign Realm` : 'Loading...'}</title>
	<meta name="description" content={novel?.description || 'Novel detail page'} />
	{#if novel}
		<link rel="preload" as="image" href={novel.cover} fetchpriority="high" />
	{/if}
</svelte:head>

<div class="min-h-screen bg-background">
	<Header novelCount={0} />
	
	{#if loading}
		<NovelDetailSkeleton />
	{:else if error}
		<div class="container mx-auto px-4 py-8">
			<ErrorMessage message={error} onRetry={handleRetry} />
		</div>
	{:else if novel}
		<!-- Hero Section -->
		<div class="relative">
			<!-- Background Image Overlay -->
			<div class="absolute inset-0 h-[300px] sm:h-[350px] lg:h-[400px] overflow-hidden">
				<img 
					src={novel.cover} 
					alt=""
					class="absolute inset-0 w-full h-full object-cover opacity-15 blur-2xl scale-110"
				/>
				<div class="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"></div>
			</div>
			
			<div class="relative container mx-auto px-4 sm:px-6 py-6 sm:py-8">
				<!-- Back Button -->
				<button
					onclick={handleBack}
					class="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card/80 backdrop-blur-sm px-3 sm:px-4 py-2 text-sm text-foreground transition-all hover:bg-card hover:border-primary/50"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
					</svg>
					<span class="hidden sm:inline">Back to Home</span>
					<span class="sm:hidden">Back</span>
				</button>

				<!-- Main Content Grid -->
				<div class="grid gap-6 lg:gap-8 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
					<!-- Cover Image -->
					<div class="flex justify-center lg:justify-start lg:sticky lg:top-24 lg:self-start">
						<div class="w-48 sm:w-56 lg:w-full overflow-hidden rounded-xl border-2 border-border shadow-2xl shadow-primary/10">
							<img
								src={novel.cover}
								alt={novel.title}
								class="w-full object-cover"
								loading="eager"
								fetchpriority="high"
							/>
						</div>
					</div>

					<!-- Novel Info -->
					<div class="space-y-4 sm:space-y-6">
						<!-- Title & Badges -->
						<div class="text-center lg:text-left">
							<h1 class="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-foreground">
								{novel.title}
							</h1>

							<div class="flex flex-wrap justify-center lg:justify-start items-center gap-2">
								<span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs sm:text-sm font-semibold text-primary">
									<span class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
									{novel.status}
								</span>
								<span class="rounded-full bg-muted border border-border px-3 py-1 text-xs sm:text-sm font-medium text-foreground">
									{novel.language}
								</span>
								{#if novel.popular}
									<span class="inline-flex items-center gap-1 rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-xs sm:text-sm font-semibold text-orange-500">
										<svg class="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										Popular
									</span>
								{/if}
							</div>
							
							<!-- Genres -->
							{#if genres.length > 0}
								<div class="flex flex-wrap justify-center lg:justify-start gap-1.5 mt-3">
									{#each genres as genre (genre.id)}
										<a 
											href="/novels?genres={genre.title.toLowerCase()}"
											class="rounded-full bg-card border border-border px-2.5 py-0.5 text-xs font-medium text-foreground/80 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors"
										>
											{genre.title}
										</a>
									{/each}
								</div>
							{/if}
						</div>

						<!-- Stats Cards -->
						<div class="grid grid-cols-3 gap-2 sm:gap-4">
							<div class="rounded-xl bg-card border border-border p-3 sm:p-4">
								<div class="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-3">
									<div class="rounded-lg bg-primary/10 p-2">
										<UserIcon class="h-4 w-4 sm:h-5 sm:w-5" />
									</div>
									<div class="text-center sm:text-left">
										<p class="text-[10px] sm:text-xs text-muted-foreground">Author</p>
										<p class="text-xs sm:text-sm font-semibold text-foreground truncate">{novel.author}</p>
									</div>
								</div>
							</div>

							<div class="rounded-xl bg-card border border-border p-3 sm:p-4">
								<div class="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-3">
									<div class="rounded-lg bg-primary/10 p-2">
										<CalendarIcon class="h-4 w-4 sm:h-5 sm:w-5" />
									</div>
									<div class="text-center sm:text-left">
										<p class="text-[10px] sm:text-xs text-muted-foreground">Year</p>
										<p class="text-xs sm:text-sm font-semibold text-foreground">{novel.release_date || 'N/A'}</p>
									</div>
								</div>
							</div>

							<div class="rounded-xl bg-card border border-border p-3 sm:p-4">
								<div class="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-3">
									<div class="rounded-lg bg-primary/10 p-2">
										<BookIcon class="h-4 w-4 sm:h-5 sm:w-5" />
									</div>
									<div class="text-center sm:text-left">
										<p class="text-[10px] sm:text-xs text-muted-foreground">Chapters</p>
										<p class="text-xs sm:text-sm font-semibold text-foreground">{loadingChapters ? '...' : chapters.length}</p>
									</div>
								</div>
							</div>
						</div>

						<!-- Description -->
						<div class="rounded-xl bg-card border border-border p-4 sm:p-6">
							<h2 class="mb-2 sm:mb-3 text-base sm:text-lg font-semibold text-foreground">Synopsis</h2>
							<p class="text-sm sm:text-base whitespace-pre-line leading-relaxed text-muted-foreground">
								{novel.description}
							</p>
							
							<!-- Action Buttons -->
							<div class="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
								{#if novel.asset}
									<a
										href={novel.asset}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20"
									>
										<BookIcon class="h-4 w-4 sm:h-5 sm:w-5" />
										Read Now
									</a>
								{:else}
									<button
										disabled
										class="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-muted px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-muted-foreground"
									>
										<BookIcon class="h-4 w-4 sm:h-5 sm:w-5" />
										Not Available
									</button>
								{/if}
								
								<!-- Bookmark Button -->
								<BookmarkButton bookId={novel.id} size="md" showText={true} />
							</div>
						</div>

						<!-- Date Info (Desktop only) -->
						<div class="hidden sm:grid grid-cols-2 gap-4">
							<div class="rounded-xl bg-card border border-border p-4">
								<h3 class="mb-1 text-xs sm:text-sm font-semibold text-muted-foreground">Created</h3>
								<p class="text-sm text-foreground">
									{new Date(novel.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
								</p>
							</div>
							<div class="rounded-xl bg-card border border-border p-4">
								<h3 class="mb-1 text-xs sm:text-sm font-semibold text-muted-foreground">Last Updated</h3>
								<p class="text-sm text-foreground">
									{new Date(novel.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Chapters Section -->
		<div class="py-8 sm:py-12 ">
			<div class="container mx-auto px-4 sm:px-6">
				{#if loadingChapters}
					<div class="rounded-xl bg-card border border-border p-4 sm:p-8">
						<div class="animate-pulse space-y-4 sm:space-y-6">
							<div class="flex items-center gap-3 sm:gap-4">
								<div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-muted"></div>
								<div class="space-y-2">
									<div class="h-5 sm:h-6 w-32 sm:w-48 rounded bg-muted"></div>
									<div class="h-3 sm:h-4 w-24 sm:w-32 rounded bg-muted"></div>
									
								</div>
							</div>
							<div class="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
								{#each Array(10) as _}
									<div class="h-20 sm:h-28 rounded-xl bg-muted"></div>
								{/each}
							</div>
						</div>
					</div>
				{:else}
					<ChapterList chapters={chapters} novelTitle={novel.title} novelId={novel.id} />
				{/if}
			</div>
		</div>
	{/if}
	
	<Footer />
</div>
