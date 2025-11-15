import type { NovelResponse, ChapterResponse } from '$lib/types/novel';
import { PUBLIC_API_URL, PUBLIC_API_KEY } from '$env/static/public';

export class NovelService {
	private static baseUrl = PUBLIC_API_URL;
	private static apiKey = PUBLIC_API_KEY;

	static async fetchNovels(page: number = 1): Promise<NovelResponse> {
		try {
			const response = await fetch(`${this.baseUrl}/books?page=${page}`, {
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

	static async fetchNovelById(id: string | number): Promise<any> {
		try {
			const response = await fetch(`${this.baseUrl}/book/${id}`, {
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
			const response = await fetch(`${this.baseUrl}/chapters/book/${id}`, {
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
}
