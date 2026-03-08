import { THEMES, ThemeColors } from '@/theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    getTheme: () => ThemeColors;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            mode: 'system',
            setMode: (mode) => set({ mode }),
            getTheme: () => {
                const { mode } = get();
                if (mode === 'system') {
                    const systemScheme = Appearance.getColorScheme();
                    return systemScheme === 'light' ? THEMES.light : THEMES.dark;
                }
                return mode === 'light' ? THEMES.light : THEMES.dark;
            },
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export const useTheme = () => {
    const { mode, getTheme } = useThemeStore();
    const colors = getTheme();
    const isDark = mode === 'system' ? Appearance.getColorScheme() === 'dark' : mode === 'dark';

    return {
        colors,
        isDark,
        mode,
    };
};
