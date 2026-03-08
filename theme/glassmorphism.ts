// theme/glassmorphism.ts
import { Platform, StyleSheet } from 'react-native';
import { GLASS } from './colors';

export const glassStyles = StyleSheet.create({
    card: {
        backgroundColor: GLASS.surface.primary,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: GLASS.border.default,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 1,
                shadowRadius: 32,
            },
            android: {
                elevation: 8,
            }
        })
    },
    badge: {
        backgroundColor: GLASS.surface.highlight,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: GLASS.border.strong,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    input: {
        backgroundColor: GLASS.surface.secondary,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: GLASS.border.default,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#FFFFFF',
        fontSize: 16,
    }
});
