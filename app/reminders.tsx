import { GlassCard } from '@/components/ui';
import { useFinanceStore } from '@/stores/financeStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Reminder } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const REMINDER_TYPES = [
    { id: 'all', name: 'Hepsi', icon: 'list' },
    { id: 'bill', name: 'Faturalar', icon: 'receipt-outline' },
    { id: 'debt_given', name: 'Alacaklar', icon: 'arrow-up-outline' },
    { id: 'debt_taken', name: 'Borçlar', icon: 'arrow-down-outline' },
];

export default function RemindersScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useTheme();
    const reminders = useFinanceStore((state) => state.reminders || []);
    const toggleReminderStatus = useFinanceStore((state) => state.toggleReminderStatus);
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredReminders = reminders.filter(r =>
        activeFilter === 'all' || r.type === activeFilter
    ).sort((a, b) => a.dueDate - b.dueDate);

    const getRemainingDays = (dueDate: number) => {
        const diff = dueDate - Date.now();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days < 0) return 'Gecikti';
        if (days === 0) return 'Bugün';
        if (days === 1) return 'Yarın';
        return `${days} gün kaldı`;
    };

    const getTypeDetails = (type: Reminder['type']) => {
        switch (type) {
            case 'bill': return { label: 'Fatura', color: colors.accent.red, icon: 'receipt-outline' };
            case 'debt_given': return { label: 'Alacak', color: colors.accent.teal, icon: 'arrow-up-outline' };
            case 'debt_taken': return { label: 'Borç', color: colors.accent.red, icon: 'arrow-down-outline' };
            default: return { label: 'Diğer', color: '#B8B8B8', icon: 'notifications-outline' };
        }
    };

    const renderReminderItem = ({ item, index }: { item: Reminder, index: number }) => {
        const details = getTypeDetails(item.type);
        const remainingStr = getRemainingDays(item.dueDate);
        const isOverdue = remainingStr === 'Gecikti';

        const getActionLabel = () => {
            if (item.isCompleted) return 'Geri Al';
            switch (item.type) {
                case 'bill': return 'Ödedim';
                case 'debt_given': return 'Aldım';
                case 'debt_taken': return 'Ödedim';
                default: return 'Tamamla';
            }
        };

        return (
            <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
                <Pressable onPress={() => router.push({ pathname: '/modals/add-reminder', params: { id: item.id } } as any)}>
                    <GlassCard
                        variant="subtle"
                        style={[
                            styles.reminderCard,
                            item.isCompleted ? { opacity: 0.7 } : null
                        ] as ViewStyle[]}
                    >
                        <View style={styles.reminderMain}>
                            <View style={[styles.typeIcon, { backgroundColor: `${details.color}15` }]}>
                                <Ionicons name={details.icon as any} size={20} color={details.color} />
                            </View>

                            <View style={styles.reminderInfo}>
                                <Text style={[
                                    styles.reminderTitle,
                                    { color: colors.glass.text.primary },
                                    item.isCompleted && { textDecorationLine: 'line-through' }
                                ]} numberOfLines={1}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.reminderSub, { color: colors.glass.text.secondary }]}>
                                    {format(new Date(item.dueDate), 'd MMMM yyyy', { locale: tr })} • {details.label}
                                </Text>
                            </View>

                            {item.amount && (
                                <Text style={[styles.amountText, { color: colors.glass.text.primary }]}>
                                    ₺{item.amount.toLocaleString('tr-TR')}
                                </Text>
                            )}
                        </View>

                        <View style={styles.cardFooter}>
                            <View style={[styles.statusBadge, { backgroundColor: item.isCompleted ? `${colors.accent.teal}15` : isOverdue ? `${colors.accent.red}20` : `${colors.accent.teal}15` }]}>
                                <View style={[styles.statusDot, { backgroundColor: item.isCompleted ? colors.accent.teal : isOverdue ? colors.accent.red : colors.accent.teal }]} />
                                <Text style={[styles.statusText, { color: item.isCompleted ? colors.accent.teal : isOverdue ? colors.accent.red : colors.accent.teal }]}>
                                    {item.isCompleted ? 'Tamamlandı' : remainingStr}
                                </Text>
                            </View>

                            <Pressable
                                onPress={() => toggleReminderStatus(item.id)}
                                style={[
                                    styles.actionBtn,
                                    { backgroundColor: item.isCompleted ? colors.glass.surface.secondary : colors.primary.brand }
                                ]}
                            >
                                <Text style={[
                                    styles.actionBtnText,
                                    { color: item.isCompleted ? colors.glass.text.secondary : '#FFF' }
                                ]}>
                                    {getActionLabel()}
                                </Text>
                            </Pressable>
                        </View>
                    </GlassCard>
                </Pressable>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.primary.deep }]} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={28} color={colors.glass.text.primary} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.glass.text.primary }]}>Hatırlatmalar</Text>
                </View>
                <Pressable
                    onPress={() => router.push('/modals/add-reminder' as any)}
                    style={[styles.headerAddBtn, { backgroundColor: colors.primary.brand }]}
                >
                    <Ionicons name="add" size={24} color="#FFF" />
                </Pressable>
            </View>

            <View style={{ flex: 1 }}>
                <View style={styles.filterSection}>
                    <FlatList
                        data={REMINDER_TYPES}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterList}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => setActiveFilter(item.id)}
                                style={[
                                    styles.filterItem,
                                    { backgroundColor: colors.glass.surface.secondary },
                                    activeFilter === item.id && { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderColor: colors.primary.brand, borderWidth: 1 }
                                ]}
                            >
                                <Ionicons
                                    name={item.icon as any}
                                    size={16}
                                    color={activeFilter === item.id ? colors.primary.brand : colors.glass.text.secondary}
                                />
                                <Text style={[
                                    styles.filterText,
                                    { color: activeFilter === item.id ? colors.primary.brand : colors.glass.text.secondary }
                                ]}>
                                    {item.name}
                                </Text>
                            </Pressable>
                        )}
                    />
                </View>

                <FlatList
                    data={filteredReminders}
                    keyExtractor={(item) => item.id}
                    renderItem={renderReminderItem}
                    contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="notifications-off-outline" size={64} color={colors.glass.text.muted} />
                            <Text style={[styles.emptyTitle, { color: colors.glass.text.secondary }]}>Henüz hatırlatıcı yok</Text>
                            <Text style={[styles.emptySub, { color: colors.glass.text.muted }]}>
                                Borç, fatura veya önemli ödemelerini burada takip edebilirsin.
                            </Text>
                        </View>
                    }
                />
            </View>
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
        paddingVertical: 12,
        marginBottom: 8,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    backBtn: {
        padding: 4,
        marginLeft: -4,
    },
    headerTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 24,
    },
    headerAddBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    filterSection: { marginBottom: 16 },
    filterList: { paddingHorizontal: 20, gap: 10 },
    filterItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 8, borderWidth: 1, borderColor: 'transparent' },
    filterText: { fontFamily: FONTS.family.bold, fontSize: 13 },
    listContent: { paddingHorizontal: 20, gap: 12 },
    reminderCard: { padding: 16 },
    reminderMain: { flexDirection: 'row', alignItems: 'center' },
    typeIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    reminderInfo: { flex: 1 },
    reminderTitle: { fontFamily: FONTS.family.bold, fontSize: 16, marginBottom: 2 },
    reminderSub: { fontFamily: FONTS.family.medium, fontSize: 12 },
    amountText: { fontFamily: FONTS.family.bold, fontSize: 16 },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)'
    },
    actionBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionBtnText: {
        fontFamily: FONTS.family.bold,
        fontSize: 12,
    },
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, gap: 6 },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusText: { fontFamily: FONTS.family.bold, fontSize: 11 },
    emptyContainer: { alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
    emptyTitle: { fontFamily: FONTS.family.bold, fontSize: 18, marginTop: 16 },
    emptySub: { fontFamily: FONTS.family.medium, fontSize: 14, textAlign: 'center', marginTop: 8 },
});
