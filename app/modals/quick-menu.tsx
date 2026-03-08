import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function QuickMenuModal() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useTheme();

    const menuItems = [
        { id: 'ai', title: 'Fina AI \nAnaliz', icon: 'sparkles', color: colors.accent.purple, route: '/modals/ai-chat', iconLibrary: 'Ionicons' },
        { id: 'goals', title: 'Hedef\nYönetimi', icon: 'flag', color: colors.accent.teal, route: '/(tabs)/goals', iconLibrary: 'Ionicons' },
        { id: 'cards', title: 'Findeks\nYönetimi', icon: 'card', color: colors.primary.brand, route: '/cards', iconLibrary: 'Ionicons' }
    ];

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeIn.duration(150)} style={StyleSheet.absoluteFill}>
                <BlurView
                    intensity={Platform.OS === 'ios' ? 40 : 100}
                    tint={isDark ? "dark" : "light"}
                    style={StyleSheet.absoluteFill}
                />
                <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()} />
            </Animated.View>

            <Animated.View
                entering={SlideInDown.duration(150)}
                style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom + 120, 120) }]}
                pointerEvents="box-none"
            >
                <View style={styles.gridContainer}>
                    {menuItems.map((item, index) => (
                        <Animated.View key={item.id} entering={SlideInDown.delay(index * 30).duration(200)}>
                            <Pressable
                                onPress={() => {
                                    router.back();
                                    setTimeout(() => {
                                        router.push(item.route as any);
                                    }, 100);
                                }}
                                style={styles.itemContainer}
                            >
                                <View style={[styles.iconBox, { backgroundColor: `${item.color}20`, borderColor: `${item.color}40` }]}>
                                    <Ionicons name={item.icon as any} size={28} color={item.color} />
                                </View>
                                <Text style={[styles.itemTitle, { color: colors.glass.text.primary }]}>{item.title}</Text>
                            </Pressable>
                        </Animated.View>
                    ))}
                </View>

                {/* Close Button */}
                <Animated.View entering={FadeIn.delay(100)} style={{ alignItems: 'center', marginTop: 30 }}>
                    <Pressable onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                        <Ionicons name="close" size={24} color={colors.glass.text.primary} />
                    </Pressable>
                </Animated.View>

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
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        gap: 24,
        justifyContent: 'center',
    },
    itemContainer: {
        alignItems: 'center',
        width: 80,
    },
    iconBox: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemTitle: {
        fontFamily: FONTS.family.semiBold,
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
    },
    closeBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
