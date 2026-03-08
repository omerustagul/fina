import { GlassButton, GlassCard, GlassInput } from '@/components/ui';
import { useAuthStore, UserProfile } from '@/stores/authStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { user, updateProfile } = useAuthStore();

    const [form, setForm] = useState<Partial<UserProfile>>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        birthDate: user?.birthDate || '',
        gender: user?.gender || '',
        address: user?.address || '',
    });

    const handleChange = (key: keyof UserProfile, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        updateProfile(form);
        router.back();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.primary.deep }]} edges={['top']}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.closeBtn}>
                        <Ionicons name="chevron-back" size={24} color={colors.glass.text.primary} />
                    </Pressable>
                    <Text style={[styles.title, { color: colors.glass.text.primary }]}>Profili Düzenle</Text>
                    <View style={styles.closeBtn} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name="person" size={54} color={isDark ? '#FFFFFF' : colors.primary.brand} />
                            <View style={[styles.editBadge, { borderColor: colors.primary.deep }]}>
                                <Ionicons name="camera" size={14} color="#FFFFFF" />
                            </View>
                        </View>
                        <Text style={[styles.avatarHint, { color: colors.glass.text.muted }]}>Fotoğrafı Değiştir</Text>
                    </View>

                    <GlassCard variant="elevated" style={styles.formCard} contentStyle={{ gap: 16 }}>
                        <GlassInput label="Adınız" value={form.firstName} onChangeText={(t) => handleChange('firstName', t)} />
                        <GlassInput label="Soyadınız" value={form.lastName} onChangeText={(t) => handleChange('lastName', t)} />
                        <GlassInput label="Doğum Tarihi" value={form.birthDate} onChangeText={(t) => handleChange('birthDate', t)} placeholder="GG/AA/YYYY" />
                        <GlassInput label="Cinsiyet" value={form.gender} onChangeText={(t) => handleChange('gender', t)} />
                        <GlassInput label="Adres" value={form.address} onChangeText={(t) => handleChange('address', t)} />

                        <View style={{ marginTop: 12 }}>
                            <GlassButton title="Değişiklikleri Kaydet" onPress={handleSave} variant="primary" />
                        </View>
                    </GlassCard>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    closeBtn: {
        width: 44,
    },
    title: {
        fontFamily: FONTS.family.bold,
        fontSize: 18,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 60,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 12,
        position: 'relative',
    },
    editBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#00E5CC',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
    },
    avatarHint: {
        fontFamily: FONTS.family.medium,
        fontSize: 14,
    },
    formCard: {
        marginBottom: 24,
        paddingVertical: 20,
        paddingHorizontal: 16,
    }
});
