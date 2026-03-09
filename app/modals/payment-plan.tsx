import { GlassButton, GlassCard, GlassInput } from '@/components/ui';
import { useCreditCardStore } from '@/stores/creditCardStore';
import { useFinanceStore } from '@/stores/financeStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { formatCurrency } from '@/utils/currency';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaymentPlanModal() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useTheme();

    const { cards, getTotalMinimumPayment } = useCreditCardStore();
    const { getTotalIncome, getTotalExpense } = useFinanceStore();

    // Default calculated budget
    const defaultBudget = Math.max(0, getTotalIncome() - getTotalExpense());
    const [budgetInput, setBudgetInput] = useState(defaultBudget > 0 ? defaultBudget.toString() : '');

    const [isCalculated, setIsCalculated] = useState(false);
    const [plan, setPlan] = useState<{ cardId: string; amount: number; reason: string; isPaid: boolean }[]>([]);
    const setActivePlan = useCreditCardStore((state) => state.setActivePlan);

    const totalMinPayment = typeof getTotalMinimumPayment === 'function' ? getTotalMinimumPayment() : cards.reduce((sum, c) => sum + (c.minimumPayment || 0), 0);

    const handleCalculate = () => {
        const budget = parseFloat(budgetInput) || 0;

        if (budget < totalMinPayment && cards.length > 0) {
            Alert.alert("Yetersiz Bütçe", `Tüm asgari ödemeleri karşılamak için en az ${formatCurrency(totalMinPayment)} bütçe ayırmalısınız.`);
            return;
        }

        // Fina AI Findeks Algorithm Algorithm
        // 1. Pay minimums first to avoid legal issues & rating drop
        // 2. Extra budget -> goes to cards with Highest utilization (>80%)
        // 3. Then cards with Highest Interest Rate (Simplified here as random or Highest debt)

        let remainingBudget = budget;
        let tempPlan: Record<string, number> = {};
        let tempReasons: Record<string, string> = {};

        // 1. Minimums
        const mutableCards = cards.map(c => ({
            ...c,
            remainingDebt: c.currentDebt,
            utilization: c.currentDebt / c.creditLimit
        }));

        mutableCards.forEach(c => {
            let toPay = Math.min(c.minimumPayment, c.remainingDebt);
            if (toPay > remainingBudget) toPay = remainingBudget; // Edge case, though checked earlier

            tempPlan[c.id] = toPay;
            c.remainingDebt -= toPay;
            remainingBudget -= toPay;

            tempReasons[c.id] = "Asgari ödeme (Kredi Notunu Korumak İçin)";
        });

        // 2. High Utilization Cards
        const sortedByUtil = [...mutableCards].sort((a, b) => b.utilization - a.utilization);

        for (const c of sortedByUtil) {
            if (remainingBudget > 0 && c.remainingDebt > 0 && c.utilization > 0.5) {
                // Try to bring utilization below 50%
                const targetDebt = c.creditLimit * 0.49;
                const needToPay = Math.max(0, c.remainingDebt - targetDebt);

                if (needToPay > 0) {
                    const payExtra = Math.min(needToPay, remainingBudget);
                    tempPlan[c.id] += payExtra;
                    c.remainingDebt -= payExtra;
                    remainingBudget -= payExtra;

                    if (c.utilization > 0.8) {
                        tempReasons[c.id] = "Kritik Kullanım Oranı (%80+) düşürme hamlesi";
                    } else {
                        tempReasons[c.id] = "Sağlıklı limit kullanım oranı (%50 altı) için ekstra ödeme";
                    }
                }
            }
        }

        // 3. Distribute remaining to lowest debt (Snowball) or highest debt depending on generic approach
        // Let's do Avalanche: Assuming high debt is bad. Let's just distribute to remaining.
        const sortedByDebt = [...mutableCards].sort((a, b) => b.remainingDebt - a.remainingDebt);
        for (const c of sortedByDebt) {
            if (remainingBudget > 0 && c.remainingDebt > 0) {
                const payExtra = Math.min(c.remainingDebt, remainingBudget);
                tempPlan[c.id] += payExtra;
                c.remainingDebt -= payExtra;
                remainingBudget -= payExtra;

                tempReasons[c.id] = "Borcu hızlı kapatıp limit açmak için ekstra ödeme";
            }
        }

        const finalPlan = cards.filter(c => tempPlan[c.id] > 0).map(c => ({
            cardId: c.id,
            amount: tempPlan[c.id],
            reason: tempReasons[c.id],
            isPaid: false
        }));

        setPlan(finalPlan);
        setIsCalculated(true);
    };

    const handleConfirm = () => {
        setActivePlan(plan);
        router.back();
    };

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeIn.duration(300)} style={StyleSheet.absoluteFill}>
                <Pressable
                    style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)' }]}
                    onPress={() => router.back()}
                />
            </Animated.View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%', flex: 1, justifyContent: 'flex-end' }}>
                <Animated.View
                    entering={SlideInDown.springify().damping(25).stiffness(200)}
                    style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}
                    pointerEvents="box-none"
                >
                    <GlassCard variant="elevated" intensity={40} style={styles.glassCard} contentStyle={{ padding: 20 }}>
                        <View style={styles.header}>
                            <View style={styles.headerIndicator} />
                            <View style={styles.headerRow}>
                                <Text style={[styles.headerTitle, { color: colors.glass.text.primary }]}>AI Ödeme Planı</Text>
                                <Pressable onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: colors.glass.surface.secondary }]}>
                                    <Ionicons name="close" size={20} color={colors.glass.text.primary} />
                                </Pressable>
                            </View>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>

                            {!isCalculated ? (
                                <Animated.View entering={FadeIn}>
                                    <Text style={[styles.title, { color: colors.glass.text.primary }]}>Bütçeni Belirle</Text>
                                    <Text style={[styles.subtitle, { color: colors.glass.text.secondary }]}>
                                        Bu ay kredi kartı ödemeleri için toplam ne kadar ayırabilirsin?
                                    </Text>

                                    <View style={{ marginTop: 24, gap: 16 }}>
                                        <GlassInput
                                            label="Kartlar İçin Ayrılan Bütçe (₺)"
                                            placeholder="0.00"
                                            keyboardType="numeric"
                                            value={budgetInput}
                                            onChangeText={setBudgetInput}
                                        />

                                        <View style={[styles.infoBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', borderColor: colors.glass.border.default }]}>
                                            <Ionicons name="shield-checkmark" size={24} color={colors.accent.teal} />
                                            <Text style={[styles.infoText, { color: colors.glass.text.secondary }]}>
                                                Toplam Asgari Ödeme Gereksinimi: <Text style={{ fontFamily: FONTS.family.bold, color: colors.glass.text.primary }}>{formatCurrency(totalMinPayment)}</Text>
                                            </Text>
                                        </View>
                                    </View>
                                </Animated.View>
                            ) : (
                                <Animated.View entering={FadeIn}>
                                    <View style={styles.successHeader}>
                                        <Ionicons name="sparkles" size={24} color={colors.accent.purple} />
                                        <Text style={[styles.title, { color: colors.glass.text.primary, marginBottom: 0 }]}>Findeks Uyumlu Plan</Text>
                                    </View>
                                    <Text style={[styles.subtitle, { color: colors.glass.text.secondary, marginTop: 8 }]}>
                                        Fina AI senin için kredi notunu en çok artıracak optimum dağılımı yaptı.
                                    </Text>

                                    <View style={{ marginTop: 20 }}>
                                        {plan.map((item, index) => {
                                            const card = cards.find(c => c.id === item.cardId);
                                            if (!card) return null;

                                            return (
                                                <View key={item.cardId} style={[styles.planItem, { borderBottomColor: colors.glass.border.subtle, borderBottomWidth: index !== plan.length - 1 ? 1 : 0 }]}>
                                                    <View style={styles.planCardHeader}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                            {card.cardNetwork === 'troy' ? (
                                                                <MaterialCommunityIcons name="credit-card-outline" size={24} color={card.color} />
                                                            ) : (
                                                                <FontAwesome5
                                                                    name={card.cardNetwork === 'visa' ? 'cc-visa' : card.cardNetwork === 'mastercard' ? 'cc-mastercard' : 'cc-amex'}
                                                                    size={24}
                                                                    color={card.color}
                                                                />
                                                            )}
                                                            <View>
                                                                <Text style={[styles.planBankName, { color: colors.glass.text.primary }]}>{card.bankName}</Text>
                                                                <Text style={[styles.planCardName, { color: colors.glass.text.secondary }]}>•••• {card.lastFourDigits}</Text>
                                                            </View>
                                                        </View>
                                                        <Text style={[styles.planAmount, { color: colors.accent.teal }]}>{formatCurrency(item.amount)}</Text>
                                                    </View>

                                                    <View style={[styles.reasonBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                                                        <Ionicons name="bulb-outline" size={16} color={colors.accent.amber} />
                                                        <Text style={[styles.reasonText, { color: colors.glass.text.secondary }]}>{item.reason}</Text>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </Animated.View>
                            )}
                        </ScrollView>

                        <View style={styles.footer}>
                            {!isCalculated ? (
                                <GlassButton
                                    title="Planı Hesapla"
                                    variant="primary"
                                    onPress={handleCalculate}
                                    style={{ flex: 1 }}
                                />
                            ) : (
                                <>
                                    <GlassButton
                                        title="Tekrar Hesapla"
                                        variant="secondary"
                                        onPress={() => setIsCalculated(false)}
                                        style={{ flex: 1, marginRight: 8 }}
                                    />
                                    <GlassButton
                                        title="Planı Onayla"
                                        variant="primary"
                                        onPress={handleConfirm}
                                        style={{ flex: 1 }}
                                    />
                                </>
                            )}
                        </View>

                    </GlassCard>
                </Animated.View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        width: '100%',
        paddingHorizontal: 8,
    },
    glassCard: {
        borderRadius: 40,
        overflow: 'hidden',
        maxHeight: '90%',
    },
    header: {
        alignItems: 'center',
    },
    headerIndicator: {
        width: 40,
        height: 6,
        borderRadius: 6,
        backgroundColor: 'rgba(150, 150, 150, 0.4)',
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    headerTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 18,
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: FONTS.family.bold,
        fontSize: 24,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: FONTS.family.regular,
        fontSize: 15,
        lineHeight: 22,
    },
    infoBox: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontFamily: FONTS.family.regular,
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(150,150,150,0.1)',
    },
    successHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    planItem: {
        paddingVertical: 16,
    },
    planCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    planBankName: {
        fontFamily: FONTS.family.bold,
        fontSize: 15,
    },
    planCardName: {
        fontFamily: FONTS.family.medium,
        fontSize: 12,
        marginTop: 2,
    },
    planAmount: {
        fontFamily: FONTS.family.extraBold,
        fontSize: 18,
    },
    reasonBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        gap: 8,
    },
    reasonText: {
        flex: 1,
        fontFamily: FONTS.family.medium,
        fontSize: 12,
        lineHeight: 18,
    }
});
