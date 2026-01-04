import type { NovelResponse, ChapterResponse, SingleChapterResponse, GenreResponse } from '$lib/types/novel';
import { PUBLIC_API_URL, PUBLIC_API_KEY } from '$env/static/public';

export interface FetchNovelsParams {
	page?: number;
	search?: string;
	genres?: string;
	sort?: 'newest' | 'oldest' | 'popular' | 'alphabetical';
}

export class NovelService {
	private static baseUrl = PUBLIC_API_URL;
	private static apiKey = PUBLIC_API_KEY;

	static async fetchNovels(params: FetchNovelsParams = {}): Promise<NovelResponse> {
		try {
			const urlParams = new URLSearchParams();
			urlParams.append('page', (params.page || 1).toString());

			if (params.search) {
				urlParams.append('search', params.search);
			}
			if (params.genres) {
				urlParams.append('genres', params.genres);
			}
			if (params.sort) {
				urlParams.append('sort', params.sort);
			}

			const response = await fetch(`${this.baseUrl}/api/books?${urlParams.toString()}`, {
				headers: {
					'x-api-key': this.apiKey
				}
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch novels: ${response.statusText}`);
			}

			return await response.json();
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('An unexpected error occurred while fetching novels');
		}
	}

	static async searchNovels(query: string): Promise<NovelResponse> {
		return this.fetchNovels({ page: 1, search: query });
	}

	static async fetchGenres(): Promise<GenreResponse> {
		try {
			const response = await fetch(`${this.baseUrl}/api/genres`, {
				headers: {
					'x-api-key': this.apiKey
				}
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch genres: ${response.statusText}`);
			}

			return await response.json();
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('An unexpected error occurred while fetching genres');
		}
	}

	static async fetchGenresByBook(bookId: string): Promise<GenreResponse> {
		try {
			const response = await fetch(`${this.baseUrl}/api/book/${bookId}/genres`, {
				headers: {
					'x-api-key': this.apiKey
				}
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch book genres: ${response.statusText}`);
			}

			return await response.json();
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('An unexpected error occurred while fetching book genres');
		}
	}

	static async fetchNovelById(id: string | number): Promise<any> {
		try {
			const response = await fetch(`${this.baseUrl}/api/book/${id}`, {
				headers: {
					'x-api-key': this.apiKey
				}
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch novel: ${response.statusText}`);
			}

			return await response.json();
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('An unexpected error occurred while fetching novel');
		}
	}

	static async fetchChaptersByNovelId(id: string | number): Promise<ChapterResponse> {
		try {
			const response = await fetch(`${this.baseUrl}/api/chapters/book/${id}`, {
				headers: {
					'x-api-key': this.apiKey
				}
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch chapters: ${response.statusText}`);
			}

			return await response.json();
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('An unexpected error occurred while fetching chapters');
		}
	}

	static async fetchChapter(id: string): Promise<SingleChapterResponse> {
		try {
			const response = await fetch(`${this.baseUrl}/api/chapter/${id}`, {
				headers: {
					'x-api-key': this.apiKey
				}
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch chapter: ${response.statusText}`);
			}

			return await response.json();
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('An unexpected error occurred while fetching chapter');
		}
	}
}
