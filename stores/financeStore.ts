// stores/financeStore.ts
import { Budget, Category, Goal, Reminder, Transaction } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FinanceState {
    transactions: Transaction[];
    categories: Category[];
    budgets: Budget[];
    goals: Goal[];
    selectedPeriod: 'week' | 'month' | 'year';
    selectedCurrency: string;
    reminders: Reminder[];

    // Actions
    addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
    deleteTransaction: (id: string) => void;
    updateTransaction: (id: string, updates: Partial<Transaction>) => void;
    setPeriod: (period: 'week' | 'month' | 'year') => void;

    // Goals Actions
    addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
    updateGoal: (id: string, updates: Partial<Goal>) => void;
    deleteGoal: (id: string) => void;
    addMoneyToGoal: (id: string, amount: number, reason: string) => void;

    // Categories Actions
    addCategory: (category: Omit<Category, 'id' | 'isDefault'>) => void;

    // Reminders Actions
    addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>) => void;
    updateReminder: (id: string, updates: Partial<Reminder>) => void;
    deleteReminder: (id: string) => void;
    toggleReminderStatus: (id: string) => void;

    // Helpers
    getTotalIncome: () => number;
    getTotalExpense: () => number;
    getTopCategories: () => Array<{ name: string, amount: number, percentage: number }>;
    getBudgetStatus: () => Array<{ category: string, limit: number, spent: number }>;
}

