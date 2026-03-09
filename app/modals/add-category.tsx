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
    'car-sport-outline', 'subway-outline', 'bicycle-outline', 'briefcase-outline',
    'american-football-outline', 'barbell-outline', 'build-outline', 'camera-outline',
    'color-palette-outline', 'construct-outline', 'download-outline', 'ear-outline'
];
const COLOR_OPTIONS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#88D8B0',
    '#FFEAA7', '#DDA0DD', '#F0A500', '#B8B8D1', '#00D2FF',
    '#38EF7D', '#FFD700', '#FF9FF3', '#B8B8B8', '#6C3CE1',
    '#FF4757', '#2ED573', '#1E90FF', '#70A1FF', '#5352ED'
];

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
                    style={[styles.modalWrapper, { paddingBottom: Math.max(insets.bottom, 20) }]}
                >
                    <GlassCard variant="elevated" intensity={40} style={styles.glassCard} contentStyle={{ padding: 0 }}>
                        <View style={styles.header}>
                            <View style={styles.headerIndicator} />
                            <View style={styles.headerRow}>
                                <Text style={[styles.headerTitle, { color: colors.glass.text.primary }]}>
                                    Yeni {type === 'income' ? 'Gelir' : 'Gider'} Kategorisi
                                </Text>
                                <Pressable
                                    onPress={() => router.back()}
                                    style={[styles.closeBtn, { backgroundColor: colors.glass.surface.secondary }]}
                                    hitSlop={15}
                                >
                                    <Ionicons name="close" size={22} color={colors.glass.text.primary} />
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.contentContainer}>
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
                                <View style={styles.scrollContainer}>
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        nestedScrollEnabled={true}
                                    >
                                        <View style={styles.grid}>
                                            {ICON_OPTIONS.map((e) => (
                                                <View key={e} style={styles.gridItemContainer}>
                                                    <Pressable
                                                        onPress={() => setIcon(e)}
                                                        style={[
                                                            styles.gridItem,
                                                            { backgroundColor: colors.glass.surface.secondary },
                                                            icon === e && { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)', borderColor: colors.primary.brand, borderWidth: 2 }
                                                        ]}
                                                    >
                                                        <Ionicons name={e as any} size={22} color={icon === e ? colors.primary.brand : colors.glass.text.secondary} />
                                                    </Pressable>
                                                </View>
                                            ))}
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={[styles.label, { color: colors.glass.text.muted }]}>Renk Seçimi</Text>
                                <View style={styles.scrollContainer}>
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        nestedScrollEnabled={true}
                                    >
                                        <View style={styles.grid}>
                                            {COLOR_OPTIONS.map((c) => (
                                                <View key={c} style={styles.gridItemContainer}>
                                                    <Pressable
                                                        onPress={() => setColor(c)}
                                                        style={[
                                                            styles.gridItem,
                                                            { backgroundColor: c },
                                                            color === c && { borderWidth: 3, borderColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 6 }
                                                        ]}
                                                    />
                                                </View>
                                            ))}
                                        </View>
                                    </ScrollView>
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
                        </View>
                    </GlassCard>
                </Animated.View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-end' },
    keyboardView: { width: '100%', flex: 1, justifyContent: 'flex-end' },
    modalWrapper: { width: '100%', paddingHorizontal: 12 },
    glassCard: { borderRadius: 40, overflow: 'hidden' },
    header: { paddingTop: 16, paddingBottom: 8, alignItems: 'center' },
    headerIndicator: { width: 40, height: 5, borderRadius: 2.5, backgroundColor: 'rgba(255, 255, 255, 0.25)', marginBottom: 16 },
    headerRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 12 },
    headerTitle: { fontFamily: FONTS.family.bold, fontSize: 18 },
    closeBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    contentContainer: { padding: 24, paddingTop: 4 },
    inputSection: { marginBottom: 20 },
    section: { marginBottom: 20 },
    label: { fontFamily: FONTS.family.bold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 },
    scrollContainer: {
        height: 180, // Height for approx 3-4 rows of 5 columns
        overflow: 'hidden',
        borderRadius: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginHorizontal: -4
    },
    gridItemContainer: {
        width: '20%', // Exactly 5 columns
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4
    },
    gridItem: {
        width: '100%',
        height: '100%',
        borderRadius: 999, // Perfect circle (radius 50%)
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent'
    },
    footer: { marginTop: 8, marginBottom: 10 }
});
