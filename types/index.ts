// types/index.ts

export type TransactionType = 'income' | 'expense';

export type RecurrenceType =
    | 'none'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    categoryId: string;
    title: string;
    note?: string;
    date: number; // timestamp
    recurrence: RecurrenceType;
    recurrenceEndDate?: number;
    tags?: string[];
    createdAt: number;
    updatedAt: number;
}

export interface Category {
    id: string;
    name: string;
    icon: string;           // emoji or icon name
    color: string;          // hex color
    type: TransactionType | 'both';
    isDefault: boolean;
    parentId?: string;
    budgetLimit?: number;
}

export interface Budget {
    id: string;
    categoryId: string;
    amount: number;
    period: 'weekly' | 'monthly' | 'yearly';
    startDate: number;
    rollover: boolean;
}

export interface Goal {
    id: string;
    name: string;
    description?: string;
    targetAmount: number;
    currentAmount: number;
    deadline: number;
    icon: string;
    color: string;
    createdAt: number;
    completedAt?: number;
}

export interface AIInsight {
    id: string;
    type: 'tip' | 'warning' | 'achievement' | 'forecast';
    title: string;
    content: string;
    relatedCategory?: string;
    priority: 'low' | 'medium' | 'high';
    dismissed: boolean;
    createdAt: number;
}

export interface Reminder {
    id: string;
    title: string;
    amount?: number;
    type: 'debt_given' | 'debt_taken' | 'bill' | 'other';
    dueDate: number;
    isCompleted: boolean;
    notify: boolean;
    createdAt: number;
}
