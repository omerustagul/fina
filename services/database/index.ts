import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import AIInsight from './models/AIInsight';
import Category from './models/Category';
import Goal from './models/Goal';
import Transaction from './models/Transaction';
import { schema } from './schema';

const adapter = new SQLiteAdapter({
    schema,
    // (Optional) Database name
    dbName: 'fina',
    // (Optional) Initial SQL commands (e.g. for creating views or indexes)
    // jsi: true, // If using JSI for higher performance
    onSetUpError: error => {
        // Database failed to load -- handle the error!
        console.error('Database setup error:', error);
    }
});

export const database = new Database({
    adapter,
    modelClasses: [
        Transaction,
        Category,
        Goal,
        AIInsight,
    ],
});
