<script lang="ts">
	import BookIcon from './icons/BookIcon.svelte';

	interface HeaderProps {
		novelCount: number;
	}

	let { novelCount }: HeaderProps = $props();
</script>

<header class="bg-white shadow-sm border-b border-slate-200">
	<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-slate-900">Wign Novel</h1>
				<p class="mt-1 text-sm text-slate-600">Discover amazing stories from around the world</p>
			</div>
			<div class="hidden sm:block">
				<div class="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
					<BookIcon />
					<span class="text-sm font-medium text-slate-700">
						{novelCount} Novels
					</span>
				</div>
			</div>
		</div>
	</div>
</header>
