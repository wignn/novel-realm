import type { Novel } from '$lib/types/novel';

export interface UseNovelsState {
	novels: Novel[];
	loading: boolean;
	error: string | null;
	currentPage: number;
	totalPages: number;
}

export interface UseNovelsActions {
	fetchNovels: (page?: number) => Promise<void>;
	changePage: (page: number) => void;
	retry: () => void;
}
