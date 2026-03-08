# 🤖 FinanceAI — Yapay Zeka Entegrasyonu & Veri Modelleri

---

## 🧠 Claude AI Entegrasyonu

### Claude Service Katmanı

```typescript
// services/ai/claudeService.ts

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-5';

interface FinancialContext {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  topCategories: Array<{ name: string; amount: number; percentage: number }>;
  monthlyTrend: Array<{ month: string; income: number; expense: number }>;
  currentBudgets: Array<{ category: string; limit: number; spent: number }>;
  goals: Array<{ name: string; target: number; current: number; deadline: string }>;
  period: 'weekly' | 'monthly' | 'yearly';
  currency: string;
}

export class ClaudeFinanceService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Aylık harcama analizi
  async analyzeSpending(context: FinancialContext): Promise<string> {
    const prompt = buildSpendingAnalysisPrompt(context);
    return this.callClaude(prompt, 'analysis');
  }

  // Bütçe optimizasyon önerileri
  async getBudgetRecommendations(context: FinancialContext): Promise<string> {
    const prompt = buildBudgetPrompt(context);
    return this.callClaude(prompt, 'recommendations');
  }

  // Finansal hedef yol haritası
  async generateGoalRoadmap(goal: GoalContext): Promise<string> {
    const prompt = buildGoalPrompt(goal);
    return this.callClaude(prompt, 'goal');
  }

  // Serbest chat
  async chat(
    userMessage: string,
    context: FinancialContext,
    history: ChatMessage[]
  ): Promise<string> {
    const systemPrompt = buildSystemPrompt(context);
    return this.callClaudeWithHistory(systemPrompt, userMessage, history);
  }

  private async callClaude(userPrompt: string, type: string): Promise<string> {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: getSystemPrompt(type),
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    const data = await response.json();
    return data.content[0].text;
  }

  private async callClaudeWithHistory(
    system: string,
    userMessage: string,
    history: ChatMessage[]
  ): Promise<string> {
    const messages = [
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage },
    ];

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system,
        messages,
      }),
    });

    const data = await response.json();
    return data.content[0].text;
  }
}
```

---

### AI Prompt Şablonları

```typescript
// services/ai/analysisPrompts.ts

export function getSystemPrompt(type: string): string {
  const base = `Sen FinanceAI'ın kişisel finans asistanısın. 
Kullanıcıların finansal verilerini analiz ederek pratik, 
uygulanabilir öneriler sunuyorsun. 
Yanıtların kısa, net ve motive edici olmalı.
Türkçe yanıt ver. Para birimini kullanıcının tercihine göre formatla.
Asla kurgusal rakamlar üretme, yalnızca sağlanan veriyi analiz et.`;

  const typePrompts: Record<string, string> = {
    analysis: `${base}
Analiz yaparken şunlara odaklan:
1. En yüksek harcama kategorileri
2. Olağandışı harcama artışları
3. Tasarruf fırsatları
4. Geçen aya göre değişimler
Yanıtını 3-4 cümle ile sınırla.`,

    recommendations: `${base}
Bütçe önerileri sunarken:
1. 50/30/20 kuralını temel al
2. Somut kesinti önerileri ver
3. Önceliklendirme yap
Yanıtını madde madde, kısa tut.`,

    goal: `${base}
Hedef analizi yaparken:
1. Aylık gereken birikim miktarını hesapla
2. Mevcut tasarruf oranını değerlendir
3. Hedefe ulaşma olasılığını belirt
4. Pratik ipuçları ver.`,
  };

  return typePrompts[type] || base;
}

export function buildSpendingAnalysisPrompt(ctx: FinancialContext): string {
  return `Aşağıdaki finansal verileri analiz et:

DÖNEM: ${ctx.period === 'monthly' ? 'Bu Ay' : ctx.period}
PARA BİRİMİ: ${ctx.currency}

