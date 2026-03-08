import { useTheme } from '@/stores/themeStore';
import { FONTS, SPACING } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
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

    return (
        <Animated.View entering={FadeInRight.delay(400).duration(500)}>
            <GlassCard
                style={[styles.card, { borderColor: isDark ? 'rgba(255, 209, 102, 0.25)' : 'rgba(255, 179, 0, 0.2)' }] as any}
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
                    <Text style={[styles.footerText, { color: colors.accent.amber }]}>Detaylar →</Text>
                </View>
            </GlassCard>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 1.5,
        marginVertical: SPACING.md,
        padding: 12,
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
        letterSpacing: 1,
    },
    content: {
        fontFamily: FONTS.family.regular,
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        marginTop: 12,
        alignItems: 'flex-end',
    },
    footerText: {
        fontFamily: FONTS.family.medium,
        fontSize: 12,
    },
});
