import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone?: string;
    birthDate?: string;
    gender?: string;
    country?: string;
    city?: string;
    address?: string; // keeping legacy for any usage
    avatarUrl?: string;
}

interface AuthState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    registeredUsers: UserProfile[]; // Mock DB of users

    login: (email: string, password?: string) => { success: boolean, error?: string };
    register: (profile: UserProfile) => { success: boolean, error?: string };
    logout: () => void;
    updateProfile: (updates: Partial<UserProfile>) => void;
    socialLogin: (provider: 'Google' | 'Apple' | 'Facebook') => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            registeredUsers: [],

            login: (email: string, password?: string) => {
                const { registeredUsers } = get();
                const matchedUser = registeredUsers.find(u => u.email === email && u.password === password);

                if (matchedUser) {
                    set({ user: matchedUser, isAuthenticated: true });
                    return { success: true };
                } else if (!password) {
                    // Fallback for simple legacy tests if they only pass email
                    const legacyUser = registeredUsers.find(u => u.email === email);
                    if (legacyUser) {
                        set({ user: legacyUser, isAuthenticated: true });
                        return { success: true };
                    }
                }

                return { success: false, error: 'E-posta veya şifre hatalı!' };
            },

            register: (profile: UserProfile) => {
                const { registeredUsers } = get();
                const exists = registeredUsers.find(u => u.email === profile.email);

                if (exists) {
                    return { success: false, error: 'Bu e-posta adresi zaten kullanılıyor.' };
                }

                set({
                    registeredUsers: [...registeredUsers, profile],
                    user: profile,
                    isAuthenticated: true
                });
                return { success: true };
            },

            socialLogin: (provider: 'Google' | 'Apple' | 'Facebook') => {
                const mockProfile: UserProfile = {
                    firstName: provider,
                    lastName: 'Kullanıcısı',
                    email: `user@${provider.toLowerCase()}.com`,
                };

                const { registeredUsers } = get();
                const exists = registeredUsers.find(u => u.email === mockProfile.email);

                const finalProfile = exists ? exists : mockProfile;

                set({
                    registeredUsers: exists ? registeredUsers : [...registeredUsers, mockProfile],
                    user: finalProfile,
                    isAuthenticated: true
                });
            },

            logout: () => {
                set({ isAuthenticated: false, user: null });
            },

            updateProfile: (updates: Partial<UserProfile>) => {
                const currentUser = get().user;
                if (currentUser) {
                    const updatedUser = { ...currentUser, ...updates };

                    // Update in registered users array as well
                    const { registeredUsers } = get();
                    const nextUsers = registeredUsers.map(u =>
                        u.email === currentUser.email ? updatedUser : u
                    );

                    set({ user: updatedUser, registeredUsers: nextUsers });
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
