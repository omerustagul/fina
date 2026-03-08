import { GlassButton, GlassCard } from '@/components/ui';
import { useCreditCardStore } from '@/stores/creditCardStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { formatCurrency } from '@/utils/currency';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CardsScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { cards, getTotalDebt, getTotalLimit, getTotalUtilization } = useCreditCardStore();

    const totalDebt = getTotalDebt();
    const totalLimit = getTotalLimit();
    const utilization = getTotalUtilization();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.primary.deep }]} edges={['top']}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Pressable onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
                        <Ionicons name="arrow-back" size={28} color={colors.glass.text.primary} />
                    </Pressable>
                    <Text style={[styles.title, { color: colors.glass.text.primary }]}>Findeks Yönetimi</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Summary Strip */}
                <GlassCard variant="elevated" style={styles.summaryCard} contentStyle={{ padding: 16 }}>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryLabel, { color: colors.glass.text.secondary }]}>Toplam Borç</Text>
                            <Text style={[styles.summaryValue, { color: colors.accent.red }]}>
                                {formatCurrency(totalDebt)}
                            </Text>
                        </View>
                        <View style={[styles.summaryDivider, { backgroundColor: colors.glass.border.subtle }]} />
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryLabel, { color: colors.glass.text.secondary }]}>Toplam Limit</Text>
                            <Text style={[styles.summaryValue, { color: colors.glass.text.primary }]}>
                                {formatCurrency(totalLimit)}
                            </Text>
                        </View>
                        <View style={[styles.summaryDivider, { backgroundColor: colors.glass.border.subtle }]} />
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryLabel, { color: colors.glass.text.secondary }]}>Kullanım</Text>
                            <Text style={[
                                styles.summaryValue,
                                { color: utilization > 80 ? colors.accent.red : utilization > 50 ? '#F0A500' : colors.accent.teal }
                            ]}>
                                %{utilization.toFixed(1)}
                            </Text>
                        </View>
                    </View>
                </GlassCard>

                {/* AI Simulator Preview */}
                <GlassCard variant="subtle" style={styles.aiCard} contentStyle={{ padding: 16 }}>
                    <View style={styles.aiHeader}>
                        <Ionicons name="sparkles" size={20} color={colors.accent.purple} />
                        <Text style={[styles.aiTitle, { color: colors.glass.text.primary }]}>Findeks Simülatörü</Text>
                    </View>
                    <Text style={[styles.aiDescription, { color: colors.glass.text.secondary }]}>
                        Akıllı ödeme planını oluşturarak kredi notunu en hızlı nasıl yükseltebileceğini öğren.
                    </Text>
                    <Pressable style={styles.aiBtn} onPress={() => router.push('/modals/payment-plan' as any)}>
                        <Text style={[styles.aiBtnText, { color: colors.accent.purple }]}>Planı Oluştur →</Text>
                    </Pressable>
                </GlassCard>

                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.glass.text.primary }]}>Kartlarım</Text>
                </View>

                {cards.length === 0 ? (
                    <View style={[styles.emptyState, { borderColor: colors.glass.border.default }]}>
                        <Ionicons name="card-outline" size={48} color={colors.glass.text.muted} />
                        <Text style={[styles.emptyText, { color: colors.glass.text.primary }]}>Henüz kart eklemediniz.</Text>
                        <Text style={[styles.emptySubtext, { color: colors.glass.text.secondary }]}>Tüm kredi kartlarınızı buradan yönetebilir ve takip edebilirsiniz.</Text>
                    </View>
                ) : (
                    cards.map(card => {
                        const cardUtil = (card.currentDebt / card.creditLimit) * 100;
                        const dueDate = new Date(card.paymentDueDate);
                        const isClose = dueDate.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;

                        return (
                            <Pressable key={card.id} onPress={() => router.push({ pathname: '/modals/card-detail', params: { id: card.id } } as any)}>
                                <GlassCard variant="elevated" style={styles.cardItem} contentStyle={{ padding: 0, flexDirection: 'row' }}>
                                    <View style={[styles.cardColorStrip, { backgroundColor: card.color }]}>
                                        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.15)' }]} />
                                    </View>

                                    <View style={styles.cardContent}>
                                        <View style={styles.cardHeaderRow}>
                                            <View>
                                                <Text style={[styles.bankName, { color: colors.glass.text.primary }]}>{card.bankName}</Text>
                                                <Text style={[styles.cardName, { color: colors.glass.text.secondary }]}>
                                                    {card.cardName || 'Kredi Kartı'} •••• {card.lastFourDigits || '****'}
                                                </Text>
                                            </View>
                                            {card.cardNetwork === 'troy' ? (
                                                <MaterialCommunityIcons name="credit-card-outline" size={28} color={card.color} />
                                            ) : (
                                                <FontAwesome5
                                                    name={card.cardNetwork === 'visa' ? 'cc-visa' : card.cardNetwork === 'mastercard' ? 'cc-mastercard' : 'cc-amex'}
                                                    size={28}
                                                    color={card.color}
                                                />
                                            )}
                                        </View>

                                        <View style={styles.cardDetailRow}>
                                            <View style={styles.cardMetric}>
                                                <Text style={[styles.metricLabel, { color: colors.glass.text.muted }]}>Borç</Text>
                                                <Text style={[styles.metricValue, { color: colors.glass.text.primary }]}>{formatCurrency(card.currentDebt)}</Text>
                                            </View>
                                            <View style={styles.cardMetric}>
                                                <Text style={[styles.metricLabel, { color: colors.glass.text.muted }]}>Son Ödeme</Text>
                                                <Text style={[styles.metricValue, { color: isClose ? colors.accent.red : colors.glass.text.primary }]}>
                                                    {format(dueDate, 'dd/MM/yyyy')}
                                                </Text>
                                            </View>
                                            <View style={styles.cardMetric}>
                                                <Text style={[styles.metricLabel, { color: colors.glass.text.muted }]}>Asgari</Text>
                                                <Text style={[styles.metricValue, { color: colors.accent.teal }]}>{formatCurrency(card.minimumPayment)}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.progressContainer}>
                                            <View style={[styles.progressBarBg, { backgroundColor: colors.glass.border.default }]}>
                                                <View style={[styles.progressBarFill, {
                                                    width: `${Math.min(cardUtil, 100)}%`,
                                                    backgroundColor: cardUtil > 80 ? colors.accent.red : cardUtil > 50 ? '#F0A500' : colors.accent.teal
                                                }]} />
                                            </View>
                                            <Text style={[styles.progressText, { color: colors.glass.text.muted }]}>
                                                % {cardUtil.toFixed(0)} Kullanım
                                            </Text>
                                        </View>
                                    </View>
                                </GlassCard>
                            </Pressable>
                        )
                    })
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={[styles.fabContainer, { bottom: Math.max(insets.bottom + 20, 20) }]}>
                <GlassButton
                    title="Yeni Kart Ekle"
                    variant="primary"
                    style={styles.fab}
                    onPress={() => router.push('/modals/add-card' as any)}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    title: {
        fontFamily: FONTS.family.bold,
        fontSize: 28,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    summaryCard: {
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryDivider: {
        width: 1,
        height: 30,
    },
    summaryLabel: {
        fontFamily: FONTS.family.medium,
        fontSize: 12,
        marginBottom: 4,
    },
    summaryValue: {
        fontFamily: FONTS.family.bold,
        fontSize: 18,
    },
    aiCard: {
        marginBottom: 24,
    },
    aiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    aiTitle: {
        fontFamily: FONTS.family.semiBold,
        fontSize: 16,
        marginLeft: 8,
    },
    aiDescription: {
        fontFamily: FONTS.family.regular,
        fontSize: 14,
        marginBottom: 12,
    },
    aiBtn: {
        alignSelf: 'flex-start',
    },
    aiBtnText: {
        fontFamily: FONTS.family.bold,
        fontSize: 14,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: FONTS.family.semiBold,
        fontSize: 18,
    },
    cardItem: {
        marginBottom: 16,
        overflow: 'hidden',
    },
    cardColorStrip: {
        width: 4,
        height: '100%',
    },
    cardContent: {
        flex: 1,
        padding: 16,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    bankName: {
        fontFamily: FONTS.family.bold,
        fontSize: 16,
    },
    cardName: {
        fontFamily: FONTS.family.regular,
        fontSize: 13,
        marginTop: 2,
    },
    cardDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    cardMetric: {
        flex: 1,
    },
    metricLabel: {
        fontFamily: FONTS.family.medium,
        fontSize: 11,
        marginBottom: 4,
    },
    metricValue: {
        fontFamily: FONTS.family.semiBold,
        fontSize: 14,
    },
    progressContainer: {
        width: '100%',
    },
    progressBarBg: {
        height: 6,
        borderRadius: 3,
        width: '100%',
        overflow: 'hidden',
        marginBottom: 6,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontFamily: FONTS.family.medium,
        fontSize: 11,
        textAlign: 'right',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 24,
        marginTop: 20,
    },
    emptyText: {
        fontFamily: FONTS.family.bold,
        fontSize: 16,
        marginTop: 16,
    },
    emptySubtext: {
        fontFamily: FONTS.family.regular,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
    fabContainer: {
        position: 'absolute',
        right: 20,
        left: 20,
    },
    fab: {
        borderRadius: 16,
    }
});
