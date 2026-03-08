import { GlassButton, GlassCard, GlassInput } from '@/components/ui';
import { useFinanceStore } from '@/stores/financeStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICON_OPTIONS = [
    'cart-outline', 'fast-food-outline', 'bus-outline', 'medical-outline',
    'game-controller-outline', 'home-outline', 'phone-portable-outline', 'shirt-outline',
    'book-outline', 'cash-outline', 'laptop-outline', 'trending-up-outline',
    'gift-outline', 'sparkles-outline', 'airplane-outline', 'paw-outline',
    'brush-outline', 'fitness-outline', 'cafe-outline', 'restaurant-outline',
    'car-sport-outline', 'subway-outline', 'bicycle-outline', 'briefcase-outline'
];
const COLOR_OPTIONS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#88D8B0', '#FFEAA7', '#DDA0DD', '#F0A500', '#B8B8D1', '#00D2FF', '#38EF7D', '#FFD700', '#FF9FF3', '#B8B8B8', '#6C3CE1'];

export default function AddCategoryModal() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useTheme();
    const { type } = useLocalSearchParams<{ type: 'income' | 'expense' }>();
    const addCategory = useFinanceStore((state) => state.addCategory);

    const [name, setName] = useState('');
    const [icon, setIcon] = useState('grid-outline');
    const [color, setColor] = useState('#B8B8B8');

    const handleSave = () => {
        if (!name) return;
        addCategory({
            name,
            icon,
            color,
            type: type || 'expense'
        });
        router.back();
    };

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeIn.duration(300)} style={StyleSheet.absoluteFill}>
                <BlurView intensity={Platform.OS === 'ios' ? 40 : 100} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
                <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()} />
            </Animated.View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <Animated.View
                    entering={SlideInDown.springify().damping(25).stiffness(200)}
                    style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}
                    pointerEvents="box-none"
                >
                    <GlassCard variant="elevated" intensity={40} style={styles.glassCard} contentStyle={{ padding: 0 }}>
                        <View style={styles.header}>
                            <View style={styles.headerIndicator} />
                            <View style={styles.headerRow}>
                                <Text style={[styles.headerTitle, { color: colors.glass.text.primary }]}>
                                    Yeni {type === 'income' ? 'Gelir' : 'Gider'} Kategorisi
                                </Text>
                                <Pressable onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: colors.glass.surface.secondary }]}>
                                    <Ionicons name="close" size={20} color={colors.glass.text.primary} />
                                </Pressable>
                            </View>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            <View style={styles.inputSection}>
                                <Text style={[styles.label, { color: colors.glass.text.muted }]}>Kategori Adı</Text>
                                <GlassInput
                                    placeholder="Örn: Market"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>

                            <View style={styles.section}>
                                <Text style={[styles.label, { color: colors.glass.text.muted }]}>İkon Seçimi</Text>
                                <View style={styles.emojiGrid}>
                                    {ICON_OPTIONS.map((e) => (
                                        <Pressable
                                            key={e}
                                            onPress={() => setIcon(e)}
                                            style={[
                                                styles.emojiOption,
                                                { backgroundColor: colors.glass.surface.secondary },
                                                icon === e && { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderColor: colors.primary.brand, borderWidth: 1 }
                                            ]}
                                        >
                                            <Ionicons name={e as any} size={22} color={icon === e ? colors.primary.brand : colors.glass.text.secondary} />
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={[styles.label, { color: colors.glass.text.muted }]}>Renk Seçimi</Text>
                                <View style={styles.colorGrid}>
                                    {COLOR_OPTIONS.map((c) => (
                                        <Pressable
                                            key={c}
                                            onPress={() => setColor(c)}
                                            style={[
                                                styles.colorOption,
                                                { backgroundColor: c },
                                                color === c && { borderWidth: 2, borderColor: colors.glass.text.primary }
                                            ]}
                                        />
                                    ))}
                                </View>
                            </View>

                            <View style={styles.footer}>
                                <GlassButton
                                    title="Kategoriyi Kaydet"
                                    onPress={handleSave}
                                    variant="primary"
                                    disabled={!name}
                                />
                            </View>
                        </ScrollView>
                    </GlassCard>
                </Animated.View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-end' },
    keyboardView: { width: '100%' },
    modalContent: { width: '100%', paddingHorizontal: 16 },
    glassCard: { borderRadius: 40, overflow: 'hidden' },
    header: { paddingTop: 12, paddingBottom: 8, alignItems: 'center' },
    headerIndicator: { width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)', marginBottom: 16 },
    headerRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24 },
    headerTitle: { fontFamily: FONTS.family.bold, fontSize: 20 },
    closeBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 24 },
    inputSection: { marginBottom: 24 },
    section: { marginBottom: 24 },
    label: { fontFamily: FONTS.family.bold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
    emojiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 4
    },
    emojiOption: {
        width: '18%', // 5 columns with space
        aspectRatio: 1,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        marginTop: 4
    },
    colorOption: {
        width: '18%', // 5 columns with space
        aspectRatio: 1,
        borderRadius: 20,
        marginBottom: 12
    },
    footer: { marginTop: 12, marginBottom: 40 }
});
