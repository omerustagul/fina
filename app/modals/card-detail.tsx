import { GlassCard } from '@/components/ui';
import { useCreditCardStore } from '@/stores/creditCardStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { formatCurrency } from '@/utils/currency';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CardDetailModal() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors, isDark } = useTheme();

    const { cards, deleteCard } = useCreditCardStore();

    const card = useMemo(() => cards.find(c => c.id === id), [id, cards]);

    if (!card) {
        return (
            <View style={[styles.container, { backgroundColor: colors.primary.deep }]}>
                <Text>Kart bulunamadı.</Text>
            </View>
        );
    }

    const cardUtil = (card.currentDebt / card.creditLimit) * 100;
    const isHighUtil = cardUtil > 80;
    const isMediumUtil = cardUtil > 50;
    const utilColor = isHighUtil ? colors.accent.red : isMediumUtil ? '#F0A500' : colors.accent.teal;

    const handleDelete = () => {
        Alert.alert(
            "Kartı Sil",
            "Bu kredi kartını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
            [
                { text: "İptal", style: "cancel" },
                {
                    text: "Sil",
                    style: "destructive",
                    onPress: () => {
                        deleteCard(card.id);
                        router.back();
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeIn.duration(300)} style={StyleSheet.absoluteFill}>
                <BlurView
                    intensity={Platform.OS === 'ios' ? 40 : 100}
                    tint={isDark ? "dark" : "light"}
                    style={StyleSheet.absoluteFill}
                />
                <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()} />
            </Animated.View>

            <Animated.View
                entering={SlideInDown.duration(200)}
                style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}
                pointerEvents="box-none"
            >
                <GlassCard variant="elevated" intensity={40} style={styles.glassCard} contentStyle={{ padding: 0 }}>
                    <View style={styles.header}>
                        <View style={styles.headerIndicator} />
                        <View style={styles.headerRow}>
                            <Text style={[styles.headerTitle, { color: colors.glass.text.primary }]}>Kart Detayı</Text>
                            <Pressable onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: colors.glass.surface.secondary }]}>
                                <Ionicons name="close" size={20} color={colors.glass.text.primary} />
                            </Pressable>
                        </View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                        {/* THE 3D CARD VISUAL */}
                        <View style={[styles.visualCard, { backgroundColor: card.color }]}>
                            <View style={styles.visualHeader}>
                                <Text style={styles.visualBankName}>{card.bankName}</Text>
                                {card.cardNetwork === 'troy' ? (
                                    <MaterialCommunityIcons name="credit-card-outline" size={36} color="rgba(255,255,255,0.8)" />
                                ) : (
                                    <FontAwesome5
                                        name={card.cardNetwork === 'visa' ? 'cc-visa' : card.cardNetwork === 'mastercard' ? 'cc-mastercard' : 'cc-amex'}
                                        size={36}
                                        color="rgba(255,255,255,0.8)"
                                    />
                                )}
                            </View>
                            <View style={styles.visualBody}>
                                <Text style={styles.visualCardNumber}>••••  ••••  ••••  {card.lastFourDigits || '****'}</Text>
                            </View>
                            <View style={styles.visualFooter}>
                                <View>
                                    <Text style={styles.visualLabel}>Bakiye / Limit</Text>
                                    <Text style={styles.visualValue}>{formatCurrency(card.currentDebt)} / {formatCurrency(card.creditLimit)}</Text>
                                </View>
                            </View>
                            {/* Overlay pattern for aesthetics */}
                            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24 }]} pointerEvents="none" />
                        </View>

                        {/* HIGH LEVEL METRICS */}
                        <View style={styles.metricsRow}>
                            <View style={[styles.metricBox, { backgroundColor: colors.glass.surface.secondary, borderColor: colors.glass.border.default }]}>
                                <Text style={[styles.metricLabel, { color: colors.glass.text.muted }]}>Kullanım</Text>
                                <Text style={[styles.metricValue, { color: utilColor }]}>%{cardUtil.toFixed(1)}</Text>
                            </View>
                            <View style={[styles.metricBox, { backgroundColor: colors.glass.surface.secondary, borderColor: colors.glass.border.default }]}>
                                <Text style={[styles.metricLabel, { color: colors.glass.text.muted }]}>Asgari</Text>
                                <Text style={[styles.metricValue, { color: colors.accent.teal }]}>{formatCurrency(card.minimumPayment)}</Text>
                            </View>
                        </View>

                        {/* STATEMENT DETAILS */}
                        <View style={[styles.section, { borderTopColor: colors.glass.border.default }]}>
                            <Text style={[styles.sectionTitle, { color: colors.glass.text.primary }]}>Hesap Özeti</Text>

                            <View style={styles.detailRow}>
                                <Text style={[styles.detailLabel, { color: colors.glass.text.secondary }]}>Güncel Borç</Text>
                                <Text style={[styles.detailValue, { color: colors.glass.text.primary }]}>{formatCurrency(card.currentDebt)}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={[styles.detailLabel, { color: colors.glass.text.secondary }]}>Hesap Özeti Borcu</Text>
                                <Text style={[styles.detailValue, { color: colors.glass.text.primary }]}>{formatCurrency(card.statementDebt)}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={[styles.detailLabel, { color: colors.glass.text.secondary }]}>Hesap Kesim Tarihi</Text>
                                <Text style={[styles.detailValue, { color: colors.glass.text.primary }]}>
                                    {format(new Date(card.statementClosingDate || Date.now()), 'd MMMM yyyy')}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={[styles.detailLabel, { color: colors.glass.text.secondary }]}>Son Ödeme Tarihi</Text>
                                <Text style={[styles.detailValue, { color: colors.accent.red }]}>
                                    {format(new Date(card.paymentDueDate || Date.now()), 'd MMMM yyyy')}
                                </Text>
                            </View>
                        </View>

                        {/* ACTIONS */}
                        <View style={[styles.section, { borderTopColor: colors.glass.border.default }]}>
                            <Text style={[styles.sectionTitle, { color: colors.glass.text.primary }]}>İşlemler</Text>
                            <Pressable style={styles.actionBtn}>
                                <Ionicons name="document-text-outline" size={24} color={colors.glass.text.primary} />
                                <Text style={[styles.actionBtnText, { color: colors.glass.text.primary }]}>Hesap Özeti Gir</Text>
                            </Pressable>

                            <Pressable style={styles.actionBtn} onPress={() => router.push({ pathname: '/modals/add-card', params: { editId: card.id } } as any)}>
                                <Ionicons name="create-outline" size={24} color={colors.primary.brand} />
                                <Text style={[styles.actionBtnText, { color: colors.primary.brand }]}>Kart Bilgilerini Düzenle</Text>
                            </Pressable>

                            <Pressable style={styles.actionBtn} onPress={handleDelete}>
                                <Ionicons name="trash-outline" size={24} color={colors.accent.red} />
                                <Text style={[styles.actionBtnText, { color: colors.accent.red }]}>Kartı Sil</Text>
                            </Pressable>
                        </View>

                        <View style={{ height: 40 }} />
                    </ScrollView>
                </GlassCard>
            </Animated.View>
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
        maxHeight: '90%',
    },
    glassCard: {
        borderRadius: 40,
        overflow: 'hidden',
        maxHeight: '100%',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
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
    scrollContent: {
        padding: 20,
    },
    visualCard: {
        width: '100%',
        height: 200,
        borderRadius: 24,
        padding: 24,
        justifyContent: 'space-between',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        elevation: 10,
    },
    visualHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    visualBankName: {
        fontFamily: FONTS.family.extraBold,
        fontSize: 20,
        color: '#FFF',
    },
    visualBody: {
        alignItems: 'flex-start',
    },
    visualCardNumber: {
        fontFamily: FONTS.family.semiBold,
        fontSize: 22,
        letterSpacing: 4,
        color: 'rgba(255,255,255,0.9)',
    },
    visualFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    visualLabel: {
        fontFamily: FONTS.family.medium,
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        textTransform: 'uppercase',
    },
    visualValue: {
        fontFamily: FONTS.family.bold,
        fontSize: 15,
        color: '#FFF',
        marginTop: 2,
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    metricBox: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    metricLabel: {
        fontFamily: FONTS.family.medium,
        fontSize: 12,
    },
    metricValue: {
        fontFamily: FONTS.family.bold,
        fontSize: 22,
        marginTop: 4,
    },
    section: {
        borderTopWidth: 1,
        paddingTop: 24,
        marginBottom: 24,
    },
    sectionTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 18,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    detailLabel: {
        fontFamily: FONTS.family.medium,
        fontSize: 14,
    },
    detailValue: {
        fontFamily: FONTS.family.semiBold,
        fontSize: 15,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    actionBtnText: {
        fontFamily: FONTS.family.medium,
        fontSize: 15,
        marginLeft: 12,
    }
});
