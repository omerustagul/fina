import { GlassButton, GlassCard, GlassInput } from '@/components/ui';
import { useAuthStore, UserProfile } from '@/stores/authStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const register = useAuthStore(state => state.register);

    const [form, setForm] = useState<UserProfile>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        birthDate: '',
        country: '',
        city: '',
        gender: '',
    });

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleChange = (key: keyof UserProfile, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            const formattedDate = selectedDate.toLocaleDateString('tr-TR');
            handleChange('birthDate', formattedDate);
        }
    };

    const handleDatePress = () => {
        setShowDatePicker(true);
    };

    const handleRegister = () => {
        const { firstName, lastName, email, password, phone, gender, country, city, birthDate } = form;

        // Validation
        if (!firstName || !lastName || !email || !password || !phone || !gender || !country || !city || !birthDate) {
            Alert.alert("Eksik Bilgi", "Lütfen tüm alanları doldurun.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Geçersiz E-posta", "Lütfen geçerli bir e-posta adresi girin.");
            return;
        }

        const phoneRegex = /^[0-9]{10,14}$/;
        if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
            Alert.alert("Geçersiz Telefon", "Telefon numarası geçersiz. Sadece rakam (10-14 hane) kullanınız.");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Geçersiz Şifre", "Şifreniz en az 6 karakter olmalıdır.");
            return;
        }

        const res = register(form);
        if (res.success) {
            router.replace('/(tabs)');
        } else {
            Alert.alert("Kayıt Başarısız", res.error);
        }
    };

    // Shared picker style
    const pickerContainerStyle = [
        styles.pickerContainer,
        {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: colors.glass.border.default
        }
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.primary.deep }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <View style={[styles.iconBox, { backgroundColor: `${colors.accent.purple}20` }]}>
                            <Ionicons name="person-add" size={40} color={colors.accent.purple} />
                        </View>
                        <Text style={[styles.title, { color: colors.glass.text.primary }]}>Hesap Oluştur</Text>
                        <Text style={[styles.subtitle, { color: colors.glass.text.secondary }]}>
                            Fina'ya katılmak için bilgilerinizi girin.
                        </Text>
                    </View>

                    <GlassCard variant="elevated" style={styles.formCard} contentStyle={{ gap: 16 }}>
                        <View style={styles.row}>
                            <View style={{ flex: 1 }}>
                                <GlassInput label="Adınız" value={form.firstName} onChangeText={(t) => handleChange('firstName', t)} placeholder="Örn: Ali" />
                            </View>
                            <View style={{ width: 16 }} />
                            <View style={{ flex: 1 }}>
                                <GlassInput label="Soyadınız" value={form.lastName} onChangeText={(t) => handleChange('lastName', t)} placeholder="Örn: Veli" />
                            </View>
                        </View>

                        <GlassInput label="E-posta" value={form.email} onChangeText={(t) => handleChange('email', t)} placeholder="ornek@mail.com" keyboardType="email-address" autoCapitalize="none" />
                        <GlassInput label="Şifre" value={form.password || ''} onChangeText={(t) => handleChange('password', t)} placeholder="En az 6 karakter" secureTextEntry />
                        <GlassInput label="Telefon" value={form.phone || ''} onChangeText={(t) => handleChange('phone', t)} placeholder="5XX XXX XX XX" keyboardType="phone-pad" />

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.glass.text.secondary }]}>Doğum Tarihi</Text>
                            <Pressable onPress={handleDatePress}>
                                <View pointerEvents="none">
                                    <GlassInput value={form.birthDate} placeholder="Tarih seçmek için dokunun" editable={false} />
                                </View>
                            </Pressable>

                            {showDatePicker && Platform.OS === 'ios' && (
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: colors.glass.surface.elevated, padding: 8, borderRadius: 12, marginTop: 4 }}>
                                    <DateTimePicker value={date} mode="date" display="compact" onChange={handleDateChange} themeVariant="dark" />
                                    <GlassButton title="Tamam" variant="secondary" onPress={() => setShowDatePicker(false)} style={{ width: 80, marginLeft: 16 }} />
                                </View>
                            )}

                            {showDatePicker && Platform.OS === 'android' && (
                                <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.glass.text.secondary }]}>Cinsiyet</Text>
                            <View style={pickerContainerStyle}>
                                <Picker
                                    selectedValue={form.gender}
                                    onValueChange={(v) => handleChange('gender', v as string)}
                                    dropdownIconColor={colors.glass.text.primary}
                                    style={{ color: colors.glass.text.primary, height: 50 }}
                                    itemStyle={{ fontSize: 15 }}
                                >
                                    <Picker.Item label="Seçiniz" value="" color={Platform.OS === 'ios' ? colors.glass.text.primary : '#888'} />
                                    <Picker.Item label="Erkek" value="Erkek" color={Platform.OS === 'ios' ? colors.glass.text.primary : undefined} />
                                    <Picker.Item label="Kadın" value="Kadın" color={Platform.OS === 'ios' ? colors.glass.text.primary : undefined} />
                                    <Picker.Item label="Belirtmek İstemiyorum" value="Belirtmek İstemiyorum" color={Platform.OS === 'ios' ? colors.glass.text.primary : undefined} />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={[styles.label, { color: colors.glass.text.secondary }]}>Ülke</Text>
                                <View style={pickerContainerStyle}>
                                    <Picker
                                        selectedValue={form.country}
                                        onValueChange={(v) => handleChange('country', v as string)}
                                        dropdownIconColor={colors.glass.text.primary}
                                        style={{ color: colors.glass.text.primary, height: 50 }}
                                    >
                                        <Picker.Item label="Seçiniz" value="" color={Platform.OS === 'ios' ? colors.glass.text.primary : '#888'} />
                                        <Picker.Item label="Türkiye" value="Türkiye" color={Platform.OS === 'ios' ? colors.glass.text.primary : undefined} />
                                        <Picker.Item label="Diğer" value="Diğer" color={Platform.OS === 'ios' ? colors.glass.text.primary : undefined} />
                                    </Picker>
                                </View>
                            </View>
                            <View style={{ width: 16 }} />
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={[styles.label, { color: colors.glass.text.secondary }]}>Şehir</Text>
                                <View style={pickerContainerStyle}>
                                    <Picker
                                        selectedValue={form.city}
                                        onValueChange={(v) => handleChange('city', v as string)}
                                        dropdownIconColor={colors.glass.text.primary}
                                        style={{ color: colors.glass.text.primary, height: 50 }}
                                    >
                                        <Picker.Item label="Seçiniz" value="" color={Platform.OS === 'ios' ? colors.glass.text.primary : '#888'} />
                                        <Picker.Item label="İstanbul" value="İstanbul" color={Platform.OS === 'ios' ? colors.glass.text.primary : undefined} />
                                        <Picker.Item label="Ankara" value="Ankara" color={Platform.OS === 'ios' ? colors.glass.text.primary : undefined} />
                                        <Picker.Item label="İzmir" value="İzmir" color={Platform.OS === 'ios' ? colors.glass.text.primary : undefined} />
                                        <Picker.Item label="Diğer" value="Diğer" color={Platform.OS === 'ios' ? colors.glass.text.primary : undefined} />
                                    </Picker>
                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: 16 }}>
                            <GlassButton title="Kayıt Ol" onPress={handleRegister} variant="primary" />
                        </View>
                    </GlassCard>

                    <View style={styles.footer}>
                        <GlassButton title="Giriş Ekranına Dön" variant="secondary" onPress={() => router.back()} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: {
        padding: 24,
        flexGrow: 1,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
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
        marginBottom: 24,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputGroup: {
        marginBottom: -8, // compensate card gap if needed
    },
    label: {
        fontFamily: FONTS.family.medium,
        fontSize: 13,
        marginBottom: 8,
        marginLeft: 4,
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 16,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    footer: {
        marginBottom: 40,
    }
});
