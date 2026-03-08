import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class Transaction extends Model {
    static table = 'transactions';

    @field('type') type!: string;
    @field('amount') amount!: number;
    @field('category_id') categoryId!: string;
    @field('title') title!: string;
    @field('note') note?: string;
    @date('date') date!: number;
    @field('recurrence') recurrence!: string;
    @field('recurrence_end_date') recurrenceEndDate?: number;
    @field('tags') tags?: string;

    @readonly @date('created_at') createdAt!: number;
    @readonly @date('updated_at') updatedAt!: number;
}
