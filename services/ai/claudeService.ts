// services/ai/claudeService.ts

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-3-5-sonnet-latest'; // Using a stable recent model name

export interface FinancialContext {
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    topCategories: Array<{ name: string; amount: number; percentage: number }>;
    currentBudgets: Array<{ category: string; limit: number; spent: number }>;
    goals: Array<{ name: string; target: number; current: number; deadline: string }>;
    currency: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export class ClaudeFinanceService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async analyzeSpending(context: FinancialContext): Promise<string> {
        const prompt = this.buildSpendingAnalysisPrompt(context);
        return this.callClaude(prompt, 'analysis');
    }

    async chat(
        userMessage: string,
        context: FinancialContext,
        history: ChatMessage[]
    ): Promise<string> {
        const systemPrompt = this.getSystemPrompt('chat', context);
        return this.callClaudeWithHistory(systemPrompt, userMessage, history);
    }

    private async callClaude(userPrompt: string, type: string): Promise<string> {
        if (!this.apiKey) return "API Key not configured. Please add it in settings.";

        try {
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
                    system: this.getSystemPrompt(type),
                    messages: [{ role: 'user', content: userPrompt }],
                }),
            });

            const data = await response.json();
            return data.content[0].text;
        } catch (error) {
            console.error('Claude API Error:', error);
            return "Üzgünüm, şu an analiz yapamıyorum. Lütfen bağlantınızı kontrol edin.";
        }
    }

    private async callClaudeWithHistory(
        system: string,
        userMessage: string,
        history: ChatMessage[]
    ): Promise<string> {
        if (!this.apiKey) return "API Key not configured.";

        try {
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
        } catch (error) {
            console.error('Claude Chat Error:', error);
            return "Bir hata oluştu, lütfen tekrar deneyin.";
        }
    }

    private getSystemPrompt(type: string, ctx?: FinancialContext): string {
        const base = `Sen Fina uygulamasının kişisel finans asistanısın. 
Kullanıcıların harcamalarını analiz edip tasarruf önerileri veriyorsun.
Yanıtların kısa, motive edici ve tamamen Türkçe olmalı.`;

        const contexts = ctx ? `
MEVCUT DURUM:
- Bakiye: ${ctx.totalIncome - ctx.totalExpense} ${ctx.currency}
- Gelir: ${ctx.totalIncome} ${ctx.currency}
- Gider: ${ctx.totalExpense} ${ctx.currency}
` : '';

        const prompts: Record<string, string> = {
            analysis: `${base}\nVerilen harcama verilerine göre 2-3 önemli çıkarım yap.`,
            chat: `${base}\n${contexts}\nKullanıcının finansal sorularını yanıtla.`,
        };

        return prompts[type] || base;
    }

    private buildSpendingAnalysisPrompt(ctx: FinancialContext): string {
        return `Aşağıdaki verileri analiz et:
Gelir: ${ctx.totalIncome}
Gider: ${ctx.totalExpense}
En çok harcananlar: ${JSON.stringify(ctx.topCategories)}
Bütçe aşımları: ${JSON.stringify(ctx.currentBudgets.filter(b => b.spent > b.limit))}
`;
    }
}
