import { GlassButton, GlassCard, GlassInput } from '@/components/ui';
import { CreditCard, useCreditCardStore } from '@/stores/creditCardStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInRight, FadeOutLeft, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BANKS = [
    { name: 'Garanti BBVA', color: '#0A8A41' },
    { name: 'Yapı Kredi', color: '#004C92' },
    { name: 'İş Bankası', color: '#002D72' },
    { name: 'Akbank', color: '#E1001A' },
    { name: 'Ziraat', color: '#E31837' },
    { name: 'QNB FINANSBANK', color: '#271160' },
    { name: 'Enpara', color: '#911D4B' },
    { name: 'Vakıfbank', color: '#FFB600' },
    { name: 'Denizbank', color: '#004B87' },
    { name: 'Halkbank', color: '#0097DA' },
    { name: 'Diğer', color: '#666666' }
];

const COLORS = ['#0A8A41', '#004C92', '#002D72', '#E1001A', '#E31837', '#271160', '#911D4B', '#FFB600', '#004B87', '#0097DA', '#1C1C1E', '#4ECDC4'];
const NETWORKS = ['visa', 'mastercard', 'troy', 'amex'] as const;

export default function AddCardModal() {
    const router = useRouter();
    const { editId } = useLocalSearchParams<{ editId?: string }>();
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useTheme();
    const { addCard, updateCard, cards } = useCreditCardStore();

    const [step, setStep] = useState(1);
    const [showPicker, setShowPicker] = useState<'due' | 'closing' | null>(null);

    const [form, setForm] = useState<Partial<CreditCard>>({
        bankName: '',
        cardName: '',
        lastFourDigits: '',
        creditLimit: 0,
        currentDebt: 0,
        statementDebt: 0,
        minimumPaymentMode: 'auto',
        paymentDueDate: Date.now() + 10 * 86400000,
        statementClosingDate: Date.now(),
        color: COLORS[0],
        cardNetwork: 'visa',
        isActive: true,
    });

    useEffect(() => {
        if (editId) {
            const existing = cards.find(c => c.id === editId);
            if (existing) {
                setForm(existing);
            }
        }
    }, [editId, cards]);

    const updateForm = (key: keyof CreditCard, value: any) => {
        setForm(prev => {
            const next = { ...prev, [key]: value };
            if (key === 'bankName') {
                const bankObj = BANKS.find(b => b.name === value);
                if (bankObj) {
                    next.color = bankObj.color;
                }
            }
            return next;
        });
    };

    const nextStep = () => {
        if (step === 1 && !form.bankName) {
            Alert.alert('Eksik Bilgi', 'Lütfen bir banka seçin.');
            return;
        }
        if (step === 2 && (!form.creditLimit || form.creditLimit <= 0)) {
            Alert.alert('Geçersiz Tutar', 'Lütfen geçerli bir limit girin.');
            return;
        }
        if (step === 3 && (!form.statementDebt || form.statementDebt < 0)) {
            Alert.alert('Geçersiz', 'Hesap özeti borcu geçerli değil.');
            return;
        }
        setStep(s => s + 1);
    };

    const handleSave = () => {
        const minPayment = form.minimumPaymentMode === 'auto'
            ? Math.max(100, (form.statementDebt || 0) * 0.20)
            : 0; // default auto logic 

        if (editId) {
            updateCard(editId, {
                ...form,
                minimumPayment: minPayment
            });
        } else {
            addCard({
                ...(form as Omit<CreditCard, 'id' | 'createdAt'>),
                minimumPayment: minPayment
            });
        }

        router.back();
    };

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeIn.duration(300)} style={StyleSheet.absoluteFill}>
                <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)' }]} onPress={() => router.back()} />
            </Animated.View>

            <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
                <Animated.View
                    entering={SlideInDown.springify().damping(25).stiffness(200)}
                    style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}
                >
                    <GlassCard variant="elevated" intensity={40} style={styles.glassCard} contentStyle={{ padding: 20 }}>
                        <View style={styles.header}>
                            <View style={styles.headerIndicator} />
                            <View style={styles.headerRow}>
                                <Text style={[styles.headerTitle, { color: colors.glass.text.primary }]}>
                                    Adım {step}/4
                                </Text>
                                <Pressable onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: colors.glass.surface.secondary }]}>
                                    <Ionicons name="close" size={20} color={colors.glass.text.primary} />
                                </Pressable>
                            </View>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${(step / 4) * 100}%`, backgroundColor: colors.primary.brand }]} />
                            </View>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 16 }}>

                            {step === 1 && (
                                <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
                                    <Text style={[styles.stepTitle, { color: colors.glass.text.primary }]}>Banka Seçin</Text>
                                    <Text style={[styles.stepSubtitle, { color: colors.glass.text.secondary }]}>Kredi kartınız hangi bankaya ait?</Text>

                                    <View style={styles.bankGrid}>
                                        {BANKS.map(bank => (
                                            <Pressable
                                                key={bank.name}
                                                onPress={() => updateForm('bankName', bank.name)}
                                                style={[
                                                    styles.bankItem,
                                                    { backgroundColor: colors.glass.surface.secondary, borderColor: form.bankName === bank.name ? colors.primary.brand : colors.glass.border.subtle },
                                                    form.bankName === bank.name && { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(108,60,225,0.08)', borderWidth: 2 }
                                                ]}
                                            >
                                                <View style={[styles.bankColorBubble, { backgroundColor: bank.color }]} />
                                                <Text style={[styles.bankText, { color: colors.glass.text.primary }]}>{bank.name}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </Animated.View>
                            )}

                            {step === 2 && (
                                <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
                                    <Text style={[styles.stepTitle, { color: colors.glass.text.primary }]}>Kart Bilgileri</Text>
                                    <Text style={[styles.stepSubtitle, { color: colors.glass.text.secondary }]}>Kullanılabilir limitinizi ve borcunuzu girin.</Text>

                                    <View style={{ gap: 16, marginTop: 16 }}>
                                        <GlassInput
                                            label="Kart Adı (Örn: Bonus, Maximum)"
                                            placeholder="İsteğe bağlı"
                                            value={form.cardName}
                                            onChangeText={(t) => updateForm('cardName', t)}
                                        />
                                        <GlassInput
                                            label="Son 4 Hane"
                                            placeholder="1234"
                                            maxLength={4}
                                            keyboardType="numeric"
                                            value={form.lastFourDigits}
                                            onChangeText={(t) => updateForm('lastFourDigits', t)}
                                        />
                                        <View style={{ flexDirection: 'row', gap: 12 }}>
                                            <View style={{ flex: 1 }}>
                                                <GlassInput
                                                    label="Toplam Limit (₺)"
                                                    placeholder="0"
                                                    keyboardType="numeric"
                                                    value={form.creditLimit?.toString() || ''}
                                                    onChangeText={(t) => updateForm('creditLimit', parseFloat(t) || 0)}
                                                />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <GlassInput
                                                    label="Güncel Borç (₺)"
                                                    placeholder="0"
                                                    keyboardType="numeric"
                                                    value={form.currentDebt?.toString() || ''}
                                                    onChangeText={(t) => updateForm('currentDebt', parseFloat(t) || 0)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </Animated.View>
                            )}

                            {step === 3 && (
                                <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
                                    <Text style={[styles.stepTitle, { color: colors.glass.text.primary }]}>Ödeme ve Ekstre</Text>
                                    <Text style={[styles.stepSubtitle, { color: colors.glass.text.secondary }]}>Ödeme planını hesaplayabilmemiz için gerekli.</Text>

                                    <View style={{ gap: 16, marginTop: 16 }}>
                                        <GlassInput
                                            label="Bu Ayki Ekstre Borcu (₺)"
                                            placeholder="0"
                                            keyboardType="numeric"
                                            value={form.statementDebt?.toString() || ''}
                                            onChangeText={(t) => updateForm('statementDebt', parseFloat(t) || 0)}
                                        />

                                        <View style={{ flexDirection: 'row', gap: 12 }}>
                                            <Pressable style={{ flex: 1 }} onPress={() => setShowPicker('closing')}>
                                                <GlassInput
                                                    label="Hesap Kesim"
                                                    value={new Date(form.statementClosingDate || Date.now()).toLocaleDateString('tr-TR')}
                                                    editable={false}
                                                    pointerEvents="none"
                                                />
                                            </Pressable>
                                            <Pressable style={{ flex: 1 }} onPress={() => setShowPicker('due')}>
                                                <GlassInput
                                                    label="Son Ödeme"
                                                    value={new Date(form.paymentDueDate || Date.now()).toLocaleDateString('tr-TR')}
                                                    editable={false}
                                                    pointerEvents="none"
                                                />
                                            </Pressable>
                                        </View>

                                        {showPicker && (
                                            <DateTimePicker
                                                value={new Date(showPicker === 'due' ? (form.paymentDueDate || Date.now()) : (form.statementClosingDate || Date.now()))}
                                                mode="date"
                                                display="default"
                                                onChange={(event, selectedDate) => {
                                                    setShowPicker(null);
                                                    if (selectedDate) {
                                                        const key = showPicker === 'due' ? 'paymentDueDate' : 'statementClosingDate';
                                                        updateForm(key, selectedDate.getTime());
                                                    }
                                                }}
                                            />
                                        )}

                                        <View style={[styles.infoBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', borderColor: colors.glass.border.default }]}>
                                            <Ionicons name="information-circle" size={24} color={colors.accent.teal} />
                                            <Text style={[styles.infoText, { color: colors.glass.text.secondary }]}>
                                                Asgari ödeme tutarı %20 varsayılarak (BDDK) Fina AI tarafından hesaplanacaktır.
                                            </Text>
                                        </View>
                                    </View>
                                </Animated.View>
                            )}

                            {step === 4 && (
                                <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
                                    <Text style={[styles.stepTitle, { color: colors.glass.text.primary }]}>Görünüm</Text>
                                    <Text style={[styles.stepSubtitle, { color: colors.glass.text.secondary }]}>Kartın Finda uygulamasında nasıl görünecek?</Text>

                                    <View style={{ gap: 24, marginTop: 16 }}>
                                        <View>
                                            <Text style={[styles.label, { color: colors.glass.text.muted }]}>Kart Ağı (Network)</Text>
                                            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                                                {NETWORKS.map(net => (
                                                    <Pressable
                                                        key={net}
                                                        onPress={() => updateForm('cardNetwork', net)}
                                                        style={[
                                                            styles.networkOption,
                                                            { borderColor: form.cardNetwork === net ? colors.primary.brand : colors.glass.border.subtle },
                                                            form.cardNetwork === net && { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(108,60,225,0.1)' }
                                                        ]}
                                                    >
                                                        {net === 'troy' ? (
                                                            <MaterialCommunityIcons name="credit-card-outline" size={24} color={colors.glass.text.primary} />
                                                        ) : (
                                                            <FontAwesome5
                                                                name={net === 'visa' ? 'cc-visa' : net === 'mastercard' ? 'cc-mastercard' : 'cc-amex'}
                                                                size={24}
                                                                color={colors.glass.text.primary}
                                                            />
                                                        )}
                                                    </Pressable>
                                                ))}
                                            </View>
                                        </View>

                                        <View>
                                            <Text style={[styles.label, { color: colors.glass.text.muted }]}>Renk</Text>
                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                                                {COLORS.map(c => (
                                                    <Pressable
                                                        key={c}
                                                        onPress={() => updateForm('color', c)}
                                                        style={[
                                                            styles.colorOption,
                                                            { backgroundColor: c },
                                                            form.color === c && styles.colorOptionSelected
                                                        ]}
                                                    >
                                                        {form.color === c && <Ionicons name="checkmark" size={16} color="#FFF" />}
                                                    </Pressable>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                </Animated.View>
                            )}

                        </ScrollView>

                        <View style={styles.footer}>
                            {step > 1 && (
                                <GlassButton
                                    title="Geri"
                                    variant="secondary"
                                    onPress={() => setStep(s => s - 1)}
                                    style={{ flex: 1, marginRight: 8 }}
                                />
                            )}
                            <GlassButton
                                title={step === 4 ? (editId ? "Güncelle" : "Kartı Ekle") : "İleri"}
                                variant="primary"
                                onPress={step === 4 ? handleSave : nextStep}
                                style={{ flex: 2 }}
                            />
                        </View>
                    </GlassCard>
                </Animated.View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    keyboardView: {
        width: '100%',
    },
    modalContent: {
        width: '100%',
        paddingHorizontal: 8,
    },
    glassCard: {
        borderRadius: 40,
        overflow: 'hidden',
    },
    header: {
        alignItems: 'center',
    },
    headerIndicator: {
        width: 40,
        height: 6,
        borderRadius: 6,
        backgroundColor: 'rgba(150, 150, 150, 0.4)',
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
    },
    headerTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 18,
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBar: {
        width: '100%',
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(150,150,150,0.2)',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    stepTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 24,
        marginBottom: 8,
    },
    stepSubtitle: {
        fontFamily: FONTS.family.regular,
        fontSize: 15,
        marginBottom: 20,
    },
    bankGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    bankItem: {
        width: '48%',
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
    },
    bankColorBubble: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: 10,
    },
    bankText: {
        fontFamily: FONTS.family.medium,
        fontSize: 13,
        flex: 1,
    },
    label: {
        fontFamily: FONTS.family.medium,
        fontSize: 14,
    },
    networkOption: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorOptionSelected: {
        borderColor: '#FFF',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    infoBox: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontFamily: FONTS.family.regular,
        fontSize: 13,
    },
    footer: {
        flexDirection: 'row',
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(150,150,150,0.1)',
    }
});
