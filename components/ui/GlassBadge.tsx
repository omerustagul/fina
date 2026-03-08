// components/ui/GlassBadge.tsx
import { FONTS, GLASS } from '@/theme';
import { BlurView } from 'expo-blur';
import * as React from 'react';
import { Platform, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface GlassBadgeProps {
    label: string;
    color?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
    label,
    color,
    style,
    textStyle,
}) => {
    return (
        <View style={[styles.badge, color ? { borderColor: color } : null, style]}>
            {Platform.OS === 'ios' && (
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            )}
            <Text style={[styles.text, color ? { color } : null, textStyle]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        backgroundColor: GLASS.surface.highlight,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: GLASS.border.strong,
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignSelf: 'flex-start',
    },
    text: {
        fontFamily: FONTS.family.medium,
        fontSize: FONTS.size.xs,
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
