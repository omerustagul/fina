import { GlassButton, GlassCard, GlassInput } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const login = useAuthStore(state => state.login);
    const socialLogin = useAuthStore(state => state.socialLogin);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
            return;
        }

        // Basic validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Hata", "Geçerli bir e-posta adresi giriniz.");
            return;
        }

        const res = login(email, password);
        if (res.success) {
            router.replace('/(tabs)');
        } else {
            Alert.alert("Giriş Başarısız", res.error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.primary.deep }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <View style={[styles.iconBox, { backgroundColor: `${colors.accent.teal}20` }]}>
                            <Ionicons name="finger-print" size={40} color={colors.accent.teal} />
                        </View>
                        <Text style={[styles.title, { color: colors.glass.text.primary }]}>Tekrar Hoş Geldiniz</Text>
                        <Text style={[styles.subtitle, { color: colors.glass.text.secondary }]}>
                            Hesabınıza giriş yapmak için devam edin.
                        </Text>
                    </View>

                    <GlassCard variant="elevated" style={styles.formCard} contentStyle={{ gap: 16 }}>
                        <GlassInput
                            label="E-posta Adresi"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="ornek@mail.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <GlassInput
                            label="Şifre"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="*************"
                            secureTextEntry
                        />
                        <View style={{ marginTop: 8 }}>
                            <GlassButton title="Giriş Yap" onPress={handleLogin} variant="primary" />
                        </View>
                    </GlassCard>

                    <View style={styles.dividerBox}>
                        <View style={[styles.dividerLine, { backgroundColor: colors.glass.border.default }]} />
                        <Text style={[styles.dividerText, { color: colors.glass.text.muted }]}>veya şununla devam et</Text>
                        <View style={[styles.dividerLine, { backgroundColor: colors.glass.border.default }]} />
                    </View>

                    <View style={styles.socialBox}>
                        <Pressable style={[styles.socialBtn, { backgroundColor: colors.glass.surface.elevated, borderColor: colors.glass.border.default }]} onPress={() => socialLogin('Google')}>
                            <Ionicons name="logo-google" size={24} color="#DB4437" />
                        </Pressable>
                        <Pressable style={[styles.socialBtn, { backgroundColor: colors.glass.surface.elevated, borderColor: colors.glass.border.default }]} onPress={() => socialLogin('Apple')}>
                            <Ionicons name="logo-apple" size={24} color={colors.glass.text.primary} />
                        </Pressable>
                        <Pressable style={[styles.socialBtn, { backgroundColor: colors.glass.surface.elevated, borderColor: colors.glass.border.default }]} onPress={() => socialLogin('Facebook')}>
                            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                        </Pressable>
                    </View>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.glass.text.muted }]}>
                            Hesabınız yok mu?
                        </Text>
                        <Pressable onPress={() => router.push('/register')}>
                            <Text style={[styles.registerText, { color: colors.primary.brand }]}>Kayıt Ol</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    iconBox: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontFamily: FONTS.family.bold,
        fontSize: 28,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: FONTS.family.regular,
        fontSize: 16,
        textAlign: 'center',
    },
    formCard: {
        marginBottom: 32,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    dividerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        fontFamily: FONTS.family.medium,
        fontSize: 14,
        marginHorizontal: 16,
    },
    socialBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 40,
    },
    socialBtn: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    footerText: {
        fontFamily: FONTS.family.regular,
        fontSize: 14,
    },
    registerText: {
        fontFamily: FONTS.family.bold,
        fontSize: 14,
    }
});
