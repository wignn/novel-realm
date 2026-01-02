import { writable } from 'svelte/store';
import type { User } from '$lib/services/authService';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true
    });

    return {
        subscribe,
        setUser: (user: User) => {
            update(state => ({
                ...state,
                user,
                isAuthenticated: true,
                isLoading: false
            }));
        },
        clearUser: () => {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false
            });
        },
        setLoading: (isLoading: boolean) => {
            update(state => ({ ...state, isLoading }));
        }
    };
}

export const authStore = createAuthStore();