ÖZET:
- Toplam Gelir: ${ctx.totalIncome}
- Toplam Gider: ${ctx.totalExpense}
- Net Tasarruf: ${ctx.netSavings}
- Tasarruf Oranı: %${((ctx.netSavings / ctx.totalIncome) * 100).toFixed(1)}

EN YÜKSEK HARCAMA KATEGORİLERİ:
${ctx.topCategories.map(c => `- ${c.name}: ${c.amount} (%${c.percentage})`).join('\n')}

BÜTÇE DURUMU:
${ctx.currentBudgets.map(b => 
  `- ${b.category}: ${b.spent}/${b.limit} (${b.spent > b.limit ? '⚠️ Aşıldı' : `%${((b.spent/b.limit)*100).toFixed(0)} kullanıldı`})`
).join('\n')}

Bu verilere göre kısa bir analiz yap ve en önemli 2-3 içgörüyü paylaş.`;
}
```

---

## 📦 Veri Modelleri

### TypeScript Tipleri

```typescript
// types/transaction.ts

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
  date: Date;
  recurrence: RecurrenceType;
  recurrenceEndDate?: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;           // emoji veya icon name
  color: string;          // hex renk
  type: TransactionType | 'both';
  isDefault: boolean;
  parentId?: string;      // alt kategori desteği
  budgetLimit?: number;   // aylık bütçe limiti
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  rollover: boolean;      // kalan bütçe sonraki aya aktarılsın mı
}

export interface Goal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  icon: string;
  color: string;
  autoSave?: {
    enabled: boolean;
    amount: number;
    frequency: 'weekly' | 'monthly';
  };
  createdAt: Date;
  completedAt?: Date;
}

export interface AIInsight {
  id: string;
  type: 'tip' | 'warning' | 'achievement' | 'forecast';
  title: string;
  content: string;
  relatedCategory?: string;
  priority: 'low' | 'medium' | 'high';
  dismissed: boolean;
  createdAt: Date;
}
```

---

## 🗄️ WatermelonDB Schema

```typescript
// services/database/schema.ts
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'transactions',
      columns: [
        { name: 'type',               type: 'string' },
        { name: 'amount',             type: 'number' },
        { name: 'category_id',        type: 'string', isIndexed: true },
        { name: 'title',              type: 'string' },
        { name: 'note',               type: 'string', isOptional: true },
        { name: 'date',               type: 'number' },    // timestamp
        { name: 'recurrence',         type: 'string' },
        { name: 'recurrence_end_date',type: 'number', isOptional: true },
        { name: 'tags',               type: 'string', isOptional: true }, // JSON array
        { name: 'created_at',         type: 'number' },
        { name: 'updated_at',         type: 'number' },
      ],
    }),

    tableSchema({
      name: 'categories',
      columns: [
        { name: 'name',         type: 'string' },
        { name: 'icon',         type: 'string' },
        { name: 'color',        type: 'string' },
        { name: 'type',         type: 'string' },
        { name: 'is_default',   type: 'boolean' },
        { name: 'parent_id',    type: 'string', isOptional: true },
        { name: 'budget_limit', type: 'number', isOptional: true },
      ],
    }),

    tableSchema({
      name: 'budgets',
      columns: [
        { name: 'category_id', type: 'string', isIndexed: true },
        { name: 'amount',      type: 'number' },
        { name: 'period',      type: 'string' },
        { name: 'start_date',  type: 'number' },
        { name: 'rollover',    type: 'boolean' },
      ],
    }),

    tableSchema({
      name: 'goals',
      columns: [
        { name: 'name',           type: 'string' },
        { name: 'description',    type: 'string', isOptional: true },
        { name: 'target_amount',  type: 'number' },
        { name: 'current_amount', type: 'number' },
        { name: 'deadline',       type: 'number' },
        { name: 'icon',           type: 'string' },
        { name: 'color',          type: 'string' },
        { name: 'auto_save',      type: 'string', isOptional: true }, // JSON
        { name: 'created_at',     type: 'number' },
        { name: 'completed_at',   type: 'number', isOptional: true },
      ],
    }),

    tableSchema({
      name: 'ai_insights',
      columns: [
        { name: 'type',             type: 'string' },
        { name: 'title',            type: 'string' },
        { name: 'content',          type: 'string' },
        { name: 'related_category', type: 'string', isOptional: true },
        { name: 'priority',         type: 'string' },
        { name: 'dismissed',        type: 'boolean' },
        { name: 'created_at',       type: 'number' },
      ],
    }),
  ],
});
```

