<script lang="ts">
	import type { Novel } from '$lib/types/novel';
	import UserIcon from './icons/UserIcon.svelte';
	import CalendarIcon from './icons/CalendarIcon.svelte';

	interface NovelCardProps {
		novel: Novel;
	}

	let { novel }: NovelCardProps = $props();
</script>

<article class="group overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
	<!-- Cover Image -->
	<div class="relative aspect-3/4 overflow-hidden bg-slate-200">
		<img
			src={novel.cover}
			alt={novel.title}
			class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
			loading="lazy"
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

	<!-- Content -->
	<div class="p-4">
		<h3 class="line-clamp-2 text-lg font-bold text-slate-900 group-hover:text-blue-600">
			{novel.title}
		</h3>
		
		<div class="mt-2 flex items-center gap-2 text-sm text-slate-600">
			<UserIcon />
			<span class="truncate">{novel.author}</span>
		</div>

		<p class="mt-3 line-clamp-3 text-sm text-slate-600">
			{novel.description}
		</p>

		<div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
			<div class="flex items-center gap-1 text-xs text-slate-500">
				<CalendarIcon />
				<span>{novel.release_date}</span>
			</div>
			<button
				class="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Read More
			</button>
		</div>
	</div>
</article>
