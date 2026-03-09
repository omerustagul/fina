import { GlassButton, GlassCard } from '@/components/ui';
import { useCreditCardStore } from '@/stores/creditCardStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { formatCurrency } from '@/utils/currency';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function InspectPlanModal() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useTheme();

    const { activePlan, togglePaymentStatus, cards, clearPlan } = useCreditCardStore();

    if (!activePlan) {
        return null;
    }

    const totalPaid = activePlan.items.filter(i => i.isPaid).length;
    const totalItems = activePlan.items.length;
    const progress = totalPaid / totalItems;

    const handleComplete = () => {
        // Option to clear or just exit
        router.back();
    };

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeIn.duration(300)} style={StyleSheet.absoluteFill}>
                <BlurView intensity={Platform.OS === 'ios' ? 40 : 100} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
                <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()} />
            </Animated.View>

            <Animated.View
                entering={SlideInDown.springify().damping(25).stiffness(200)}
                style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 20) }]}
            >
                <GlassCard variant="elevated" intensity={40} style={styles.glassCard} contentStyle={{ padding: 0 }}>
                    <View style={styles.header}>
                        <View style={styles.headerIndicator} />
                        <View style={styles.headerRow}>
                            <Text style={[styles.headerTitle, { color: colors.glass.text.primary }]}>Plan Detayları</Text>
                            <Pressable
                                onPress={() => router.back()}
                                style={[styles.closeBtn, { backgroundColor: colors.glass.surface.secondary }]}
                            >
                                <Ionicons name="close" size={22} color={colors.glass.text.primary} />
                            </Pressable>
                        </View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                        <View style={styles.progressSection}>
                            <View style={styles.progressHeader}>
                                <Text style={[styles.progressTitle, { color: colors.glass.text.primary }]}>İlerleme</Text>
                                <Text style={[styles.progressStats, { color: colors.accent.teal }]}>
                                    {totalPaid} / {totalItems} Ödeme
                                </Text>
                            </View>
                            <View style={[styles.progressBarBg, { backgroundColor: colors.glass.border.default }]}>
                                <Animated.View
                                    style={[
                                        styles.progressBarFill,
                                        { width: `${progress * 100}%`, backgroundColor: colors.accent.teal }
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.planItemsContainer}>
                            {activePlan.items.map((item, index) => {
                                const card = cards.find(c => c.id === item.cardId);
                                if (!card) return null;

                                return (
                                    <View
                                        key={item.cardId}
                                        style={[
                                            styles.planItem,
                                            {
                                                borderColor: colors.glass.border.subtle,
                                                opacity: item.isPaid ? 0.6 : 1
                                            }
                                        ]}
                                    >
                                        <View style={styles.itemHeader}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                                <View style={[styles.cardIconBox, { backgroundColor: `${card.color}15` }]}>
                                                    {card.cardNetwork === 'troy' ? (
                                                        <MaterialCommunityIcons name="credit-card-outline" size={20} color={card.color} />
                                                    ) : (
                                                        <FontAwesome5
                                                            name={card.cardNetwork === 'visa' ? 'cc-visa' : card.cardNetwork === 'mastercard' ? 'cc-mastercard' : 'cc-amex'}
                                                            size={20}
                                                            color={card.color}
                                                        />
                                                    )}
                                                </View>
                                                <View>
                                                    <Text style={[styles.bankName, { color: colors.glass.text.primary }]}>{card.bankName}</Text>
                                                    <Text style={[styles.planAmount, { color: colors.glass.text.secondary }]}>{formatCurrency(item.amount)}</Text>
                                                </View>
                                            </View>

                                            <Pressable
                                                onPress={() => togglePaymentStatus(item.cardId)}
                                                style={[
                                                    styles.checkBtn,
                                                    {
                                                        backgroundColor: item.isPaid ? colors.accent.teal : 'transparent',
                                                        borderColor: item.isPaid ? colors.accent.teal : colors.glass.border.strong
                                                    }
                                                ]}
                                            >
                                                {item.isPaid && <Ionicons name="checkmark" size={16} color="#FFF" />}
                                            </Pressable>
                                        </View>

                                        <View style={[styles.reasonBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }]}>
                                            <Text style={[styles.reasonText, { color: colors.glass.text.muted }]}>
                                                {item.reason}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>

                        {activePlan.status === 'completed' && (
                            <Animated.View entering={FadeIn} style={[styles.congratsBox, { backgroundColor: `${colors.accent.teal}10`, borderColor: colors.accent.teal }]}>
                                <Ionicons name="trophy" size={24} color={colors.accent.teal} />
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.congratsTitle, { color: colors.glass.text.primary }]}>Harika İş!</Text>
                                    <Text style={[styles.congratsText, { color: colors.glass.text.secondary }]}>
                                        Planı başarıyla tamamladın. Findeks notun olumlu yönde etkilenmeye başladı bile!
                                    </Text>
                                </View>
                            </Animated.View>
                        )}
                    </ScrollView>

                    <View style={styles.footer}>
                        {activePlan.status === 'completed' ? (
                            <GlassButton
                                title="Planı Kapat"
                                variant="primary"
                                onPress={() => {
                                    clearPlan();
                                    router.back();
                                }}
                                style={{ flex: 1 }}
                            />
                        ) : (
                            <>
                                <GlassButton
                                    title="Vazgeç"
                                    variant="secondary"
                                    onPress={() => {
                                        clearPlan();
                                        router.back();
                                    }}
                                    style={{ flex: 1, marginRight: 8 }}
                                />
                                <GlassButton
                                    title="Devam Et"
                                    variant="primary"
                                    onPress={() => router.back()}
                                    style={{ flex: 1 }}
                                />
                            </>
                        )}
                    </View>
                </GlassCard>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-end' },
    modalContent: { width: '100%', paddingHorizontal: 12 },
    glassCard: { borderRadius: 40, overflow: 'hidden', maxHeight: '85%' },
    header: { paddingTop: 16, paddingBottom: 8, alignItems: 'center' },
    headerIndicator: { width: 40, height: 5, borderRadius: 2.5, backgroundColor: 'rgba(255, 255, 255, 0.25)', marginBottom: 16 },
    headerRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 12 },
    headerTitle: { fontFamily: FONTS.family.bold, fontSize: 18 },
    closeBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    content: { padding: 24, paddingTop: 4 },
    progressSection: { marginBottom: 24 },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    progressTitle: { fontFamily: FONTS.family.semiBold, fontSize: 15 },
    progressStats: { fontFamily: FONTS.family.bold, fontSize: 13 },
    progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 4 },
    planItemsContainer: { gap: 16 },
    planItem: { padding: 16, borderRadius: 20, borderWidth: 1 },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    bankName: { fontFamily: FONTS.family.bold, fontSize: 15 },
    planAmount: { fontFamily: FONTS.family.medium, fontSize: 13, marginTop: 2 },
    checkBtn: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
    reasonBox: { marginTop: 12, padding: 10, borderRadius: 10 },
    reasonText: { fontFamily: FONTS.family.medium, fontSize: 11, lineHeight: 16 },
    congratsBox: { marginTop: 24, padding: 16, borderRadius: 20, borderWidth: 1, flexDirection: 'row', gap: 12, alignItems: 'center' },
    congratsTitle: { fontFamily: FONTS.family.bold, fontSize: 16 },
    congratsText: { fontFamily: FONTS.family.regular, fontSize: 13, marginTop: 2 },
    footer: { padding: 24, flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)' }
});
