import { BalanceDonut } from '@/components/charts/BalanceDonut';
import { GlassCard } from '@/components/ui';
import { useFinanceStore } from '@/stores/financeStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { formatCurrency } from '@/utils/currency';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AnalyticsScreen() {
    const { transactions, categories, getTotalIncome, getTotalExpense } = useFinanceStore();
    const { colors, isDark } = useTheme();

    const income = getTotalIncome();
    const expense = getTotalExpense();
    const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.primary.deep }]} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.title, { color: colors.glass.text.primary }]}>Analiz</Text>

                <GlassCard style={styles.overviewCard} variant="elevated">
                    <View style={styles.overviewHeader}>
                        <Text style={[styles.overviewTitle, { color: colors.glass.text.primary }]}>Aylık Özet</Text>
                        <View style={[styles.savingsBadge, { backgroundColor: `${colors.accent.teal}15` }]}>
                            <Ionicons name="leaf" size={14} color={colors.accent.teal} />
                            <Text style={[styles.savingsBadgeText, { color: colors.accent.teal }]}>%{savingsRate} Tasarruf</Text>
                        </View>
                    </View>

                    <View style={styles.overviewContent}>
                        <View style={styles.overviewChart}>
                            <BalanceDonut income={income} expense={expense} size={110} />
                            <View style={styles.chartCenter}>
                                <Text style={[styles.chartCenterText, { color: colors.glass.text.primary }]}>Net</Text>
                                <Text style={[styles.chartCenterValue, { color: income - expense >= 0 ? colors.accent.teal : colors.accent.red }]} numberOfLines={1}>
                                    {formatCurrency(income - expense)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.overviewStats}>
                            <View style={styles.overviewStatRow}>
                                <View style={[styles.miniIcon, { backgroundColor: `${colors.accent.teal}15` }]}>
                                    <Ionicons name="arrow-down" size={16} color={colors.accent.teal} />
                                </View>
                                <View style={styles.statTexts}>
                                    <Text style={[styles.statLabelSm, { color: colors.glass.text.muted }]}>Gelir</Text>
                                    <Text style={[styles.statValueSm, { color: colors.glass.text.primary }]} numberOfLines={1}>{formatCurrency(income)}</Text>
                                </View>
                            </View>

                            <View style={[styles.statDivider, { backgroundColor: colors.glass.border.subtle }]} />

                            <View style={styles.overviewStatRow}>
                                <View style={[styles.miniIcon, { backgroundColor: `${colors.accent.red}15` }]}>
                                    <Ionicons name="arrow-up" size={16} color={colors.accent.red} />
                                </View>
                                <View style={styles.statTexts}>
                                    <Text style={[styles.statLabelSm, { color: colors.glass.text.muted }]}>Gider</Text>
                                    <Text style={[styles.statValueSm, { color: colors.glass.text.primary }]} numberOfLines={1}>{formatCurrency(expense)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </GlassCard>

                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.glass.text.primary }]}>Kategori Dağılımı</Text>
                </View>

                {(categories || []).filter(c => c.type === 'expense').slice(0, 4).map((cat) => (
                    <GlassCard key={cat.id} style={styles.categoryRow} variant="subtle">
                        <View style={styles.categoryInfo}>
                            <View style={styles.categoryNameContainer}>
                                <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                                <Text style={[styles.categoryName, { color: colors.glass.text.primary }]}>{cat.name}</Text>
                            </View>
                            <Text style={[styles.categoryAmount, { color: colors.glass.text.secondary }]}>{formatCurrency(Math.random() * 5000)}</Text>
                        </View>
                        <View style={[styles.progressBack, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                            <LinearGradient
                                colors={[cat.color || colors.primary.brand, `${cat.color || colors.primary.brand}88`]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.progressFill, { width: `${10 + Math.random() * 80}%` }]}
                            />
                        </View>
                    </GlassCard>
                ))}

                <GlassCard style={styles.aiInsight} variant="elevated">
                    <Ionicons name="sparkles" size={24} color={colors.accent.amber} />
                    <Text style={[styles.aiTitle, { color: colors.accent.amber }]}>AI Analizi</Text>
                    <Text style={[styles.aiText, { color: colors.glass.text.secondary }]}>
                        Bu ay dışarıda yemek harcamaların normalden %20 daha fazla. Evde yemek yiyerek yaklaşık ₺1.200 tasarruf edebilirsin.
                    </Text>
                </GlassCard>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 120,
    },
    title: {
        fontFamily: FONTS.family.bold,
        fontSize: 28,
        letterSpacing: -0.5,
        marginBottom: 24,
    },
    overviewCard: {
        padding: 20,
        marginBottom: 24,
    },
    overviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    overviewTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 18,
    },
    savingsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    savingsBadgeText: {
        fontFamily: FONTS.family.bold,
        fontSize: 12,
    },
    overviewContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
    },
    overviewChart: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartCenter: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80, // Prevent overlapping
    },
    chartCenterText: {
        fontFamily: FONTS.family.medium,
        fontSize: 10,
        textTransform: 'uppercase',
    },
    chartCenterValue: {
        fontFamily: FONTS.family.bold,
        fontSize: 14,
        marginTop: 2,
    },
    overviewStats: {
        flex: 1,
        gap: 12,
    },
    overviewStatRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    miniIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statTexts: {
        flex: 1,
    },
    statLabelSm: {
        fontFamily: FONTS.family.medium,
        fontSize: 11,
        marginBottom: 2,
    },
    statValueSm: {
        fontFamily: FONTS.family.bold,
        fontSize: 16,
    },
    statDivider: {
        height: 1,
        width: '100%',
        marginVertical: 4,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 20,
        letterSpacing: -0.5,
    },
    categoryRow: {
        padding: 14,
        paddingBottom: 22,
        marginBottom: 10,
    },
    categoryInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    categoryNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    categoryEmoji: {
        fontSize: 16,
    },
    categoryName: {
        fontFamily: FONTS.family.bold,
        fontSize: 14,
    },
    categoryAmount: {
        fontFamily: FONTS.family.medium,
        fontSize: 13,
    },
    progressBack: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    aiInsight: {
        marginTop: 20,
        padding: 20,
        gap: 8,
    },
    aiTitle: {
        fontFamily: FONTS.family.extraBold,
        fontSize: 16,
    },
    aiText: {
        fontFamily: FONTS.family.regular,
        fontSize: 14,
        lineHeight: 22,
    }
});
