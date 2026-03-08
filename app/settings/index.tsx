import { GlassButton, GlassCard, GlassModal } from '@/components/ui';
import { useTheme, useThemeStore } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const router = useRouter();
    const { colors, isDark, mode } = useTheme();
    const { setMode } = useThemeStore();
    const [isResetVisible, setResetVisible] = useState(false);

    const SettingItem = ({ icon, label, children, value }: { icon: string, label: string, children?: React.ReactNode, value?: string }) => (
        <View style={styles.settingRow}>
            <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                <Ionicons name={icon as any} size={20} color={colors.glass.text.primary} />
            </View>
            <View style={styles.labelContainer}>
                <Text style={[styles.label, { color: colors.glass.text.primary }]}>{label}</Text>
                {value && <Text style={[styles.value, { color: colors.glass.text.secondary }]}>{value}</Text>}
            </View>
            {children}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.primary.deep }]} edges={['top']}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={colors.glass.text.primary} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.glass.text.primary }]}>Ayarlar</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.glass.text.muted }]}>Görünüm</Text>
                    <GlassCard contentStyle={{ padding: 4 }} variant="subtle">
                        <SettingItem icon="moon-outline" label="Koyu Mod">
                            <Switch
                                value={isDark}
                                onValueChange={(val) => setMode(val ? 'dark' : 'light')}
                                trackColor={{ false: '#767577', true: colors.primary.brand }}
                                thumbColor={isDark ? '#FFFFFF' : '#f4f3f4'}
                            />
                        </SettingItem>
                        <View style={styles.divider} />
                        <SettingItem icon="phone-portrait-outline" label="Sistem Teması">
                            <Switch
                                value={mode === 'system'}
                                onValueChange={(val) => setMode(val ? 'system' : (isDark ? 'dark' : 'light'))}
                                trackColor={{ false: '#767577', true: colors.primary.brand }}
                            />
                        </SettingItem>
                    </GlassCard>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.glass.text.muted }]}>Hesap & Veri</Text>
                    <GlassCard contentStyle={{ padding: 4 }} variant="subtle">
                        <SettingItem icon="wallet-outline" label="Varsayılan Para Birimi" value="TRY (₺)" />
                        <View style={styles.divider} />
                        <SettingItem icon="notifications-outline" label="Bildirimler" value="Açık" />
                        <View style={styles.divider} />
                        <SettingItem icon="finger-print-outline" label="Biyometrik Kilit" value="Kapalı" />
                    </GlassCard>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.glass.text.muted }]}>Destek</Text>
                    <GlassCard contentStyle={{ padding: 4 }} variant="subtle">
                        <SettingItem icon="information-circle-outline" label="Uygulama Sürümü" value="1.0.0 (Beta)" />
                        <View style={styles.divider} />
                        <SettingItem icon="help-buoy-outline" label="Yardım Alın" />
                    </GlassCard>
                </View>

                <View style={{ marginTop: 20 }}>
                    <GlassButton
                        title="Verileri Sıfırla"
                        onPress={() => setResetVisible(true)}
                        variant="secondary"
                        textStyle={{ color: colors.accent.red }}
                    />
                </View>

                <GlassModal
                    visible={isResetVisible}
                    onClose={() => setResetVisible(false)}
                    title="Verileri Sıfırla"
                >
                    <View style={{ gap: 16 }}>
                        <Text style={{
                            color: colors.glass.text.secondary,
                            textAlign: 'center',
                            fontFamily: FONTS.family.medium,
                            lineHeight: 22
                        }}>
                            Tüm işlem ve ayar verilerin kalıcı olarak silinecektir. Bu işlem geri alınamaz.
                        </Text>
                        <GlassButton
                            title="Evet, Sıfırla"
                            onPress={() => setResetVisible(false)}
                            variant="primary"
                            style={{ backgroundColor: colors.accent.red }}
                        />
                        <GlassButton
                            title="İptal"
                            onPress={() => setResetVisible(false)}
                            variant="secondary"
                        />
                    </View>
                </GlassModal>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        height: 56,
    },
    backBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontFamily: FONTS.family.bold,
        fontSize: 18,
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        marginLeft: 4,
    },
    card: {
        padding: 4, // Inner elements will have their own padding
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    labelContainer: {
        flex: 1,
    },
    label: {
        fontFamily: FONTS.family.semiBold,
        fontSize: 15,
    },
    value: {
        fontFamily: FONTS.family.regular,
        fontSize: 12,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginHorizontal: 12,
    }
});