---

## 🔄 Zustand Store Yapıları

```typescript
// stores/financeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FinanceState {
  // State
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  selectedPeriod: 'week' | 'month' | 'year';
  selectedCurrency: string;

  // Hesaplanmış değerler (getters)
  getTotalIncome: (period?: DateRange) => number;
  getTotalExpense: (period?: DateRange) => number;
  getNetSavings: (period?: DateRange) => number;
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getBudgetStatus: (categoryId: string) => BudgetStatus;

  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setPeriod: (period: 'week' | 'month' | 'year') => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: DEFAULT_CATEGORIES,
      budgets: [],
      selectedPeriod: 'month',
      selectedCurrency: 'TRY',

      getTotalIncome: (period) => {
        const txs = filterByPeriod(get().transactions, period);
        return txs
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getTotalExpense: (period) => {
        const txs = filterByPeriod(get().transactions, period);
        return txs
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      // ... diğer metodlar
    }),
    { name: 'finance-storage' }
  )
);
```

---

## 📊 Varsayılan Kategoriler

```typescript
// utils/defaultCategories.ts
export const DEFAULT_CATEGORIES: Category[] = [
  // Gider kategorileri
  { id: 'food',          name: 'Yiyecek & İçecek', icon: '🍔', color: '#FF6B6B', type: 'expense', isDefault: true },
  { id: 'transport',     name: 'Ulaşım',           icon: '🚗', color: '#4ECDC4', type: 'expense', isDefault: true },
  { id: 'shopping',      name: 'Alışveriş',        icon: '🛍️', color: '#45B7D1', type: 'expense', isDefault: true },
  { id: 'entertainment', name: 'Eğlence',           icon: '🎮', color: '#96CEB4', type: 'expense', isDefault: true },
  { id: 'health',        name: 'Sağlık',            icon: '💊', color: '#88D8B0', type: 'expense', isDefault: true },
  { id: 'education',     name: 'Eğitim',            icon: '📚', color: '#FFEAA7', type: 'expense', isDefault: true },
  { id: 'housing',       name: 'Konut & Kira',      icon: '🏠', color: '#DDA0DD', type: 'expense', isDefault: true },
  { id: 'bills',         name: 'Faturalar',         icon: '📱', color: '#F0A500', type: 'expense', isDefault: true },
  { id: 'clothing',      name: 'Giyim',             icon: '👔', color: '#B8B8D1', type: 'expense', isDefault: true },
  { id: 'other_expense', name: 'Diğer',             icon: '📦', color: '#B8B8B8', type: 'expense', isDefault: true },

  // Gelir kategorileri
  { id: 'salary',        name: 'Maaş',              icon: '💰', color: '#00D2FF', type: 'income',  isDefault: true },
  { id: 'freelance',     name: 'Serbest Çalışma',   icon: '💻', color: '#38EF7D', type: 'income',  isDefault: true },
  { id: 'investment',    name: 'Yatırım Getirisi',  icon: '📈', color: '#FFD700', type: 'income',  isDefault: true },
  { id: 'gift',          name: 'Hediye & Bağış',    icon: '🎁', color: '#FF9FF3', type: 'income',  isDefault: true },
  { id: 'other_income',  name: 'Diğer Gelir',       icon: '✨', color: '#B8B8B8', type: 'income',  isDefault: true },
];
```
