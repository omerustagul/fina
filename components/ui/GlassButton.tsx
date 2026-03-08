import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { Platform, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface GlassButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const GlassButton: React.FC<GlassButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    style,
    textStyle,
    disabled = false,
}) => {
    const { colors, isDark } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: disabled ? 0.6 : 1,
    }));

    const handlePressIn = React.useCallback(() => {
        scale.value = withSpring(0.96, { damping: 15 });
    }, []);

    const handlePressOut = React.useCallback(() => {
        scale.value = withSpring(1, { damping: 15 });
    }, []);

    const isPrimary = variant === 'primary';
    const isSecondary = variant === 'secondary';

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            style={[animatedStyle, style]}
        >
            <View style={[
                styles.buttonBase,
                isPrimary && { backgroundColor: 'transparent' },
                isSecondary && { backgroundColor: colors.glass.surface.secondary, borderColor: colors.glass.border.default, borderWidth: 1 },
                variant === 'outline' && { backgroundColor: 'transparent', borderColor: colors.primary.brand, borderWidth: 1 },
            ]}>
                {isPrimary && (
                    <LinearGradient
                        colors={colors.gradients.brand as any}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                )}

                {isSecondary && Platform.OS === 'ios' && (
                    <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
                )}

                <Text style={[
                    styles.buttonText,
                    { color: isPrimary ? '#FFFFFF' : colors.glass.text.primary },
                    textStyle
                ]}>
                    {title}
                </Text>
            </View>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    buttonBase: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
        overflow: 'hidden',
    },
    buttonText: {
        fontFamily: FONTS.family.semiBold,
        fontSize: 16,
    },
});
