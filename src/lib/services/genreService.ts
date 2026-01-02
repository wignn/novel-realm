import type { GenreResponse, SingleGenreResponse } from '$lib/types/novel';
import { PUBLIC_API_URL, PUBLIC_API_KEY } from '$env/static/public';

export class GenreService {
    private static baseUrl = PUBLIC_API_URL;
    private static apiKey = PUBLIC_API_KEY;

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

    static async fetchGenreById(id: string): Promise<SingleGenreResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/api/genre/${id}`, {
                headers: {
                    'x-api-key': this.apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch genre: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred while fetching genre');
        }
    }
}
