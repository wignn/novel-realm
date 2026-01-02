import { PUBLIC_API_URL, PUBLIC_API_KEY } from '$env/static/public';
import { AuthService } from './authService';

export interface ImageInfo {
    filename: string;
    url: string;
    content_type: string;
    size: number;
}

export interface ContentUploadResponse {
    id: string;
    html_content: string;
    images: ImageInfo[];
    format: string;
    created_at: string;
}

export class UploadService {
    private static baseUrl = PUBLIC_API_URL;
    private static apiKey = PUBLIC_API_KEY;

    private static getAuthHeaders(): HeadersInit {
        const token = AuthService.getToken();
        const headers: Record<string, string> = {
            'x-api-key': this.apiKey
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    /**
     * Wrapper for multipart/form-data requests with auto token refresh
     */
    private static async fetchFormDataWithAuth(url: string, formData: FormData): Promise<Response> {
        let response = await fetch(url, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            credentials: 'include',
            body: formData
        });

        // If 401 and we have a refresh token, try to refresh
        if (response.status === 401 && AuthService.getRefreshToken()) {
            try {
                await AuthService.refreshToken();
                // Retry the request with new token
                response = await fetch(url, {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    credentials: 'include',
                    body: formData
                });
            } catch {
                // Refresh failed, return original 401 response
            }
        }

        return response;
    }

    /**
     * Upload a DOCX or EPUB file and get extracted HTML content
     * @param file - The file to upload
     * @param bookId - Optional book ID to associate images with
     * @returns Extracted HTML content and image information
     */
    static async uploadContent(file: File, bookId?: string): Promise<ContentUploadResponse> {
        const formData = new FormData();
        formData.append('file', file);
        if (bookId) {
            formData.append('book_id', bookId);
        }

        const response = await this.fetchFormDataWithAuth(
            `${this.baseUrl}/api/upload/content`,
            formData
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to upload content');
        }

        return response.json();
    }

    /**
     * Get an existing upload by ID
     */
    static async getUpload(id: string): Promise<ContentUploadResponse> {
        const response = await AuthService.fetchWithAuth(`${this.baseUrl}/api/upload/${id}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to get upload');
        }

        return response.json();
    }

    /**
     * Delete an upload and its associated images
     */
    static async deleteUpload(id: string): Promise<void> {
        const response = await AuthService.fetchWithAuth(`${this.baseUrl}/api/upload/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete upload');
        }
    }
}
