import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface DashboardHeaderProps {
    userName: string;
    onNotificationsPress?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    userName,
    onNotificationsPress,
}) => {
    const { colors, isDark } = useTheme();

    return (
        <View style={styles.container}>
            <View>
                <Text style={[styles.welcome, { color: colors.glass.text.secondary }]}>Merhaba,</Text>
                <Text style={[styles.name, { color: colors.glass.text.primary }]}>{userName} 👋</Text>
            </View>

            <Pressable
                onPress={onNotificationsPress}
                style={styles.notifBtn}
            >
                <View style={[styles.notifIconBg, {
                    backgroundColor: colors.glass.surface.primary,
                    borderColor: colors.glass.border.default
                }]}>
                    <Ionicons name="notifications-outline" size={22} color={colors.glass.text.primary} />
                    <View style={[styles.notifBadge, { borderColor: colors.primary.deep }]} />
                </View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 8,
    },
    welcome: {
        fontFamily: FONTS.family.medium,
        fontSize: 15,
        marginBottom: 2,
    },
    name: {
        fontFamily: FONTS.family.bold,
        fontSize: 26,
        letterSpacing: -0.5,
    },
    notifBtn: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notifIconBg: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    notifBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFD166', // Keep amber for notice
        borderWidth: 1.5,
    },
});
