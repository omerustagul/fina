import { AIInsightCard, BalanceHero, GlassCard, TransactionCard } from '@/components/ui';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { useAuthStore } from '@/stores/authStore';
import { useFinanceStore } from '@/stores/financeStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const router = useRouter();
  const { transactions, getTotalIncome, getTotalExpense, deleteTransaction } = useFinanceStore();
  const { user } = useAuthStore();
  const { colors, isDark } = useTheme();

  const income = getTotalIncome();
  const expense = getTotalExpense();
  const balance = income - expense;

  const quickActions = [
    { id: 'income', title: 'Gelir Ekle', icon: 'add-circle-outline', color: colors.accent.teal, route: '/modals/add-transaction' },
    { id: 'expense', title: 'Gider Ekle', icon: 'remove-circle-outline', color: colors.accent.red, route: '/modals/add-transaction' },
    { id: 'reminders', title: 'Hatırlatmalar', icon: 'notifications-outline', color: colors.accent.amber, route: '/reminders' },
    { id: 'goal', title: 'Hedeflerim', icon: 'flag-outline', color: colors.accent.purple, route: '/goals' },
    { id: 'card', title: 'Findeks Yön.', icon: 'card-outline', color: colors.primary.brand, route: '/cards' },
    { id: 'ai', title: 'AI Analiz', icon: 'sparkles-outline', color: colors.accent.purple, route: '/modals/ai-chat' },
  ];

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
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader userName={user ? user.firstName : "Misafir"} />

        <BalanceHero balance={balance} income={income} expense={expense} />

        <AIInsightCard
          title="Yapay Zeka Önerisi"
          content="Geçen aya göre market harcamalarında %15 tasarruf edebilirsin. Detaylar için sohbeti başlat."
          onPress={() => router.push('/modals/ai-chat')}
        />

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.glass.text.primary }]}>Akıllı Asistan</Text>
        </View>
        <View style={styles.smartAddContainer}>
          <Pressable style={{ flex: 1 }} onPress={() => router.push('/modals/add-voice' as any)}>
            <GlassCard variant="elevated" style={styles.smartAddCard} contentStyle={styles.smartAddContent}>
              <View style={[styles.smartAddIconBadge, { backgroundColor: `${colors.accent.purple}20` }]}>
                <Ionicons name="mic" size={24} color={colors.accent.purple} />
              </View>
              <View style={styles.smartAddTextGroup}>
                <Text style={[styles.smartAddTitle, { color: colors.glass.text.primary }]}>Sesli Ekle</Text>
                <Text style={[styles.smartAddDesc, { color: colors.glass.text.muted }]}>Konuşarak</Text>
              </View>
            </GlassCard>
          </Pressable>

          <Pressable style={{ flex: 1 }} onPress={() => router.push('/modals/add-scan' as any)}>
            <GlassCard variant="elevated" style={styles.smartAddCard} contentStyle={styles.smartAddContent}>
              <View style={[styles.smartAddIconBadge, { backgroundColor: `${colors.accent.amber}20` }]}>
                <Ionicons name="camera" size={24} color={colors.accent.amber} />
              </View>
              <View style={styles.smartAddTextGroup}>
                <Text style={[styles.smartAddTitle, { color: colors.glass.text.primary }]}>Fiş Tara</Text>
                <Text style={[styles.smartAddDesc, { color: colors.glass.text.muted }]}>Fotoğrafla</Text>
              </View>
            </GlassCard>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.glass.text.primary }]}>Hızlı Aksiyonlar</Text>
        </View>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <Pressable
              key={action.id}
              onPress={() => router.push({ pathname: action.route as any, params: { type: action.id } })}
              style={styles.actionItem}
            >
              <GlassCard style={styles.actionCard} contentStyle={styles.actionContent} variant="subtle">
                <View style={[styles.actionIconBg, { backgroundColor: isDark ? `${action.color}15` : `${action.color}10` }]}>
                  <Ionicons name={action.icon as any} size={20} color={action.color} />
                </View>
                <Text style={[styles.actionText, { color: colors.glass.text.primary }]} numberOfLines={1}>{action.title}</Text>
              </GlassCard>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.glass.text.primary }]}>Son İşlemler</Text>
          <Pressable onPress={() => router.push('/(tabs)/transactions')}>
            <Text style={[styles.seeAll, { color: colors.accent.teal }]}>Tümü →</Text>
          </Pressable>
        </View>

        {transactions.slice(0, 5).map((tx) => (
          <TransactionCard
            key={tx.id}
            transaction={tx}
            onPress={() => router.push({ pathname: '/modals/add-transaction', params: { id: tx.id } } as any)}
            onEdit={() => router.push({ pathname: '/modals/add-transaction', params: { id: tx.id } } as any)}
            onDelete={() => handleDelete(tx.id, tx.title)}
          />
        ))}

        {transactions.length === 0 && (
          <View style={[styles.emptyState, { borderColor: colors.glass.border.subtle }]}>
            <Ionicons name="receipt-outline" size={48} color={colors.glass.text.muted} />
            <Text style={[styles.emptyText, { color: colors.glass.text.muted }]}>Henüz bir işleminiz bulunmuyor.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 140,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.family.bold,
    fontSize: 20,
    letterSpacing: -0.5,
  },
  seeAll: {
    fontFamily: FONTS.family.medium,
    fontSize: 14,
  },
  smartAddContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  smartAddCard: {
    flex: 1,
  },
  smartAddContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  smartAddIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smartAddTextGroup: {
    flex: 1,
  },
  smartAddTitle: {
    fontFamily: FONTS.family.bold,
    fontSize: 14,
  },
  smartAddDesc: {
    fontFamily: FONTS.family.medium,
    fontSize: 11,
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  actionItem: {
    width: '48.5%', // Slightly less than 50% for gap
  },
  actionCard: {
    height: 56,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: '100%',
    gap: 10,
  },
  actionIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontFamily: FONTS.family.bold,
    fontSize: 13,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  emptyText: {
    fontFamily: FONTS.family.regular,
    fontSize: 14,
    marginTop: 12,
  },
});
