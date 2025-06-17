// hooks/use-loading-store.ts
import { create } from 'zustand';

type LoadingState = {
    isLoading: boolean;
    message: string | null;
    show: (message?: string) => void;
    hide: () => void;
};

export const useLoadingStore = create<LoadingState>((set) => ({
    isLoading: false,
    message: null,
    show: (message) => set({ isLoading: true, message: message || null }),
    hide: () => set({ isLoading: false, message: null }),
}));