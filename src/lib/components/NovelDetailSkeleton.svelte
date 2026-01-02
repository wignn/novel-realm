<!-- Skeleton for Novel Detail page - does NOT include Header (parent handles it) -->
<div class="relative">
	<!-- Skeleton Background -->
	<div class="absolute inset-0 h-[300px] sm:h-[350px] lg:h-[400px] bg-muted/30"></div>
	
	<div class="relative container mx-auto px-4 sm:px-6 py-6 sm:py-8">
		<div class="mb-4 sm:mb-6 h-10 w-32 sm:w-40 animate-pulse rounded-lg bg-muted"></div>

		<div class="grid gap-6 lg:gap-8 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
			<!-- Cover -->
			<div class="flex justify-center lg:justify-start">
				<div class="w-48 sm:w-56 lg:w-full aspect-[2/3] animate-pulse rounded-xl bg-muted border border-border"></div>
			</div>

			<div class="space-y-4 sm:space-y-6">
				<!-- Title & Badges -->
				<div class="text-center lg:text-left space-y-3">
					<div class="h-8 sm:h-10 w-3/4 mx-auto lg:mx-0 animate-pulse rounded bg-muted"></div>
					<div class="flex flex-wrap justify-center lg:justify-start gap-2">
						<div class="h-7 w-20 animate-pulse rounded-full bg-muted"></div>
						<div class="h-7 w-16 animate-pulse rounded-full bg-muted"></div>
					</div>
				</div>

				<!-- Stats Cards -->
				<div class="grid grid-cols-3 gap-2 sm:gap-4">
					<div class="h-16 sm:h-20 animate-pulse rounded-xl bg-card border border-border"></div>
					<div class="h-16 sm:h-20 animate-pulse rounded-xl bg-card border border-border"></div>
					<div class="h-16 sm:h-20 animate-pulse rounded-xl bg-card border border-border"></div>
				</div>

				<!-- Description Card -->
				<div class="animate-pulse rounded-xl bg-card border border-border p-4 sm:p-6">
					<div class="h-5 w-24 rounded bg-muted mb-4"></div>
					<div class="space-y-2">
						<div class="h-3 w-full rounded bg-muted"></div>
						<div class="h-3 w-full rounded bg-muted"></div>
						<div class="h-3 w-3/4 rounded bg-muted"></div>
					</div>
					<div class="mt-6 flex gap-3">
						<div class="h-10 sm:h-12 w-28 sm:w-32 rounded-lg bg-muted"></div>
						<div class="h-10 sm:h-12 w-28 sm:w-32 rounded-lg bg-muted"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Chapters skeleton -->
<div class="py-8 sm:py-12">
	<div class="container mx-auto px-4 sm:px-6">
		<div class="rounded-xl sm:rounded-2xl bg-card border border-border p-4 sm:p-8 shadow-lg">
			<div class="animate-pulse">
				<!-- Header -->
				<div class="flex items-center gap-3 sm:gap-4 mb-6">
					<div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-muted"></div>
					<div class="space-y-2">
						<div class="h-5 sm:h-6 w-32 sm:w-48 rounded bg-muted"></div>
						<div class="h-3 sm:h-4 w-20 sm:w-32 rounded bg-muted"></div>
					</div>
				</div>
				
				<!-- Chapter Grid -->
				<div class="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{#each Array(6) as _}
						<div class="flex gap-3 p-3 rounded-lg bg-muted/50 border border-border">
							<div class="h-12 w-12 rounded bg-muted flex-shrink-0"></div>
							<div class="flex-1 space-y-2">
								<div class="h-4 w-3/4 rounded bg-muted"></div>
								<div class="h-3 w-1/2 rounded bg-muted"></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
