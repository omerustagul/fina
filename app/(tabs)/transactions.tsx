import { GlassInput, TransactionCard } from '@/components/ui';
import { useFinanceStore } from '@/stores/financeStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { format, isToday, isYesterday } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionsScreen() {
    const router = useRouter();
    const { transactions, deleteTransaction } = useFinanceStore();
    const { colors, isDark } = useTheme();
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'income' | 'expense'>('all');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const matchesSearch = tx.title.toLowerCase().includes(search.toLowerCase());
            const matchesFilter = activeFilter === 'all' || tx.type === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [transactions, search, activeFilter]);

    const sections = useMemo(() => {
        const groups: Record<string, any[]> = {};
        filteredTransactions.forEach(tx => {
            const date = new Date(tx.date);
            let title = format(date, 'd MMMM yyyy', { locale: tr });
            if (isToday(date)) title = 'Bugün';
            else if (isYesterday(date)) title = 'Dün';

            if (!groups[title]) groups[title] = [];
            groups[title].push(tx);
        });
        return Object.keys(groups).map(title => ({ title, data: groups[title] }));
    }, [filteredTransactions]);

    const handleDelete = (id: string, title: string) => {
        Alert.alert(
            "İşlemi Sil",
            `"${title}" işlemini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
            [
                { text: "İptal", style: "cancel" },
                {
                    text: "Sil",
                    style: "destructive",
                    onPress: () => deleteTransaction(id)
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.primary.deep }]} edges={['top']}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.glass.text.primary }]}>İşlemler</Text>
                <View style={styles.headerActions}>
                    <Pressable
                        style={[styles.actionBtn, { backgroundColor: `${colors.accent.amber}20` }]}
                        onPress={() => router.push('/modals/add-scan' as any)}
                    >
                        <Ionicons name="camera" size={20} color={colors.accent.amber} />
                    </Pressable>
                    <Pressable
                        style={[styles.actionBtn, { backgroundColor: `${colors.accent.purple}20` }]}
                        onPress={() => router.push('/modals/add-voice' as any)}
                    >
                        <Ionicons name="mic" size={20} color={colors.accent.purple} />
                    </Pressable>
                    <Pressable
                        style={[styles.actionBtn, { backgroundColor: colors.primary.brand }]}
                        onPress={() => router.push('/modals/add-transaction')}
                    >
                        <Ionicons name="add" size={24} color="#FFFFFF" />
                    </Pressable>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <GlassInput
                    placeholder="İşlem ara..."
                    value={search}
                    onChangeText={setSearch}
                    containerStyle={styles.searchInput}
                />
            </View>

            <View style={styles.filterTabs}>
                {['all', 'income', 'expense'].map((f) => (
                    <Pressable
                        key={f}
                        onPress={() => setActiveFilter(f as any)}
                        style={[
                            styles.filterTab,
                            { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(108, 60, 225, 0.05)' },
                            activeFilter === f && { backgroundColor: colors.primary.brand }
                        ]}
                    >
                        <Text style={[
                            styles.filterText,
                            { color: activeFilter === f ? '#FFFFFF' : colors.glass.text.muted }
                        ]}>
                            {f === 'all' ? 'Tümü' : f === 'income' ? 'Gelir' : 'Gider'}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {filteredTransactions.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={[styles.emptyIconBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                        <Ionicons name="receipt-outline" size={48} color={colors.glass.text.muted} />
                    </View>
                    <Text style={[styles.emptyTitle, { color: colors.glass.text.primary }]}>İşlem Bulunamadı</Text>
                    <Text style={[styles.emptyText, { color: colors.glass.text.muted }]}>
                        {search ? "Aramanızla eşleşen işlem yok." : "Henüz herhangi bir finansal işlem kaydetmediniz."}
                    </Text>
                    {!search && (
                        <Pressable
                            style={[styles.emptyBtn, { backgroundColor: colors.accent.teal }]}
                            onPress={() => router.push('/modals/add-transaction')}
                        >
                            <Text style={styles.emptyBtnText}>Yeni İşlem Ekle</Text>
                        </Pressable>
                    )}
                </View>
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TransactionCard
                            transaction={item}
                            onPress={() => router.push({ pathname: '/modals/add-transaction', params: { id: item.id } } as any)}
                            onEdit={() => router.push({ pathname: '/modals/add-transaction', params: { id: item.id } } as any)}
                            onDelete={() => handleDelete(item.id, item.title)}
                        />
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={[styles.sectionTitle, { color: colors.glass.text.muted }]}>{title}</Text>
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    title: {
        fontFamily: FONTS.family.bold,
        fontSize: 28,
        letterSpacing: -0.5,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    searchInput: {
        height: 50,
    },
    filterTabs: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 10,
        marginBottom: 20,
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    filterText: {
        fontFamily: FONTS.family.medium,
        fontSize: 14,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    sectionTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 24,
        marginBottom: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingBottom: 80,
    },
    emptyIconBg: {
        width: 100,
        height: 100,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 20,
        marginBottom: 8,
    },
    emptyText: {
        fontFamily: FONTS.family.regular,
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    emptyBtn: {
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 16,
    },
    emptyBtnText: {
        color: '#FFFFFF',
        fontFamily: FONTS.family.bold,
        fontSize: 15,
    }
});
