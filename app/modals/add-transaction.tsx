import { GlassButton, GlassCard, GlassInput } from '@/components/ui';
import { useFinanceStore } from '@/stores/financeStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddTransactionModal() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { type: initialType, id } = useLocalSearchParams<{ type: 'income' | 'expense', id?: string }>();
    const { colors, isDark } = useTheme();
    const { addTransaction, updateTransaction, deleteTransaction, transactions, categories } = useFinanceStore();

    const existingTx = React.useMemo(() => id ? transactions.find(t => t.id === id) : null, [id, transactions]);

    const [type, setType] = useState<'income' | 'expense'>((initialType as any) === 'income' ? 'income' : 'expense');
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const filteredCategories = (categories || []).filter(c => c.type === type || c.type === 'both');
    const [categoryId, setCategoryId] = useState(filteredCategories[0]?.id || 'other');

    useEffect(() => {
        if (existingTx) {
            setType(existingTx.type);
            setAmount(existingTx.amount.toString());
            setTitle(existingTx.title);
            setCategoryId(existingTx.categoryId);
        } else if (initialType === 'income' || initialType === 'expense') {
            setType(initialType);
        }
    }, [initialType, existingTx]);

    useEffect(() => {
        if (!existingTx && filteredCategories.length > 0 && !filteredCategories.find(c => c.id === categoryId)) {
            setCategoryId(filteredCategories[0].id);
        }
    }, [type, filteredCategories, existingTx]);

    const handleSave = () => {
        if (!amount || !title) return;

        if (existingTx) {
            updateTransaction(existingTx.id, {
                type,
                amount: parseFloat(amount.replace(',', '.')),
                title,
                categoryId,
            });
        } else {
            addTransaction({
                type,
                amount: parseFloat(amount.replace(',', '.')),
                title,
                categoryId,
                date: Date.now(),
                recurrence: 'none',
            });
        }

        router.back();
    };

    const handleDelete = () => {
        if (!existingTx) return;
        Alert.alert(
            "İşlemi Sil",
            "Bu işlemi tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
            [
                { text: "İptal", style: "cancel" },
                {
                    text: "Evet, Sil",
                    style: "destructive",
                    onPress: () => {
                        deleteTransaction(existingTx.id);
                        router.back();
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Animated.View
                entering={FadeIn.duration(300)}
                style={StyleSheet.absoluteFill}
            >
                <BlurView
                    intensity={Platform.OS === 'ios' ? 40 : 100}
                    tint={isDark ? "dark" : "light"}
                    style={StyleSheet.absoluteFill}
                />
                <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()} />
            </Animated.View>

            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                style={styles.keyboardView}
                pointerEvents="box-none"
            >
                <Animated.View
                    entering={SlideInDown.springify().damping(25).stiffness(200).mass(0.8)}
                    style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}
                >
                    <GlassCard
                        variant="elevated"
                        intensity={40}
                        style={styles.glassCard}
                        contentStyle={{ padding: 0 }}
                    >
                        <View style={styles.header}>
                            <View style={styles.headerIndicator} />
                            <View style={styles.headerRow}>
                                <Text style={[styles.headerTitle, { color: colors.glass.text.primary }]}>
                                    {existingTx ? 'İşlemi Düzenle' : 'Yeni İşlem'}
                                </Text>
                                <Pressable onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: colors.glass.surface.secondary }]}>
                                    <Ionicons name="close" size={20} color={colors.glass.text.primary} />
                                </Pressable>
                            </View>
                        </View>

                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={[styles.typeToggle, { backgroundColor: colors.glass.surface.secondary }]}>
                                <Pressable
                                    onPress={() => setType('expense')}
                                    style={[styles.toggleBtn, type === 'expense' && { backgroundColor: colors.accent.red }]}
                                >
                                    <Ionicons name="remove-circle" size={18} color={type === 'expense' ? '#FFFFFF' : colors.accent.red} />
                                    <Text style={[styles.toggleText, { color: colors.glass.text.secondary }, type === 'expense' && { color: '#FFFFFF' }]}>Gider</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => setType('income')}
                                    style={[styles.toggleBtn, type === 'income' && { backgroundColor: colors.accent.teal }]}
                                >
                                    <Ionicons name="add-circle" size={18} color={type === 'income' ? '#FFFFFF' : colors.accent.teal} />
                                    <Text style={[styles.toggleText, { color: colors.glass.text.secondary }, type === 'income' && { color: '#FFFFFF' }]}>Gelir</Text>
                                </Pressable>
                            </View>

                            <View style={styles.amountSection}>
                                <Text style={[styles.label, { color: colors.glass.text.muted }]}>Tutar</Text>
                                <View style={styles.amountWrapper}>
                                    <Text style={[styles.currencySymbol, { color: colors.glass.text.muted }]}>₺</Text>
                                    <GlassInput
                                        placeholder="0,00"
                                        keyboardType="numeric"
                                        value={amount}
                                        onChangeText={setAmount}
                                        containerStyle={styles.amountInputContainer}
                                        inputStyle={[styles.amountInput, { color: colors.glass.text.primary, paddingHorizontal: 16 }]}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputSection}>
                                <Text style={[styles.label, { color: colors.glass.text.muted }]}>Açıklama</Text>
                                <GlassInput
                                    placeholder="Örn: Market harcaması"
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>

                            <View style={styles.categorySection}>
                                <Text style={[styles.label, { color: colors.glass.text.muted }]}>Kategori Seçin</Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.categoryScroll}
                                    contentContainerStyle={styles.categoryScrollContent}
                                >
                                    <Pressable
                                        onPress={() => router.push({ pathname: '/modals/add-category', params: { type } } as any)}
                                        style={[
                                            styles.categoryItem,
                                            { backgroundColor: colors.glass.surface.secondary, borderColor: colors.glass.border.subtle, borderStyle: 'dashed' }
                                        ]}
                                    >
                                        <Ionicons name="add" size={20} color={colors.primary.brand} />
                                        <Text style={[styles.catName, { color: colors.primary.brand }]}>Yeni</Text>
                                    </Pressable>

                                    {filteredCategories.map((cat) => (
                                        <Pressable
                                            key={cat.id}
                                            onPress={() => setCategoryId(cat.id)}
                                            style={[
                                                styles.categoryItem,
                                                { backgroundColor: colors.glass.surface.secondary, borderColor: colors.glass.border.subtle },
                                                categoryId === cat.id && { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(108, 60, 225, 0.08)', borderColor: colors.primary.brand }
                                            ]}
                                        >
                                            <View style={[styles.catIconContainer, { backgroundColor: `${cat.color}20` }]}>
                                                {cat.icon.length > 2 ? (
                                                    <Ionicons name={cat.icon as any} size={18} color={cat.color} />
                                                ) : (
                                                    <Text style={styles.catEmoji}>{cat.icon}</Text>
                                                )}
                                            </View>
                                            <Text style={[styles.catName, { color: colors.glass.text.primary }]}>{cat.name}</Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </View>

                            <View style={styles.footer}>
                                <GlassButton
                                    title={existingTx ? "Değişiklikleri Kaydet" : "İşlemi Kaydet"}
                                    onPress={handleSave}
                                    variant="primary"
                                    disabled={!amount || !title}
                                    style={styles.saveBtn}
                                />
                                {existingTx && (
                                    <View style={{ marginTop: 12 }}>
                                        <GlassButton
                                            title="İşlemi Sil"
                                            onPress={handleDelete}
                                            variant="secondary"
                                        />
                                    </View>
                                )}
                            </View>
                        </ScrollView>
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
    keyboardView: {
        width: '100%',
    },
    modalContent: {
        width: '100%',
        paddingHorizontal: 16,
    },
    glassCard: {
        borderRadius: 40,
        overflow: 'hidden',
    },
    header: {
        paddingTop: 12,
        paddingBottom: 8,
        alignItems: 'center',
    },
    headerIndicator: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    headerTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 20,
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 24,
    },
    typeToggle: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
        borderRadius: 18,
        padding: 4,
    },
    toggleBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        borderRadius: 14,
        gap: 6,
    },
    toggleText: {
        fontFamily: FONTS.family.bold,
        fontSize: 14,
    },
    label: {
        fontFamily: FONTS.family.bold,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 8,
        marginLeft: 4,
    },
    amountSection: {
        marginBottom: 20,
    },
    amountWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    currencySymbol: {
        fontFamily: FONTS.family.bold,
        fontSize: 32,
    },
    amountInputContainer: {
        flex: 1,
        marginBottom: 0,
    },
    amountInput: {
        fontSize: 36,
        fontFamily: FONTS.family.extraBold,
    },
    inputSection: {
        marginBottom: 24,
    },
    categorySection: {
        marginBottom: 24,
    },
    categoryScroll: {
        marginHorizontal: -24,
    },
    categoryScrollContent: {
        paddingHorizontal: 24,
        paddingVertical: 4,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
        borderWidth: 1,
        marginRight: 8,
        gap: 8,
    },
    catIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    catEmoji: {
        fontSize: 18,
    },
    catName: {
        fontFamily: FONTS.family.semiBold,
        fontSize: 13,
    },
    footer: {
        marginTop: 8,
    },
    saveBtn: {
        height: 56,
        borderRadius: 18,
    }
});
