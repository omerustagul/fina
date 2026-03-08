import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'transactions',
            columns: [
                { name: 'type', type: 'string' },
                { name: 'amount', type: 'number' },
                { name: 'category_id', type: 'string', isIndexed: true },
                { name: 'title', type: 'string' },
                { name: 'note', type: 'string', isOptional: true },
                { name: 'date', type: 'number' },    // timestamp
                { name: 'recurrence', type: 'string' },
                { name: 'recurrence_end_date', type: 'number', isOptional: true },
                { name: 'tags', type: 'string', isOptional: true }, // JSON array string
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),

        tableSchema({
            name: 'categories',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'icon', type: 'string' },
                { name: 'color', type: 'string' },
                { name: 'type', type: 'string' },
                { name: 'is_default', type: 'boolean' },
                { name: 'parent_id', type: 'string', isOptional: true },
                { name: 'budget_limit', type: 'number', isOptional: true },
            ],
        }),

        tableSchema({
            name: 'budgets',
            columns: [
                { name: 'category_id', type: 'string', isIndexed: true },
                { name: 'amount', type: 'number' },
                { name: 'period', type: 'string' },
                { name: 'start_date', type: 'number' },
                { name: 'rollover', type: 'boolean' },
            ],
        }),

        tableSchema({
            name: 'goals',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'description', type: 'string', isOptional: true },
                { name: 'target_amount', type: 'number' },
                { name: 'current_amount', type: 'number' },
                { name: 'deadline', type: 'number' },
                { name: 'icon', type: 'string' },
                { name: 'color', type: 'string' },
                { name: 'auto_save', type: 'string', isOptional: true }, // JSON string
                { name: 'created_at', type: 'number' },
                { name: 'completed_at', type: 'number', isOptional: true },
            ],
        }),

        tableSchema({
            name: 'ai_insights',
            columns: [
                { name: 'type', type: 'string' },
                { name: 'title', type: 'string' },
                { name: 'content', type: 'string' },
                { name: 'related_category', type: 'string', isOptional: true },
                { name: 'priority', type: 'string' },
                { name: 'dismissed', type: 'boolean' },
                { name: 'created_at', type: 'number' },
            ],
        }),
    ],
});
