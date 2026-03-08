// stores/aiStore.ts
import { AIInsight } from '@/types';
import { create } from 'zustand';

interface AIState {
    insights: AIInsight[];
    isSearching: boolean;

    // Actions
    addInsight: (insight: AIInsight) => void;
    dismissInsight: (id: string) => void;
    setSearching: (searching: boolean) => void;
}

export const useAIStore = create<AIState>((set) => ({
    insights: [],
    isSearching: false,

    addInsight: (insight) => {
        set((state) => ({ insights: [insight, ...state.insights] }));
    },

    dismissInsight: (id) => {
        set((state) => ({
            insights: state.insights.map((i) =>
                i.id === id ? { ...i, dismissed: true } : i
            ),
        }));
    },

    setSearching: (isSearching) => set({ isSearching }),
}));
