import { useTheme } from '@/stores/themeStore';
import { BlurView } from 'expo-blur';
import * as React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    contentStyle?: ViewStyle;
    intensity?: number;
    variant?: 'default' | 'elevated' | 'subtle';
    animated?: boolean;
    delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    style,
    contentStyle,
    intensity = 20,
    variant = 'default',
    animated = true,
    delay = 0,
}) => {
    const { colors, isDark } = useTheme();
    const Container: any = animated ? Animated.View : View;
    const animProps = animated
        ? { entering: FadeIn.delay(delay).duration(300) }
        : {};

    const variantStyles: Record<string, ViewStyle> = {
        default: { backgroundColor: colors.glass.surface.primary },
        elevated: { backgroundColor: colors.glass.surface.elevated },
        subtle: { backgroundColor: colors.glass.surface.secondary },
    };

    const containerStyle = [
        styles.wrapper,
        variantStyles[variant],
        { borderColor: colors.glass.border.default },
        style
    ];

    const contentContainerStyle = [
        styles.content,
        contentStyle
    ];

    if (Platform.OS === 'ios') {
        return (
            <Container {...animProps} style={containerStyle}>
                <BlurView intensity={intensity} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
                <View style={contentContainerStyle}>
                    {children}
                </View>
            </Container>
        );
    }

    return (
        <Container {...animProps} style={containerStyle}>
            <View style={contentContainerStyle}>
                {children}
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
    },
    content: {
        padding: 6,
    }
});
