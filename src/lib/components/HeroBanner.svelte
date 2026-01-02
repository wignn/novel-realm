<script lang="ts">
	import type { Novel } from '$lib/types/novel';
	
	let { novel }: { novel: Novel } = $props();
</script>

<a href="/view/{novel.id}" class="group relative block w-full overflow-hidden">
	<!-- Background Image with Gradient -->
	<div class="relative h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full">
		<img 
			src={novel.cover} 
			alt={novel.title}
			class="absolute inset-0 w-full h-full object-cover opacity-30 transition-opacity duration-300 group-hover:opacity-40"
		/>
		<!-- Gradient Overlays -->
		<div class="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent"></div>
		<div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
		
		<!-- Content -->
		<div class="relative z-10 flex h-full items-center">
			<div class="container mx-auto px-4 sm:px-6">
				<div class="max-w-xl lg:max-w-2xl">
					<!-- Status Badge -->
					<div class="mb-3 sm:mb-4">
						<span class="inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-xs sm:text-sm font-medium text-primary">
							<span class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
							{novel.status}
						</span>
					</div>
					
					<!-- Title -->
					<h2 class="mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
						{novel.title}
					</h2>
					
					<!-- Author -->
					<p class="mb-3 sm:mb-4 text-sm sm:text-base text-muted-foreground">
						by <span class="text-foreground font-medium">{novel.author}</span>
					</p>
					
					<!-- Description -->
					<p class="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed">
						{novel.description}
					</p>
					
					<!-- Action Buttons -->
					<div class="flex flex-wrap gap-2 sm:gap-3">
						<button class="rounded-lg bg-primary px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30">
							Read Now
						</button>
						<button class="rounded-lg bg-card/80 backdrop-blur-sm px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-foreground hover:bg-card transition-all border border-border hover:border-primary/50">
							+ Add to Library
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</a>
