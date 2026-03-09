import { GlassCard } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { useFinanceStore } from '@/stores/financeStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { transactions } = useFinanceStore();
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const { colors, isDark } = useTheme();

    const handleShare = async () => {
        try {
            await Share.share({
                message: "Fina - Kişisel Finans Asistanı uygulamasını keşfet! Harcamalarını kontrol altına al.",
                url: "https://fina.app"
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        logout();
        router.replace('/login');
    };

    const MenuItem = ({ icon, label, value, color, onPress }: {
        icon: string,
        label: string,
        value?: string,
        color?: string,
        onPress?: () => void
    }) => (
        <Pressable onPress={onPress}>
            <GlassCard
                style={styles.menuItem}
                contentStyle={{ padding: 12 }}
                variant="subtle"
            >
                <View style={styles.menuRow}>
                    <View style={[styles.menuIconBg, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(108, 60, 225, 0.08)' }]}>
                        <Ionicons name={icon as any} size={18} color={isDark ? '#FFFFFF' : colors.primary.brand} />
                    </View>
                    <Text style={[styles.menuLabel, { color: color || colors.glass.text.primary }]}>{label}</Text>
                    {value && <Text style={[styles.menuValue, { color: colors.glass.text.secondary }]}>{value}</Text>}
                    <Ionicons name="chevron-forward" size={14} color={isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'} />
                </View>
            </GlassCard>
        </Pressable>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.primary.deep }]} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.title, { color: colors.glass.text.primary }]}>Profil</Text>

                <GlassCard style={styles.profileCard} contentStyle={{ padding: 16 }} variant="elevated">
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name="person" size={32} color={isDark ? '#FFFFFF' : colors.primary.brand} />
                            <View style={[styles.editBadge, { borderColor: colors.primary.deep }]}>
                                <Ionicons name="camera" size={12} color="#FFFFFF" />
                            </View>
                        </View>
                        <View style={styles.userLines}>
                            <Text style={[styles.userName, { color: colors.glass.text.primary }]}>{user ? `${user.firstName} ${user.lastName}` : 'Kullanıcı'}</Text>
                            <Text style={[styles.userEmail, { color: colors.glass.text.secondary }]}>{user?.email || 'kullanici@fina.app'}</Text>
                        </View>
                        <Pressable
                            style={[styles.editBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }]}
                            onPress={() => router.push('/modals/edit-profile')}
                        >
                            <Ionicons name="create-outline" size={20} color={colors.glass.text.primary} />
                        </Pressable>
                    </View>

                    <View style={[styles.statsContainer, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(108, 60, 225, 0.03)' }]}>
                        <View style={styles.miniStat}>
                            <Text style={[styles.miniStatValue, { color: colors.glass.text.primary }]}>{transactions.length}</Text>
                            <Text style={[styles.miniStatLabel, { color: colors.glass.text.muted }]}>İşlem</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]} />
                        <View style={styles.miniStat}>
                            <Text style={[styles.miniStatValue, { color: colors.glass.text.primary }]}>3</Text>
                            <Text style={[styles.miniStatLabel, { color: colors.glass.text.muted }]}>Hedef</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]} />
                        <View style={styles.miniStat}>
                            <Text style={[styles.miniStatValue, { color: colors.glass.text.primary }]}>PRO</Text>
                            <Text style={[styles.miniStatLabel, { color: colors.glass.text.muted }]}>Üyelik</Text>
                        </View>
                    </View>
                </GlassCard>

                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.glass.text.muted }]}>Kontrol Paneli</Text>
                </View>
                <MenuItem
                    icon="settings-outline"
                    label="Uygulama Ayarları"
                    onPress={() => router.push('/settings' as any)}
                />
                <MenuItem
                    icon="notifications-outline"
                    label="Bildirimler"
                    value="Açık"
                    onPress={() => Linking.openSettings()}
                />

                <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                    <Text style={[styles.sectionTitle, { color: colors.glass.text.muted }]}>Uygulama</Text>
                </View>
                <MenuItem
                    icon="help-circle-outline"
                    label="Yardım Merkezi"
                    onPress={() => router.push('/modals/help-center')}
                />
                <MenuItem
                    icon="share-outline"
                    label="Arkadaşlarını Davet Et"
                    onPress={handleShare}
                />
                <MenuItem
                    icon="log-out-outline"
                    label="Oturumu Kapat"
                    color={colors.accent.red}
                    onPress={handleLogout}
                />

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.glass.text.muted }]}>Fina v1.0.0 (Beta)</Text>
                    <Text style={[styles.footerSub, { color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)' }]}>Made with ❤️ in Turkey</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 120,
    },
    title: {
        fontFamily: FONTS.family.bold,
        fontSize: 28,
        letterSpacing: -0.5,
        marginBottom: 24,
    },
    profileCard: {
        padding: 6,
        marginBottom: 32,
        borderRadius: 24,
    },
    avatarSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        width: 72,
        height: 72,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'visible',
    },
    editBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 8,
        backgroundColor: '#00E5CC',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    userLines: {
        flex: 1,
        marginLeft: 16,
    },
    userName: {
        fontFamily: FONTS.family.bold,
        fontSize: 20,
    },
    userEmail: {
        fontFamily: FONTS.family.regular,
        fontSize: 14,
        marginTop: 2,
    },
    editBtn: {
        width: 40,
        height: 40,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingVertical: 14,
    },
    miniStat: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: '40%',
    },
    miniStatValue: {
        fontFamily: FONTS.family.bold,
        fontSize: 18,
    },
    miniStatLabel: {
        fontFamily: FONTS.family.medium,
        fontSize: 11,
        textTransform: 'uppercase',
        marginTop: 4,
    },
    sectionHeader: {
        marginBottom: 10,
        paddingLeft: 4,
    },
    sectionTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    menuItem: {
        marginBottom: 8,
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconBg: {
        width: 32, // Reduced from 36
        height: 32, // Reduced from 36
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12, // Reduced from 16
    },
    menuLabel: {
        flex: 1,
        fontFamily: FONTS.family.semiBold,
        fontSize: 15, // Reduced from 16
    },
    menuValue: {
        fontFamily: FONTS.family.regular,
        fontSize: 13, // Reduced from 14
        marginRight: 8,
    },
    footer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    footerText: {
        fontFamily: FONTS.family.medium,
        fontSize: 13,
    },
    footerSub: {
        fontFamily: FONTS.family.regular,
        fontSize: 11,
        marginTop: 4,
    }
});
