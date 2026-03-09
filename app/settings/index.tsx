import { GlassButton, GlassCard, GlassModal } from '@/components/ui';
import { useTheme, useThemeStore } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingItem = ({ icon, label, children, value, onPress, disabled, colors, isDark }: {
    icon: string,
    label: string,
    children?: React.ReactNode,
    value?: string,
    onPress?: () => void,
    disabled?: boolean,
    colors: any,
    isDark: boolean
}) => {
    const Content = (
        <View style={[styles.settingRow, disabled && { opacity: 0.4 }]}>
            <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                <Ionicons name={icon as any} size={20} color={colors.glass.text.primary} />
            </View>
            <View style={styles.labelContainer}>
                <Text style={[styles.label, { color: colors.glass.text.primary }]}>{label}</Text>
                {value && <Text style={[styles.value, { color: colors.glass.text.secondary }]}>{value}</Text>}
            </View>
            {children}
            {onPress && !children && <Ionicons name="chevron-forward" size={16} color={colors.glass.text.muted} />}
        </View>
    );

    if (onPress && !children) {
        return (
            <Pressable onPress={onPress} disabled={disabled}>
                {Content}
            </Pressable>
        );
    }

    return Content;
};

export default function SettingsScreen() {
    const router = useRouter();
    const { colors, isDark, mode } = useTheme();
    const { setMode } = useThemeStore();
    const [isResetVisible, setResetVisible] = useState(false);
    const [isCurrencyModalVisible, setCurrencyModalVisible] = useState(false);
    const [isAboutVisible, setAboutVisible] = useState(false);
    const [policyType, setPolicyType] = useState<'privacy' | 'terms' | null>(null);

    // Lock related states
    const [lockEnabled, setLockEnabled] = useState(false);
    const [authType, setAuthType] = useState<string>('Kilidi');
    const [authIcon, setAuthIcon] = useState<string>('lock-closed-outline');

    // Other states
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [selectedCurrency, setSelectedCurrency] = useState('TRY (₺)');

    useEffect(() => {
        checkAuthType();
    }, []);

    const checkAuthType = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
            const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
            if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                setAuthType(Platform.OS === 'ios' ? 'Face ID' : 'Yüz Tanıma');
                setAuthIcon('scan-outline');
            } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                setAuthType(Platform.OS === 'ios' ? 'Touch ID' : 'Parmak İzi');
                setAuthIcon('finger-print-outline');
            } else {
                setAuthType('Ekran Kilidi');
                setAuthIcon('lock-closed-outline');
            }
        }
    };

    const handleLockToggle = async (val: boolean) => {
        if (val) {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Uygulama kilidini aktif etmek için doğrulama yapın.',
                fallbackLabel: 'Parola Gir',
            });

            if (result.success) {
                setLockEnabled(true);
            } else {
                setLockEnabled(false);
            }
        } else {
            setLockEnabled(false);
        }
    };

    const currencies = [
        { label: 'Türk Lirası (₺)', value: 'TRY (₺)' },
        { label: 'Amerikan Doları ($)', value: 'USD ($)' },
        { label: 'Euro (€)', value: 'EUR (€)' },
        { label: 'İngiliz Sterlini (£)', value: 'GBP (£)' },
    ];


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
                        <SettingItem
                            icon="moon-outline"
                            label="Koyu Mod"
                            disabled={mode === 'system'}
                            colors={colors}
                            isDark={isDark}
                        >
                            <Switch
                                value={isDark}
                                onValueChange={(val) => setMode(val ? 'dark' : 'light')}
                                disabled={mode === 'system'}
                                trackColor={{ false: isDark ? '#39393D' : '#D1D1D6', true: colors.primary.brand }}
                                thumbColor={isDark ? '#FFFFFF' : '#f4f3f4'}
                                ios_backgroundColor={isDark ? '#39393D' : '#D1D1D6'}
                            />
                        </SettingItem>
                        <View style={styles.divider} />
                        <SettingItem icon="phone-portrait-outline" label="Sistem Teması" colors={colors} isDark={isDark}>
                            <Switch
                                value={mode === 'system'}
                                onValueChange={(val) => setMode(val ? 'system' : (isDark ? 'dark' : 'light'))}
                                trackColor={{ false: isDark ? '#39393D' : '#D1D1D6', true: colors.primary.brand }}
                                ios_backgroundColor={isDark ? '#39393D' : '#D1D1D6'}
                            />
                        </SettingItem>
                    </GlassCard>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.glass.text.muted }]}>Hesap & Veri</Text>
                    <GlassCard contentStyle={{ padding: 4 }} variant="subtle">
                        <SettingItem
                            icon="wallet-outline"
                            label="Varsayılan Para Birimi"
                            value={selectedCurrency}
                            onPress={() => setCurrencyModalVisible(true)}
                            colors={colors}
                            isDark={isDark}
                        />
                        <View style={styles.divider} />
                        <SettingItem icon="notifications-outline" label="Bildirimler" colors={colors} isDark={isDark}>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: isDark ? '#39393D' : '#D1D1D6', true: colors.accent.teal }}
                                ios_backgroundColor={isDark ? '#39393D' : '#D1D1D6'}
                            />
                        </SettingItem>
                        <View style={styles.divider} />
                        <SettingItem icon={authIcon} label={`Uygulama ${authType}`} colors={colors} isDark={isDark}>
                            <Switch
                                value={lockEnabled}
                                onValueChange={handleLockToggle}
                                trackColor={{ false: isDark ? '#39393D' : '#D1D1D6', true: colors.accent.purple }}
                                ios_backgroundColor={isDark ? '#39393D' : '#D1D1D6'}
                            />
                        </SettingItem>
                    </GlassCard>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.glass.text.muted }]}>Destek</Text>
                    <GlassCard contentStyle={{ padding: 4 }} variant="subtle">
                        <SettingItem
                            icon="information-circle-outline"
                            label="Uygulama Sürümü"
                            value="1.0.0 (Beta)"
                            onPress={() => setAboutVisible(true)}
                            colors={colors}
                            isDark={isDark}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="help-buoy-outline"
                            label="Yardım Alın"
                            onPress={() => router.push('/modals/help-center')}
                            colors={colors}
                            isDark={isDark}
                        />
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

                <GlassModal
                    visible={isCurrencyModalVisible}
                    onClose={() => setCurrencyModalVisible(false)}
                    title="Para Birimi Seçin"
                >
                    <View style={{ gap: 12 }}>
                        {currencies.map((c) => (
                            <Pressable
                                key={c.value}
                                onPress={() => {
                                    setSelectedCurrency(c.value);
                                    setCurrencyModalVisible(false);
                                }}
                                style={[
                                    styles.currencyOption,
                                    { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                                    selectedCurrency === c.value && { borderColor: colors.primary.brand, borderWidth: 1 }
                                ]}
                            >
                                <Text style={[
                                    styles.currencyLabel,
                                    { color: selectedCurrency === c.value ? colors.primary.brand : colors.glass.text.primary }
                                ]}>
                                    {c.label}
                                </Text>
                                {selectedCurrency === c.value && <Ionicons name="checkmark" size={18} color={colors.primary.brand} />}
                            </Pressable>
                        ))}
                    </View>
                </GlassModal>

                <GlassModal
                    visible={isAboutVisible}
                    onClose={() => setAboutVisible(false)}
                    title="Fina Hakkında"
                >
                    <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                            <View style={[styles.aboutLogo, { backgroundColor: colors.primary.brand }]}>
                                <Ionicons name="wallet" size={40} color="white" />
                            </View>
                            <Text style={[styles.aboutName, { color: colors.glass.text.primary }]}>Fina</Text>
                            <Text style={[styles.aboutVer, { color: colors.glass.text.muted }]}>Sürüm 1.0.0 (Beta)</Text>
                        </View>

                        <Text style={[styles.aboutText, { color: colors.glass.text.secondary }]}>
                            Fina, finansal hayatınızı yapay zeka desteğiyle optimize etmeniz için tasarlanmış yeni nesil bir bütçe yönetim uygulamasıdır.
                            {"\n\n"}
                            Harcamalarınızı takip ederken, sesli komutlarla her an yanınızda olur ve gelişmiş analiz yöntemleriyle tasarruf potansiyelinizi ortaya çıkarır.
                        </Text>

                        <View style={{ gap: 10, marginTop: 24 }}>
                            <GlassButton
                                title="Gizlilik Politikası"
                                onPress={() => setPolicyType('privacy')}
                                variant="secondary"
                                style={{ height: 48 }}
                            />
                            <GlassButton
                                title="Kullanım Koşulları"
                                onPress={() => setPolicyType('terms')}
                                variant="secondary"
                                style={{ height: 48 }}
                            />
                        </View>
                    </ScrollView>
                </GlassModal>

                <GlassModal
                    visible={!!policyType}
                    onClose={() => setPolicyType(null)}
                    title={policyType === 'privacy' ? "Gizlilik Politikası" : "Kullanım Koşulları"}
                >
                    <ScrollView style={{ maxHeight: 500 }} showsVerticalScrollIndicator={false}>
                        <Text style={[styles.policyText, { color: colors.glass.text.secondary }]}>
                            {policyType === 'privacy' ? (
                                <>
                                    <Text style={styles.policyTitle}>1. Veri Sorumluluğu</Text>
                                    {"\n"}Fina, tüm finansal verilerinizi cihazınızın yerel depolama alanında şifreli olarak saklar. Verileriniz izniniz dışında sunucularımıza aktarılmaz.{"\n\n"}
                                    <Text style={styles.policyTitle}>2. Yapay Zeka Analizi</Text>
                                    {"\n"}Harcama alışkanlıklarınız, size özel öneriler sunabilmek amacıyla cihaz içerisinde anonim olarak analiz edilir. AI modellerimiz verilerinizi herhangi bir eğitim havuzunda kullanmaz.{"\n\n"}
                                    <Text style={styles.policyTitle}>3. Güvenlik</Text>
                                    {"\n"}Uygulama kilidi (FaceID/PIN) aktif edildiğinde, verilerinize erişim yalnızca sizin biyometrik onayınız ile mümkündür.
                                </>
                            ) : (
                                <>
                                    <Text style={styles.policyTitle}>1. Hizmet Kapsamı</Text>
                                    {"\n"}Fina, kişisel finans yönetimi aracıdır. Sunulan analizler yatırım tavsiyesi niteliği taşımaz.{"\n\n"}
                                    <Text style={styles.policyTitle}>2. Sorumluluk Sınırı</Text>
                                    {"\n"}Veri kaybı yaşanmaması adına düzenli yedekleme yapılması önerilir. Uygulama kaynaklı olmayan veri silinmelerinden Fina sorumlu tutulamaz.{"\n\n"}
                                    <Text style={styles.policyTitle}>3. Güncellemeler</Text>
                                    {"\n"}Hizmet kalitesini artırmak adına uygulama belirli aralıklarla güncellenebilir. Beta sürümünde bazı özellikler kısıtlı olabilir.
                                </>
                            )}
                        </Text>
                    </ScrollView>
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
    },
    currencyOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
    },
    currencyLabel: {
        fontFamily: FONTS.family.semiBold,
        fontSize: 15,
    },
    aboutLogo: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    aboutName: {
        fontFamily: FONTS.family.bold,
        fontSize: 24,
    },
    aboutVer: {
        fontFamily: FONTS.family.medium,
        fontSize: 14,
    },
    aboutText: {
        fontFamily: FONTS.family.medium,
        fontSize: 14,
        lineHeight: 22,
        marginTop: 10,
    },
    policyText: {
        fontFamily: FONTS.family.regular,
        fontSize: 14,
        lineHeight: 22,
    },
    policyTitle: {
        fontFamily: FONTS.family.bold,
        color: 'white', // Will be adjusted by theme locally in future if needed
    }
});
