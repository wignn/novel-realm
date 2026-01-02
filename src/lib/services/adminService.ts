import { PUBLIC_API_URL, PUBLIC_API_KEY } from '$env/static/public';
import { AuthService } from './authService';
import type { Novel, Chapter, Genre } from '$lib/types/novel';

export interface CreateNovelDto {
    title: string;
    author: string;
    cover: string;
    description: string;
    asset?: string;
    status: string;
    language: string;
    release_date: number;
    popular: boolean;
}

export interface UpdateNovelDto {
    title?: string;
    author?: string;
    cover?: string;
    description?: string;
    asset?: string;
    status?: string;
    language?: string;
    release_date?: number;
    popular?: boolean;
}

export interface CreateChapterDto {
    title: string;
    book_id: string;
    description: string;
    content: string;
    chapter_num: number;
}

export interface UpdateChapterDto {
    title?: string;
    description?: string;
    content?: string;
    chapter_num?: number;
}

export interface CreateGenreDto {
    title: string;
    description: string;
}

export interface UpdateGenreDto {
    title?: string;
    description?: string;
}

export class AdminService {
    private static baseUrl = PUBLIC_API_URL;
    private static apiKey = PUBLIC_API_KEY;

    // Novels
    static async createNovel(data: CreateNovelDto): Promise<{ data: Novel }> {
        const response = await AuthService.fetchWithAuth(`${this.baseUrl}/api/books`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create novel');
        return response.json();
    }

    static async updateNovel(id: string, data: UpdateNovelDto): Promise<{ data: Novel }> {
        const response = await AuthService.fetchWithAuth(`${this.baseUrl}/api/book/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update novel');
        return response.json();
    }

    static async deleteNovel(id: string): Promise<void> {
        const response = await AuthService.fetchWithAuth(`${this.baseUrl}/api/book/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete novel');
    }

    // Chapters
    static async createChapter(data: CreateChapterDto): Promise<{ data: Chapter }> {
        const response = await AuthService.fetchWithAuth(`${this.baseUrl}/api/chapter`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create chapter');
        return response.json();
    }

    static async updateChapter(id: string, data: UpdateChapterDto): Promise<{ data: Chapter }> {
        const response = await AuthService.fetchWithAuth(`${this.baseUrl}/api/chapter/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update chapter');
        return response.json();
    }

    static async deleteChapter(id: string): Promise<void> {
        const response = await AuthService.fetchWithAuth(`${this.baseUrl}/api/chapter/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete chapter');
    }

    // Genres
    static async createGenre(data: CreateGenreDto): Promise<{ data: Genre }> {
        const response = await AuthService.fetchWithAuth(`${this.baseUrl}/api/genre`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create genre');
        return response.json();
    }

    static async updateGenre(id: string, data: UpdateGenreDto): Promise<{ data: Genre }> {
        const response = await AuthService.fetchWithAuth(`${this.baseUrl}/api/genre/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update genre');
        return response.json();
    }

    static async deleteGenre(id: string): Promise<void> {
        const response = await AuthService.fetchWithAuth(`${this.baseUrl}/api/genre/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete genre');
    }
}
