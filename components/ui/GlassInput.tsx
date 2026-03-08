import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { BlurView } from 'expo-blur';
import * as React from 'react';
import { Platform, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';

interface GlassInputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle | (TextStyle | null)[];
}

export const GlassInput: React.FC<GlassInputProps> = ({
    label,
    error,
    containerStyle,
    inputStyle,
    style,
    ...props
}) => {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={[styles.label, { color: colors.glass.text.secondary }]}>{label}</Text>}
            <View style={[
                styles.inputWrapper,
                {
                    backgroundColor: colors.glass.surface.secondary,
                    borderColor: colors.glass.border.default
                },
                error ? { borderColor: colors.accent.red } : null
            ]}>
                {Platform.OS === 'ios' && (
                    <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
                )}
                <TextInput
                    placeholderTextColor={colors.glass.text.muted}
                    style={[styles.input, { color: colors.glass.text.primary }, inputStyle, style]}
                    {...props}
                />
            </View>
            {error && <Text style={[styles.errorText, { color: colors.accent.red }]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontFamily: FONTS.family.medium,
        marginBottom: 6,
        marginLeft: 4,
    },
    inputWrapper: {
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        fontFamily: FONTS.family.regular,
    },
    errorText: {
        fontSize: 11,
        marginTop: 4,
        marginLeft: 4,
    },
});
