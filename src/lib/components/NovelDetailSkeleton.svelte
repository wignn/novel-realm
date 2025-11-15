<div class="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
	<div class="relative overflow-hidden bg-white border-b border-slate-200">
		<div class="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="mb-6 h-10 w-40 animate-pulse rounded-lg bg-slate-200"></div>

			<div class="grid gap-8 lg:grid-cols-[350px_1fr]">
				<div class="lg:sticky lg:top-8 lg:self-start">
					<div class="aspect-2/3 w-full animate-pulse rounded-2xl bg-slate-200"></div>
				</div>

				<div class="space-y-6">
					<div class="space-y-4">
						<div class="h-12 w-3/4 animate-pulse rounded bg-slate-200"></div>
						<div class="h-12 w-1/2 animate-pulse rounded bg-slate-200"></div>
					</div>

					<div class="flex flex-wrap gap-3">
						<div class="h-8 w-24 animate-pulse rounded-full bg-slate-100"></div>
						<div class="h-8 w-28 animate-pulse rounded-full bg-slate-100"></div>
						<div class="h-8 w-24 animate-pulse rounded-full bg-slate-100"></div>
					</div>

					<div class="grid gap-4 sm:grid-cols-3">
						<div class="h-20 animate-pulse rounded-xl bg-slate-100 border border-slate-200"></div>
						<div class="h-20 animate-pulse rounded-xl bg-slate-100 border border-slate-200"></div>
						<div class="h-20 animate-pulse rounded-xl bg-slate-100 border border-slate-200"></div>
					</div>

					<div class="animate-pulse rounded-2xl bg-slate-50 border border-slate-200 p-6">
						<div class="space-y-3">
							<div class="h-4 w-full rounded bg-slate-200"></div>
							<div class="h-4 w-full rounded bg-slate-200"></div>
							<div class="h-4 w-full rounded bg-slate-200"></div>
							<div class="h-4 w-4/5 rounded bg-slate-200"></div>
							<div class="h-4 w-full rounded bg-slate-200"></div>
							<div class="h-4 w-3/5 rounded bg-slate-200"></div>
						</div>

						<div class="mt-6">
							<div class="h-12 w-32 rounded-lg bg-slate-200"></div>
						</div>
					</div>

					<div class="grid gap-4 sm:grid-cols-2">
						<div class="h-20 animate-pulse rounded-xl bg-slate-100 border border-slate-200"></div>
						<div class="h-20 animate-pulse rounded-xl bg-slate-100 border border-slate-200"></div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="bg-linear-to-br from-slate-50 to-slate-100 py-12">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
		</div>
	</div>
</div>
