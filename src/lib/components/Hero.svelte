<script lang="ts">
	import { fade, fly } from 'svelte/transition';
</script>

<section class="relative overflow-hidden py-20 sm:py-32">
	<!-- Background Effects -->
	<div class="absolute inset-0 -z-10">
		<div class="absolute inset-0 bg-dark"></div>
		<div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30">
			<div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px] animate-pulse"></div>
			<div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary blur-[120px] animate-pulse delay-1000"></div>
		</div>
		<!-- Grid Pattern -->
		<div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
	</div>

	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
		<div class="mx-auto max-w-2xl text-center">
			<div in:fly={{ y: 20, duration: 800, delay: 200 }}>
				<span class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 mb-6">
					Welcome to the Realm
				</span>
			</div>
			
			<h1 in:fly={{ y: 20, duration: 800, delay: 400 }} class="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
				Unleash Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Imagination</span>
			</h1>
			
			<p in:fly={{ y: 20, duration: 800, delay: 600 }} class="text-lg leading-8 text-slate-400 mb-10">
				Dive into a universe of endless stories. From epic fantasies to modern romances, discover your next obsession in our curated collection of premium novels.
			</p>
			
			<div in:fly={{ y: 20, duration: 800, delay: 800 }} class="flex items-center justify-center gap-x-6">
				<a href="/series" class="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-hover hover:-translate-y-0.5 transition-all duration-300">
					Start Reading
				</a>
				<a href="/library" class="text-sm font-semibold leading-6 text-white hover:text-primary transition-colors">
					Browse Library <span aria-hidden="true">→</span>
				</a>
				
			</div>
		</div>
	</div>
</section>
