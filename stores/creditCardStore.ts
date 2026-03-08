import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface CreditCard {
    id: string;
    bankName: string;               // "Garanti", "Yapı Kredi", vb.
    cardName?: string;              // "Bonus Card", "World Card", vb.
    lastFourDigits?: string;
    creditLimit: number;            // Toplam kredi limiti
    currentDebt: number;            // Güncel borç bakiyesi
    statementDebt: number;          // Hesap özeti borcu (son ekstre)
    minimumPayment: number;         // Asgari ödeme tutarı
    minimumPaymentMode: 'auto' | 'manual'; // Sistem mi hesaplasın kullanıcı mı girer
    paymentDueDate: number;         // Son ödeme tarihi (timestamp)
    statementClosingDate: number;   // Hesap kesim tarihi (timestamp)
    interestRate?: number;          // Aylık faiz oranı (%)
    color: string;                  // Kart rengi (UI için)
    cardNetwork: 'visa' | 'mastercard' | 'troy' | 'amex';
    isActive: boolean;
    createdAt: number;
}

interface CreditCardState {
    cards: CreditCard[];

    // Actions
    addCard: (card: Omit<CreditCard, 'id' | 'createdAt'>) => void;
    updateCard: (id: string, updates: Partial<CreditCard>) => void;
    deleteCard: (id: string) => void;

    // Hesaplama getters (for future use or immediate UI)
    getTotalDebt: () => number;
    getTotalLimit: () => number;
    getTotalUtilization: () => number;
    getTotalMinimumPayment: () => number;
}

export const useCreditCardStore = create<CreditCardState>()(
    persist(
        (set, get) => ({
            cards: [],

            addCard: (card) => {
                const newCard: CreditCard = {
                    ...card,
                    id: Math.random().toString(36).substring(7),
                    createdAt: Date.now(),
                };
                set((state) => ({ cards: [newCard, ...state.cards] }));
            },

            updateCard: (id, updates) => {
                set((state) => ({
                    cards: state.cards.map(c => c.id === id ? { ...c, ...updates } : c)
                }));
            },

            deleteCard: (id) => {
                set((state) => ({
                    cards: state.cards.filter(c => c.id !== id)
                }));
            },

            getTotalDebt: () => {
                return get().cards.reduce((sum, card) => sum + card.currentDebt, 0);
            },

            getTotalLimit: () => {
                return get().cards.reduce((sum, card) => sum + card.creditLimit, 0);
            },

            getTotalUtilization: () => {
                const debt = get().getTotalDebt();
                const limit = get().getTotalLimit();
                if (limit === 0) return 0;
                return (debt / limit) * 100;
            },

            getTotalMinimumPayment: () => {
                return get().cards.reduce((sum, card) => sum + card.minimumPayment, 0);
            }
        }),
        {
            name: 'credit-card-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ cards: state.cards }),
        }
    )
);
