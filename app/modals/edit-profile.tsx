import { GlassButton, GlassCard, GlassInput } from '@/components/ui';
import { useAuthStore, UserProfile } from '@/stores/authStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { user, updateProfile } = useAuthStore();

    const [form, setForm] = useState<Partial<UserProfile>>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        birthDate: user?.birthDate || '',
        gender: user?.gender || '',
        country: user?.country || '',
        city: user?.city || '',
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showGenderPicker, setShowGenderPicker] = useState(false);

    const handleChange = (key: keyof UserProfile, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        updateProfile(form);
        router.back();
    };

    const PickerItem = ({ label, value, icon, onPress }: { label: string, value?: string, icon: string, onPress: () => void }) => (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
            <View style={styles.inputLabelContainer}>
                <Text style={[styles.inputLabel, { color: colors.glass.text.muted }]}>{label}</Text>
            </View>
            <GlassCard variant="subtle" style={styles.pickerTrigger} contentStyle={styles.pickerTriggerContent}>
                <View style={styles.pickerValueRow}>
                    <Ionicons name={icon as any} size={20} color={colors.accent.teal} style={{ marginRight: 12 }} />
                    <Text style={[styles.pickerValue, { color: value ? colors.glass.text.primary : colors.glass.text.muted }]}>
                        {value || 'Seçiniz'}
                    </Text>
                </View>
                <Ionicons name="chevron-down" size={18} color={colors.glass.text.muted} />
            </GlassCard>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.primary.deep }]} edges={['top']}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.headerBtn}>
                        <Ionicons name="close-circle-outline" size={28} color={colors.glass.text.primary} />
                    </Pressable>
                    <Text style={[styles.title, { color: colors.glass.text.primary }]}>Profil Bilgileri</Text>
                    <Pressable onPress={handleSave} style={styles.headerBtn}>
                        <Text style={[styles.saveBtnText, { color: colors.accent.teal }]}>Bitti</Text>
                    </Pressable>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarCircle}>
                                <Ionicons name="person" size={48} color={isDark ? '#FFFFFF' : colors.primary.brand} />
                                <View style={[styles.editBadge, { backgroundColor: colors.accent.teal }]}>
                                    <Ionicons name="camera" size={14} color="#FFFFFF" />
                                </View>
                            </View>
                        </View>
                        <Text style={[styles.avatarHint, { color: colors.glass.text.muted }]}>Profil Fotoğrafını Güncelle</Text>
                    </View>

                    <GlassCard variant="elevated" style={styles.formCard} contentStyle={{ gap: 20 }}>
                        <View style={styles.row}>
                            <View style={{ flex: 1 }}>
                                <GlassInput label="Ad" value={form.firstName} onChangeText={(t) => handleChange('firstName', t)} placeholder="Adınız" />
                            </View>
                            <View style={{ width: 12 }} />
                            <View style={{ flex: 1 }}>
                                <GlassInput label="Soyad" value={form.lastName} onChangeText={(t) => handleChange('lastName', t)} placeholder="Soyadınız" />
                            </View>
                        </View>

                        <GlassInput label="E-posta" value={form.email} onChangeText={(t) => handleChange('email', t)} keyboardType="email-address" placeholder="ornek@fina.app" editable={false} />
                        <GlassInput label="Telefon" value={form.phone} onChangeText={(t) => handleChange('phone', t)} keyboardType="phone-pad" placeholder="+90 5xx xxx xx xx" />

                        <View style={styles.pickerGroup}>
                            <View style={styles.inputLabelContainer}>
                                <Text style={[styles.inputLabel, { color: colors.glass.text.muted }]}>Doğum Tarihi</Text>
                            </View>
                            <Pressable onPress={() => setShowDatePicker(true)}>
                                <GlassCard variant="subtle" style={styles.pickerTrigger} contentStyle={styles.pickerTriggerContent}>
                                    <View style={styles.pickerValueRow}>
                                        <Ionicons name="calendar-outline" size={20} color={colors.accent.teal} style={{ marginRight: 12 }} />
                                        <Text style={[styles.pickerValue, { color: form.birthDate ? colors.glass.text.primary : colors.glass.text.muted }]}>
                                            {form.birthDate || 'Seçiniz'}
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-down" size={18} color={colors.glass.text.muted} />
                                </GlassCard>
                            </Pressable>
                        </View>

                        <View style={styles.pickerGroup}>
                            <View style={styles.inputLabelContainer}>
                                <Text style={[styles.inputLabel, { color: colors.glass.text.muted }]}>Cinsiyet</Text>
                            </View>
                            <Pressable onPress={() => setShowGenderPicker(!showGenderPicker)}>
                                <GlassCard variant="subtle" style={styles.pickerTrigger} contentStyle={styles.pickerTriggerContent}>
                                    <View style={styles.pickerValueRow}>
                                        <Ionicons name="transgender-outline" size={20} color={colors.accent.teal} style={{ marginRight: 12 }} />
                                        <Text style={[styles.pickerValue, { color: form.gender ? colors.glass.text.primary : colors.glass.text.muted }]}>
                                            {form.gender || 'Seçiniz'}
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-down" size={18} color={colors.glass.text.muted} />
                                </GlassCard>
                            </Pressable>
                        </View>

                        {showGenderPicker && (
                            <View style={[styles.pickerContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                                <Picker
                                    selectedValue={form.gender}
                                    onValueChange={(itemValue) => {
                                        handleChange('gender', itemValue);
                                        setShowGenderPicker(false);
                                    }}
                                    style={{ color: colors.glass.text.primary }}
                                    dropdownIconColor={colors.glass.text.muted}
                                >
                                    <Picker.Item label="Seçiniz" value="" />
                                    <Picker.Item label="Erkek" value="Erkek" />
                                    <Picker.Item label="Kadın" value="Kadın" />
                                    <Picker.Item label="Belirtmek İstemiyorum" value="Belirtmek İstemiyorum" />
                                </Picker>
                            </View>
                        )}

                        <View style={styles.row}>
                            <View style={{ flex: 1 }}>
                                <GlassInput label="Ülke" value={form.country} onChangeText={(t) => handleChange('country', t)} placeholder="Türkiye" />
                            </View>
                            <View style={{ width: 12 }} />
                            <View style={{ flex: 1 }}>
                                <GlassInput label="Şehir" value={form.city} onChangeText={(t) => handleChange('city', t)} placeholder="İstanbul" />
                            </View>
                        </View>
                    </GlassCard>

                    <View style={{ marginTop: 10 }}>
                        <GlassButton title="Tüm Değişiklikleri Kaydet" onPress={handleSave} variant="primary" />
                    </View>
                </ScrollView>

                {showDatePicker && (
                    <DateTimePicker
                        value={form.birthDate ? new Date(form.birthDate.split('.').reverse().join('-')) : new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                                const formatted = selectedDate.toLocaleDateString('tr-TR');
                                handleChange('birthDate', formatted);
                            }
                        }}
                    />
                )}
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
    headerBtn: {
        minWidth: 44,
        height: 44,
        justifyContent: 'center',
    },
    saveBtnText: {
        fontFamily: FONTS.family.bold,
        fontSize: 16,
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
        marginBottom: 16,
    },
    avatarCircle: {
        width: 110,
        height: 110,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        position: 'relative',
    },
    editBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 32,
        height: 32,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    avatarHint: {
        fontFamily: FONTS.family.medium,
        fontSize: 13,
        opacity: 0.7,
    },
    formCard: {
        marginBottom: 20,
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderRadius: 32,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pickerGroup: {
        marginBottom: 4,
    },
    inputLabelContainer: {
        marginBottom: 8,
        paddingLeft: 4,
    },
    inputLabel: {
        fontFamily: FONTS.family.bold,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    pickerTrigger: {
        borderRadius: 16,
    },
    pickerTriggerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    pickerValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pickerValue: {
        fontFamily: FONTS.family.medium,
        fontSize: 15,
    },
    pickerContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 4,
        marginBottom: 12,
    }
});
