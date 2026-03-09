import { GlassButton, GlassCard, GlassInput } from '@/components/ui';
import { useFinanceStore } from '@/stores/financeStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Reminder } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const REMINDER_TYPES: Array<{ id: Reminder['type'], name: string, icon: any, color: string }> = [
    { id: 'bill', name: 'Fatura', icon: 'receipt-outline', color: '#FF6B6B' },
    { id: 'debt_given', name: 'Alacaklıyım', icon: 'arrow-up-circle-outline', color: '#4ECDC4' },
    { id: 'debt_taken', name: 'Borçluyum', icon: 'arrow-down-circle-outline', color: '#FF6B6B' },
    { id: 'other', name: 'Diğer', icon: 'notifications-outline', color: '#B8B8B8' },
];

export default function AddReminderModal() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useTheme();
    const { id } = useLocalSearchParams<{ id?: string }>();

    const reminders = useFinanceStore((state) => state.reminders);
    const addReminder = useFinanceStore((state) => state.addReminder);
    const updateReminder = useFinanceStore((state) => state.updateReminder);
    const deleteReminder = useFinanceStore((state) => state.deleteReminder);

    const existingReminder = id ? reminders.find(r => r.id === id) : null;

    const [title, setTitle] = useState(existingReminder?.title || '');
    const [amount, setAmount] = useState(existingReminder?.amount?.toString() || '');
    const [type, setType] = useState<Reminder['type']>(existingReminder?.type || 'bill');
    const [date, setDate] = useState(existingReminder ? new Date(existingReminder.dueDate) : new Date());
    const [notify, setNotify] = useState(existingReminder?.notify ?? true);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSave = () => {
        if (!title) return;

        const reminderData = {
            title,
            amount: amount ? parseFloat(amount) : undefined,
            type,
            dueDate: date.getTime(),
            notify
        };

        if (existingReminder) {
            updateReminder(existingReminder.id, reminderData);
        } else {
            addReminder(reminderData);
        }
        router.back();
    };

    const handleDelete = () => {
        if (existingReminder) {
            deleteReminder(existingReminder.id);
            router.back();
        }
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) setDate(selectedDate);
    };

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeIn.duration(300)} style={StyleSheet.absoluteFill}>
                <BlurView intensity={Platform.OS === 'ios' ? 40 : 100} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
                <Pressable style={StyleSheet.absoluteFill} onPress={() => router.back()} />
            </Animated.View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <Animated.View
                    entering={SlideInDown.springify().damping(25).stiffness(200)}
                    style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}
                    pointerEvents="box-none"
                >
                    <GlassCard variant="elevated" intensity={40} style={styles.glassCard} contentStyle={{ padding: 0 }}>
                        <View style={styles.header}>
                            <View style={styles.headerIndicator} />
                            <View style={styles.headerRow}>
                                <Text style={[styles.headerTitle, { color: colors.glass.text.primary }]}>
                                    {existingReminder ? 'Hatırlatıcıyı Düzenle' : 'Yeni Hatırlatıcı'}
                                </Text>
                                <Pressable onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: colors.glass.surface.secondary }]}>
                                    <Ionicons name="close" size={20} color={colors.glass.text.primary} />
                                </Pressable>
                            </View>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            <View style={styles.inputSection}>
                                <Text style={[styles.label, { color: colors.glass.text.muted }]}>Açıklama</Text>
                                <GlassInput
                                    placeholder="Örn: Ev Kirası, Ahmet'e borç"
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>

                            <View style={styles.inputSection}>
                                <Text style={[styles.label, { color: colors.glass.text.muted }]}>Tutar (Opsiyonel)</Text>
                                <GlassInput
                                    placeholder="0,00"
                                    keyboardType="numeric"
                                    value={amount}
                                    onChangeText={setAmount}
                                />
                            </View>

                            <View style={styles.section}>
                                <Text style={[styles.label, { color: colors.glass.text.muted }]}>Hatırlatıcı Türü</Text>
                                <View style={styles.typeGrid}>
                                    {REMINDER_TYPES.map((t) => (
                                        <Pressable
                                            key={t.id}
                                            onPress={() => setType(t.id)}
                                            style={[
                                                styles.typeBtn,
                                                { backgroundColor: colors.glass.surface.secondary },
                                                type === t.id && { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderColor: colors.primary.brand, borderWidth: 1 }
                                            ]}
                                        >
                                            <Ionicons name={t.icon} size={20} color={type === t.id ? colors.primary.brand : colors.glass.text.secondary} />
                                            <Text style={[styles.typeText, { color: type === t.id ? colors.primary.brand : colors.glass.text.secondary }]}>
                                                {t.name}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={[styles.label, { color: colors.glass.text.muted }]}>Vade Tarihi</Text>
                                <Pressable
                                    onPress={() => setShowDatePicker(true)}
                                    style={[styles.dateSelector, { backgroundColor: colors.glass.surface.secondary }]}
                                >
                                    <Ionicons name="calendar-outline" size={20} color={colors.primary.brand} />
                                    <Text style={[styles.dateText, { color: colors.glass.text.primary }]}>
                                        {format(date, 'd MMMM yyyy', { locale: tr })}
                                    </Text>
                                    <Ionicons name="chevron-forward" size={16} color={colors.glass.text.muted} />
                                </Pressable>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={onDateChange}
                                        minimumDate={new Date()}
                                    />
                                )}
                            </View>

                            <Pressable
                                onPress={() => setNotify(!notify)}
                                style={styles.notifyRow}
                            >
                                <View style={styles.notifyLabelArea}>
                                    <Text style={[styles.notifyTitle, { color: colors.glass.text.primary }]}>Bildirim Gönder</Text>
                                    <Text style={[styles.notifySub, { color: colors.glass.text.muted }]}>
                                        Tarihi yaklaştığında seni uyaralım.
                                    </Text>
                                </View>
                                <View style={[
                                    styles.toggle,
                                    { backgroundColor: notify ? colors.accent.teal : colors.glass.surface.secondary }
                                ]}>
                                    <View style={[styles.toggleThumb, notify && { alignSelf: 'flex-end' }]} />
                                </View>
                            </Pressable>

                            <View style={styles.footer}>
                                <GlassButton
                                    title={existingReminder ? "Güncelle" : "Hatırlatıcı Oluştur"}
                                    onPress={handleSave}
                                    variant="primary"
                                    disabled={!title}
                                />
                                {existingReminder && (
                                    <Pressable
                                        onPress={handleDelete}
                                        style={styles.deleteBtn}
                                    >
                                        <Text style={{ color: colors.accent.red, fontFamily: FONTS.family.bold, fontSize: 14 }}>Sil</Text>
                                    </Pressable>
                                )}
                            </View>
                        </ScrollView>
                    </GlassCard>
                </Animated.View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-end' },
    keyboardView: { width: '100%' },
    modalContent: { width: '100%', paddingHorizontal: 16 },
    glassCard: { borderRadius: 40, overflow: 'hidden' },
    header: { paddingTop: 12, paddingBottom: 8, alignItems: 'center' },
    headerIndicator: { width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)', marginBottom: 16 },
    headerRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24 },
    headerTitle: { fontFamily: FONTS.family.bold, fontSize: 20 },
    closeBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 24 },
    inputSection: { marginBottom: 20 },
    section: { marginBottom: 20 },
    label: { fontFamily: FONTS.family.bold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
    typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    typeBtn: { flexBasis: '48%', height: 44, borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8, borderWidth: 1, borderColor: 'transparent' },
    typeText: { fontFamily: FONTS.family.bold, fontSize: 13 },
    dateSelector: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, gap: 12 },
    dateText: { flex: 1, fontFamily: FONTS.family.bold, fontSize: 15 },
    notifyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 },
    notifyLabelArea: { flex: 1 },
    notifyTitle: { fontFamily: FONTS.family.bold, fontSize: 15, marginBottom: 2 },
    notifySub: { fontFamily: FONTS.family.medium, fontSize: 12 },
    toggle: { width: 44, height: 24, borderRadius: 12, padding: 2, justifyContent: 'center' },
    toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFF' },
    footer: { marginTop: 24, marginBottom: 20 },
    deleteBtn: { marginTop: 16, alignSelf: 'center', padding: 8 }
});
