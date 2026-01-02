<article class="flex gap-3 overflow-hidden rounded-lg bg-card border border-border p-3 animate-pulse">
	<!-- Cover placeholder -->
	<div class="w-20 h-28 rounded-md bg-muted flex-shrink-0"></div>
	
	<!-- Content placeholder -->
	<div class="flex flex-1 flex-col justify-between min-w-0">
		<div class="h-4 bg-muted rounded w-3/4 mb-3"></div>
		
		<div class="space-y-2">
			<div class="flex justify-between">
				<div class="h-3 bg-muted rounded w-20"></div>
				<div class="h-3 bg-muted rounded w-16"></div>
			</div>
			<div class="flex justify-between">
				<div class="h-3 bg-muted rounded w-20"></div>
				<div class="h-3 bg-muted rounded w-16"></div>
			</div>
			<div class="flex justify-between">
				<div class="h-3 bg-muted rounded w-20"></div>
				<div class="h-3 bg-muted rounded w-16"></div>
			</div>
		</div>
	</div>
</article>

<style>
	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}
	
	.animate-shimmer {
		animation: shimmer 2s infinite;
	}
</style>
