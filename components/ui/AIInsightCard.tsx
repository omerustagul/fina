import { useTheme } from '@/stores/themeStore';
import { FONTS, SPACING } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    FadeInRight,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import { GlassCard } from './GlassCard';

interface AIInsightCardProps {
    title: string;
    content: string;
    onPress?: () => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
    title,
    content,
    onPress,
}) => {
    const { colors, isDark } = useTheme();
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 4000,
                easing: Easing.linear,
            }),
            -1,
            false
        );
    }, []);

    const animatedBorderStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    return (
        <Animated.View entering={FadeInRight.delay(400).duration(500)} style={styles.outerContainer}>
            <Pressable onPress={onPress}>
                <View style={styles.animatedBorderContainer}>
                    <Animated.View style={[styles.gradientWheel, animatedBorderStyle]}>
                        <LinearGradient
                            colors={['transparent', colors.accent.amber, 'transparent', colors.accent.purple, 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                    </Animated.View>

                    <View style={[styles.innerMask, { backgroundColor: colors.primary.deep }]}>
                        <GlassCard
                            style={styles.card}
                            variant="elevated"
                        >
                            <View style={styles.header}>
                                <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(255, 209, 102, 0.1)' : 'rgba(255, 179, 0, 0.1)' }]}>
                                    <Ionicons name="sparkles" size={16} color={colors.accent.amber} />
                                </View>
                                <Text style={[styles.title, { color: colors.accent.amber }]}>{title || 'Yapay Zeka Önerisi'}</Text>
                            </View>
                            <Text style={[styles.content, { color: colors.glass.text.primary }]} numberOfLines={2}>
                                {content}
                            </Text>
                            <View style={styles.footer}>
                                <View style={styles.badge}>
                                    <Text style={[styles.footerText, { color: colors.accent.amber }]}>Hemen İncele →</Text>
                                </View>
                            </View>
                        </GlassCard>
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        marginVertical: SPACING.md,
    },
    animatedBorderContainer: {
        borderRadius: 24,
        padding: 2, // Border thickness
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradientWheel: {
        width: '200%',
        aspectRatio: 1,
        position: 'absolute',
    },
    innerMask: {
        width: '100%',
        borderRadius: 22,
        overflow: 'hidden',
    },
    card: {
        borderWidth: 0, // Remove static border
        padding: 14,
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    title: {
        fontFamily: FONTS.family.bold,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    content: {
        fontFamily: FONTS.family.medium,
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        marginTop: 12,
        alignItems: 'flex-end',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 209, 102, 0.1)',
    },
    footerText: {
        fontFamily: FONTS.family.bold,
        fontSize: 11,
    },
});
