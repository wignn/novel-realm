import { PUBLIC_API_URL, PUBLIC_API_KEY } from '$env/static/public';
import { browser } from '$app/environment';

export interface User {
	id: string;
	username: string;
	email: string;
	role: 'Admin' | 'User';
	profile_pic?: string;
	bio?: string;
	created_at?: string;
	updated_at?: string;
}

export interface LoginDto {
	email: string;
	password: string;
}

export interface RegisterDto {
	username: string;
	email: string;
	password: string;
}

export interface AuthResponse {
	data: User;
	access_token?: string;
	refresh_token?: string;
}

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export class AuthService {
	private static baseUrl = PUBLIC_API_URL;
	private static apiKey = PUBLIC_API_KEY;

	static getToken(): string | null {
		if (!browser) return null;
		return localStorage.getItem(TOKEN_KEY);
	}

	static getRefreshToken(): string | null {
		if (!browser) return null;
		return localStorage.getItem(REFRESH_TOKEN_KEY);
	}

	static setTokens(accessToken: string, refreshToken?: string): void {
		if (!browser) return;
		localStorage.setItem(TOKEN_KEY, accessToken);
		if (refreshToken) {
			localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
		}
	}

	static clearTokens(): void {
		if (!browser) return;
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(REFRESH_TOKEN_KEY);
	}

	static getAuthHeaders(): HeadersInit {
		const token = this.getToken();
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			'x-api-key': this.apiKey
		};
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}
		return headers;
	}

	/**
	 * Wrapper for fetch that automatically handles token refresh on 401
	 */
	static async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
		// Add auth headers
		const headers = {
			...this.getAuthHeaders(),
			...(options.headers || {})
		};

		let response = await fetch(url, { ...options, headers, credentials: 'include' });

		// If 401 and we have a refresh token, try to refresh
		if (response.status === 401 && this.getRefreshToken()) {
			const refreshed = await this.tryRefreshToken();

			if (refreshed) {
				// Retry the request with new token
				const newHeaders = {
					...this.getAuthHeaders(),
					...(options.headers || {})
				};
				response = await fetch(url, { ...options, headers: newHeaders, credentials: 'include' });
			}
		}

		return response;
	}

	/**
	 * Try to refresh the token, returns true if successful
	 */
	private static async tryRefreshToken(): Promise<boolean> {
		// If already refreshing, wait for the existing refresh
		if (isRefreshing && refreshPromise) {
			return refreshPromise;
		}

		isRefreshing = true;
		refreshPromise = this.doRefreshToken();

		try {
			return await refreshPromise;
		} finally {
			isRefreshing = false;
			refreshPromise = null;
		}
	}

	private static async doRefreshToken(): Promise<boolean> {
		const refreshToken = this.getRefreshToken();
		if (!refreshToken) {
			return false;
		}

		try {
			const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': this.apiKey
				},
				credentials: 'include',
				body: JSON.stringify({ refresh_token: refreshToken })
			});

			if (!response.ok) {
				this.clearTokens();
				return false;
			}

			const result = await response.json();

			// Handle different response formats
			const accessToken = result.data?.access_token || result.access_token;
			const newRefreshToken = result.data?.refresh_token || result.refresh_token;

			if (accessToken) {
				this.setTokens(accessToken, newRefreshToken);
				return true;
			}

			return false;
		} catch (error) {
			this.clearTokens();
			return false;
		}
	}

	static async login(data: LoginDto): Promise<AuthResponse> {
		const response = await fetch(`${this.baseUrl}/api/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': this.apiKey
			},
			credentials: 'include',
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: 'Login failed' }));
			throw new Error(error.error || 'Login failed');
		}

		const result = await response.json();

		// Tokens are in result.data (backend returns {status, data: {user, access_token, refresh_token}})
		if (result.data?.access_token) {
			this.setTokens(result.data.access_token, result.data.refresh_token);
		}

		// Return normalized response with user data
		return {
			data: result.data?.user || result.data,
			access_token: result.data?.access_token,
			refresh_token: result.data?.refresh_token
		};
	}

	static async register(data: RegisterDto): Promise<AuthResponse> {
		const response = await fetch(`${this.baseUrl}/api/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': this.apiKey
			},
			credentials: 'include',
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: 'Registration failed' }));
			throw new Error(error.error || 'Registration failed');
		}

		const result = await response.json();

		if (result.access_token) {
			this.setTokens(result.access_token, result.refresh_token);
		}

		return result;
	}

	static async getMe(): Promise<AuthResponse> {
		const token = this.getToken();
		if (!token) {
			throw new Error('Not authenticated');
		}

		// Use fetchWithAuth to automatically handle token refresh
		const response = await this.fetchWithAuth(`${this.baseUrl}/api/auth/me`);

		if (!response.ok) {
			if (response.status === 401) {
				this.clearTokens();
			}
			throw new Error('Not authenticated');
		}

		return await response.json();
	}

	static async logout(): Promise<void> {
		const token = this.getToken();
		if (token) {
			try {
				await fetch(`${this.baseUrl}/api/auth/logout`, {
					method: 'POST',
					headers: this.getAuthHeaders(),
					credentials: 'include'
				});
			} catch {
				// Ignore errors
			}
		}
		this.clearTokens();
	}

	static async refreshToken(): Promise<AuthResponse> {
		const refreshToken = this.getRefreshToken();
		if (!refreshToken) {
			throw new Error('No refresh token');
		}

		const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': this.apiKey
			},
			credentials: 'include',
			body: JSON.stringify({ refresh_token: refreshToken })
		});

		if (!response.ok) {
			this.clearTokens();
			throw new Error('Failed to refresh token');
		}

		const result = await response.json();
		const accessToken = result.data?.access_token || result.access_token;
		const newRefreshToken = result.data?.refresh_token || result.refresh_token;

		if (accessToken) {
			this.setTokens(accessToken, newRefreshToken);
		}

		return result;
	}

	static isAuthenticated(): boolean {
		return !!this.getToken();
	}
}
