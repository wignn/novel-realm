import { PUBLIC_API_URL, PUBLIC_API_KEY } from '$env/static/public';
import { AuthService } from './authService';

export interface BookmarkResponse {
    id: string;
    book_id: string;
    created_at: string;
}

export interface BookSummary {
    id: string;
    title: string;
    cover: string;
    author: string;
    description: string;
}

export interface BookmarkWithBook {
    id: string;
    book_id: string;
    created_at: string;
    book: BookSummary;
}

export interface BookmarkStatus {
    is_bookmarked: boolean;
    bookmark_id: string | null;
}

export class BookmarkService {
    private static baseUrl = PUBLIC_API_URL;
    private static apiKey = PUBLIC_API_KEY;

    private static getHeaders(): HeadersInit {
        const token = AuthService.getToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    /**
     * Add a book to bookmarks
     */
    static async addBookmark(bookId: string): Promise<BookmarkResponse> {
        const response = await AuthService.fetchWithAuth(`${this.baseUrl}/api/bookmark`, {
            method: 'POST',
            body: JSON.stringify({ book_id: bookId })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to add bookmark');
        }

        return response.json();
    }

    /**
     * Remove a bookmark by ID
     */
    static async removeBookmark(bookmarkId: string): Promise<void> {
        const response = await AuthService.fetchWithAuth(`${this.baseUrl}/api/bookmark/${bookmarkId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to remove bookmark');
        }
    }

    /**
     * Remove a bookmark by book ID (for toggle functionality)
     */
    static async removeBookmarkByBook(bookId: string): Promise<void> {
        const response = await AuthService.fetchWithAuth(`${this.baseUrl}/api/bookmark/book/${bookId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to remove bookmark');
        }
    }

    /**
     * Get all bookmarks for current user
     */
    static async getBookmarks(): Promise<BookmarkWithBook[]> {
        const response = await AuthService.fetchWithAuth(`${this.baseUrl}/api/bookmarks`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to get bookmarks');
        }

        return response.json();
    }

    /**
     * Check if a book is bookmarked
     */
    static async checkBookmark(bookId: string): Promise<BookmarkStatus> {
        const response = await AuthService.fetchWithAuth(`${this.baseUrl}/api/bookmark/check/${bookId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            // If not authenticated, return not bookmarked
            if (response.status === 401) {
                return { is_bookmarked: false, bookmark_id: null };
            }
            throw new Error('Failed to check bookmark status');
        }

        return response.json();
    }

    /**
     * Toggle bookmark status
     */
    static async toggleBookmark(bookId: string): Promise<{ isBookmarked: boolean; bookmarkId: string | null }> {
        const status = await this.checkBookmark(bookId);

        if (status.is_bookmarked && status.bookmark_id) {
            await this.removeBookmark(status.bookmark_id);
            return { isBookmarked: false, bookmarkId: null };
        } else {
            const bookmark = await this.addBookmark(bookId);
            return { isBookmarked: true, bookmarkId: bookmark.id };
        }
    }
}
