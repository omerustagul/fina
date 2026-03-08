import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class Goal extends Model {
    static table = 'goals';

    @field('name') name!: string;
    @field('description') description?: string;
    @field('target_amount') targetAmount!: number;
    @field('current_amount') currentAmount!: number;
    @date('deadline') deadline!: number;
    @field('icon') icon!: string;
    @field('color') color!: string;
    @field('auto_save') autoSave?: string;

    @readonly @date('created_at') createdAt!: number;
    @readonly @date('completed_at') completedAt?: number;
}
