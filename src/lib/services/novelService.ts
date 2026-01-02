import type { NovelResponse, ChapterResponse, SingleChapterResponse } from '$lib/types/novel';
import { PUBLIC_API_URL, PUBLIC_API_KEY } from '$env/static/public';

export class NovelService {
	private static baseUrl = PUBLIC_API_URL;
	private static apiKey = PUBLIC_API_KEY;

	static async fetchNovels(page: number = 1, search?: string): Promise<NovelResponse> {
		try {
			const params = new URLSearchParams({ page: page.toString() });
			if (search) {
				params.append('search', search);
			}

			const response = await fetch(`${this.baseUrl}/api/books?${params.toString()}`, {
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
		return this.fetchNovels(1, query);
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