export const useFinanceStore = create<FinanceState>()(
    persist(
        (set, get) => ({
            transactions: [],
            categories: DEFAULT_CATEGORIES,
            budgets: [],
            goals: DEFAULT_GOALS,
            reminders: [],
            selectedPeriod: 'month',
            selectedCurrency: 'TRY',

            addTransaction: (tx) => {
                const newTx: Transaction = {
                    ...tx,
                    id: Math.random().toString(36).substring(7),
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };
                set((state) => ({ transactions: [newTx, ...state.transactions] }));
            },

            deleteTransaction: (id) => {
                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id),
                }));
            },

            updateTransaction: (id, updates) => {
                set((state) => ({
                    transactions: state.transactions.map((t) =>
                        t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
                    ),
                }));
            },

            setPeriod: (selectedPeriod) => set({ selectedPeriod }),

            getTotalIncome: () => {
                return get().transactions
                    .filter((t) => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0);
            },

            getTotalExpense: () => {
                return get().transactions
                    .filter((t) => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0);
            },

            getTopCategories: () => {
                const expenses = get().transactions.filter(t => t.type === 'expense');
                const totals: Record<string, number> = {};
                expenses.forEach(t => {
                    totals[t.categoryId] = (totals[t.categoryId] || 0) + t.amount;
                });

                const totalExp = get().getTotalExpense() || 1;
                return Object.entries(totals)
                    .map(([id, amount]) => ({
                        name: (get().categories || []).find(c => c.id === id)?.name || id,
                        amount,
                        percentage: Math.round((amount / totalExp) * 100)
                    }))
                    .sort((a, b) => b.amount - a.amount);
            },

            getBudgetStatus: () => {
                return (get().categories || [])
                    .filter(c => c.budgetLimit)
                    .map(c => ({
                        category: c.name,
                        limit: c.budgetLimit || 0,
                        spent: get().transactions
                            .filter(t => t.categoryId === c.id && t.type === 'expense')
                            .reduce((sum, t) => sum + t.amount, 0)
                    }));
            },

            addGoal: (goal) => {
                const newGoal: Goal = {
                    ...goal,
                    id: Math.random().toString(36).substring(7),
                    createdAt: Date.now(),
                };
                set((state) => ({ goals: [...(state.goals || []), newGoal] }));
            },

            updateGoal: (id, updates) => {
                set((state) => ({
                    goals: (state.goals || []).map((g) =>
                        g.id === id ? { ...g, ...updates } : g
                    ),
                }));
            },

            deleteGoal: (id) => {
                set((state) => ({
                    goals: (state.goals || []).filter((g) => g.id !== id),
                }));
            },

            addMoneyToGoal: (id, amount, reason) => {
                set((state) => {
                    const goal = (state.goals || []).find(g => g.id === id);

                    let txTitle = "";
                    let txType: 'income' | 'expense' = 'expense';
                    let txCategory = '';

                    if (amount > 0) {
                        txTitle = `${goal?.name || 'Hedef'}: Hedefe eklendi${reason ? ` (${reason})` : ''}`;
                        txType = 'expense';
                        txCategory = 'goal_deposit';
                    } else {
                        txTitle = `${goal?.name || 'Hedef'}: Hedeften çekildi${reason ? ` (${reason})` : ''}`;
                        txType = 'income';
                        txCategory = 'goal_withdrawal';
                    }

                    const transaction: Transaction = {
                        id: Math.random().toString(36).substring(7),
                        title: txTitle,
                        amount: Math.abs(amount),
                        type: txType,
                        categoryId: txCategory,
                        date: Date.now(),
                        recurrence: 'none',
                        createdAt: Date.now(),
                        updatedAt: Date.now()
                    };

                    return {
                        goals: (state.goals || []).map((g) =>
                            g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
                        ),
                        transactions: [transaction, ...(state.transactions || [])]
                    };
                });
            },

            addCategory: (categoryParams) => {
                const newCategory: Category = {
                    ...categoryParams,
                    id: Math.random().toString(36).substring(7),
                    isDefault: false
                };
                set((state) => ({ categories: [...(state.categories || []), newCategory] }));
            },

            addReminder: (reminder) => {
                const newReminder: Reminder = {
                    ...reminder,
                    id: Math.random().toString(36).substring(7),
                    isCompleted: false,
                    createdAt: Date.now(),
                };
                set((state) => ({ reminders: [newReminder, ...(state.reminders || [])] }));
            },

            updateReminder: (id, updates) => {
                set((state) => ({
                    reminders: (state.reminders || []).map((r) =>
                        r.id === id ? { ...r, ...updates } : r
                    ),
                }));
            },

            deleteReminder: (id) => {
                set((state) => ({
                    reminders: (state.reminders || []).filter((r) => r.id !== id),
                }));
            },

            toggleReminderStatus: (id) => {
                set((state) => ({
                    reminders: (state.reminders || []).map((r) =>
                        r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
                    ),
                }));
            },
        }),
        {
            name: 'finance-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

const DEFAULT_CATEGORIES: Category[] = [
    // Gider kategorileri
    { id: 'food', name: 'Yiyecek & İçecek', icon: '🍔', color: '#FF6B6B', type: 'expense', isDefault: true },
    { id: 'transport', name: 'Ulaşım', icon: '🚗', color: '#4ECDC4', type: 'expense', isDefault: true },
    { id: 'shopping', name: 'Alışveriş', icon: '🛍️', color: '#45B7D1', type: 'expense', isDefault: true },
    { id: 'entertainment', name: 'Eğlence', icon: '🎮', color: '#96CEB4', type: 'expense', isDefault: true },
    { id: 'health', name: 'Sağlık', icon: '💊', color: '#88D8B0', type: 'expense', isDefault: true },
    { id: 'education', name: 'Eğitim', icon: '📚', color: '#FFEAA7', type: 'expense', isDefault: true },
    { id: 'housing', name: 'Konut & Kira', icon: '🏠', color: '#DDA0DD', type: 'expense', isDefault: true },
    { id: 'bills', name: 'Faturalar', icon: '📱', color: '#F0A500', type: 'expense', isDefault: true },
    { id: 'clothing', name: 'Giyim', icon: '👔', color: '#B8B8D1', type: 'expense', isDefault: true },
    { id: 'other_expense', name: 'Diğer Gider', icon: '📦', color: '#B8B8B8', type: 'expense', isDefault: true },
    { id: 'goal_deposit', name: 'Hedefe Aktarım', icon: '🎯', color: '#6C3CE1', type: 'expense', isDefault: true },

    // Gelir kategorileri
    { id: 'salary', name: 'Maaş', icon: '💰', color: '#00D2FF', type: 'income', isDefault: true },
    { id: 'freelance', name: 'Serbest Çalışma', icon: '💻', color: '#38EF7D', type: 'income', isDefault: true },
    { id: 'investment', name: 'Yatırım Getirisi', icon: '📈', color: '#FFD700', type: 'income', isDefault: true },
    { id: 'gift', name: 'Hediye & Bağış', icon: '🎁', color: '#FF9FF3', type: 'income', isDefault: true },
    { id: 'other_income', name: 'Diğer Gelir', icon: '✨', color: '#B8B8B8', type: 'income', isDefault: true },
    { id: 'goal_withdrawal', name: 'Hedeften Çekim', icon: '🔓', color: '#4ECDC4', type: 'income', isDefault: true },
];

const DEFAULT_GOALS: Goal[] = [
    { id: '1', name: 'Yeni Araba', targetAmount: 500000, currentAmount: 125000, icon: 'car-outline', color: '#4ECDC4', createdAt: Date.now(), deadline: Date.now() + 1000 * 60 * 60 * 24 * 365 },
    { id: '2', name: 'Avrupa Turu', targetAmount: 80000, currentAmount: 45000, icon: 'airplane-outline', color: '#6C3CE1', createdAt: Date.now(), deadline: Date.now() + 1000 * 60 * 60 * 24 * 180 },
    { id: '3', name: 'MacBook Pro', targetAmount: 75000, currentAmount: 75000, icon: 'laptop-outline', color: '#FFD166', createdAt: Date.now(), deadline: Date.now() + 1000 * 60 * 60 * 24 * 60 },
];
