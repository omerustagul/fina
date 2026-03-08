import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { BlurView } from 'expo-blur';
import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { GlassCard } from './GlassCard';

interface GlassModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    style?: ViewStyle;
}

export const GlassModal: React.FC<GlassModalProps> = ({
    visible,
    onClose,
    title,
    children,
    style,
}) => {
    const { colors, isDark } = useTheme();

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            {/* Background is outside KeyboardAvoidingView to ensure it covers the entire screen including under the keyboard */}
            <Animated.View
                entering={FadeIn.duration(150)}
                exiting={FadeOut.duration(100)}
                style={StyleSheet.absoluteFill}
            >
                <Pressable style={styles.backdrop} onPress={onClose}>
                    <BlurView
                        intensity={Platform.OS === 'ios' ? 40 : 100}
                        tint={isDark ? "dark" : "light"}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.2)' }]} />
                </Pressable>
            </Animated.View>

            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                style={{ flex: 1 }}
                pointerEvents="box-none"
            >
                <View style={styles.overlay} pointerEvents="box-none">
                    <Animated.View
                        entering={ZoomIn.duration(150).springify().damping(20).stiffness(400).mass(0.5)}
                        exiting={ZoomOut.duration(100)}
                        style={[styles.modalWrapper, style]}
                    >
                        <GlassCard
                            variant="elevated"
                            intensity={40}
                            contentStyle={{ padding: 24 }}
                            style={{ borderRadius: 32, borderColor: colors.glass.border.strong }}
                        >
                            {title && (
                                <View style={styles.header}>
                                    <Text style={[styles.title, { color: colors.glass.text.primary }]}>{title}</Text>
                                </View>
                            )}
                            <View style={styles.content}>
                                {children}
                            </View>
                        </GlassCard>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    backdrop: {
        flex: 1,
    },
    modalWrapper: {
        width: '100%',
        maxWidth: 400,
        zIndex: 10,
    },
    header: {
        marginBottom: 16,
        alignItems: 'center',
    },
    title: {
        fontFamily: FONTS.family.bold,
        fontSize: 20,
        textAlign: 'center',
    },
    content: {
        width: '100%',
    },
});
