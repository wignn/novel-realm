import type { NovelResponse } from '$lib/types/novel';
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
}
