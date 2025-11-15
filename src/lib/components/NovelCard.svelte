<script lang="ts">
	import type { Novel } from '$lib/types/novel';
	import UserIcon from './icons/UserIcon.svelte';
	import CalendarIcon from './icons/CalendarIcon.svelte';
	import { goto } from '$app/navigation';

	interface NovelCardProps {
		novel: Novel;
		priority?: boolean; }

	let { novel, priority = false }: NovelCardProps = $props();
	
	function getResponsiveImageUrl(url: string, width: number): string {

		return `${url}?w=${width}&q=75`;
	}

	function handleReadMore() {
		goto(`/view/${novel.id}`);
	}

	function handleCardClick(event: MouseEvent | KeyboardEvent) {
		if ((event.target as HTMLElement).tagName !== 'BUTTON') {
			goto(`/view/${novel.id}`);
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<article 
	class="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
	onclick={handleCardClick}
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && handleCardClick(e)}
>
	<div class="relative aspect-3/4 overflow-hidden bg-slate-200">
		<img
			src={getResponsiveImageUrl(novel.cover, 400)}
			srcset="{getResponsiveImageUrl(novel.cover, 300)} 300w, 
			        {getResponsiveImageUrl(novel.cover, 400)} 400w,
			        {getResponsiveImageUrl(novel.cover, 600)} 600w"
			sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
			alt={novel.title}
			class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
			loading={priority ? 'eager' : 'lazy'}
			fetchpriority={priority ? 'high' : 'auto'}
			decoding="async"
			width="400"
			height="533"
		/>
		<div class="absolute top-2 right-2 flex gap-2">
			{#if novel.popular}
				<span class="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white shadow-lg">
					Popular
				</span>
			{/if}
			<span class="rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
				{novel.language}
			</span>
		</div>
		<div class="absolute bottom-2 left-2">
			<span class="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-900 backdrop-blur-sm">
				{novel.status}
			</span>
		</div>
	</div>

	<div class="flex flex-1 flex-col p-4">
		<h3 class="line-clamp-2 min-h-14 text-lg font-bold leading-7 text-slate-900 group-hover:text-blue-600">
			{novel.title}
		</h3>
		
		<!-- Author -->
		<div class="mt-2 flex items-center gap-2 text-sm text-slate-600">
			<UserIcon />
			<span class="truncate">{novel.author}</span>
		</div>

		<p class="mt-3 line-clamp-3 min-h-15 text-sm leading-5 text-slate-600">
			{novel.description}
		</p>

		<div class="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
			<div class="flex items-center gap-1 text-xs text-slate-500">
				<CalendarIcon />
				<span>{novel.release_date}</span>
			</div>
			<button
				onclick={(e) => { e.stopPropagation(); handleReadMore(); }}
				class="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Read More
			</button>
		</div>
	</div>
</article>
