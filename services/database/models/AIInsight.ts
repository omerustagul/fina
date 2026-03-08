import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class AIInsight extends Model {
    static table = 'ai_insights';

    @field('type') type!: string;
    @field('title') title!: string;
    @field('content') content!: string;
    @field('related_category') relatedCategory?: string;
    @field('priority') priority!: string;
    @field('dismissed') dismissed!: boolean;
    @readonly @date('created_at') createdAt!: number;
}
