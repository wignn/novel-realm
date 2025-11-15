<article class="overflow-hidden rounded-xl bg-white shadow-sm animate-pulse">
	<!-- Cover Image Skeleton -->
	<div class="relative aspect-3/4 overflow-hidden bg-slate-200">
		<div class="h-full w-full bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 bg-size-[200%_100%] animate-shimmer"></div>
		
		<!-- Badge skeletons -->
		<div class="absolute top-2 right-2 flex gap-2">
			<div class="h-6 w-16 rounded-full bg-slate-300"></div>
		</div>
		<div class="absolute bottom-2 left-2">
			<div class="h-6 w-20 rounded-full bg-slate-300"></div>
		</div>
	</div>

	<!-- Content Skeleton -->
	<div class="p-4 space-y-3">
		<!-- Title skeleton -->
		<div class="space-y-2">
			<div class="h-5 bg-slate-200 rounded w-full"></div>
			<div class="h-5 bg-slate-200 rounded w-3/4"></div>
		</div>
		
		<!-- Author skeleton -->
		<div class="flex items-center gap-2">
			<div class="h-4 w-4 bg-slate-200 rounded"></div>
			<div class="h-4 bg-slate-200 rounded w-1/2"></div>
		</div>

		<!-- Description skeleton -->
		<div class="space-y-2 pt-1">
			<div class="h-3 bg-slate-200 rounded w-full"></div>
			<div class="h-3 bg-slate-200 rounded w-full"></div>
			<div class="h-3 bg-slate-200 rounded w-2/3"></div>
		</div>

		<!-- Footer skeleton -->
		<div class="flex items-center justify-between border-t border-slate-100 pt-3">
			<div class="h-4 bg-slate-200 rounded w-24"></div>
			<div class="h-8 bg-slate-200 rounded w-20"></div>
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
