import { GlassButton, GlassCard, GlassInput, GlassModal } from '@/components/ui';
import { useFinanceStore } from '@/stores/financeStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { formatCurrency } from '@/utils/currency';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GoalsScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { goals, addGoal, updateGoal, deleteGoal, addMoneyToGoal } = useFinanceStore();

    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isActionModalVisible, setActionModalVisible] = useState(false);

    const [selectedGoal, setSelectedGoal] = useState<any>(null);
    const [actionType, setActionType] = useState<'add' | 'remove'>('add');

    // Form states
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');

    const handleAddGoal = () => {
        if (!name || !target) return;
        addGoal({
            name,
            targetAmount: parseFloat(target),
            currentAmount: 0,
            icon: 'star-outline',
            color: colors.primary.brand,
            deadline: Date.now() + 1000 * 60 * 60 * 24 * 365,
        });
        setAddModalVisible(false);
        resetForm();
    };

    const handleEditGoal = () => {
        if (!selectedGoal || !name || !target) return;
        updateGoal(selectedGoal.id, {
            name,
            targetAmount: parseFloat(target),
        });
        setEditModalVisible(false);
        resetForm();
    };

    const handleActionAmount = () => {
        if (!selectedGoal || !amount) return;
        const val = parseFloat(amount);
        const finalAmount = actionType === 'add' ? val : -val;

        if (actionType === 'remove') {
            if (!reason) {
                Alert.alert('Dikkat', 'Harcama nedenini belirtmelisiniz.');
                return;
            }

            // Double Confirmation for removal
            Alert.alert(
                'Emin misiniz?',
                `Birikimden ${formatCurrency(val)} çıkarılacak. Bu işlem geri alınamaz.`,
                [
                    { text: 'Vazgeç', style: 'cancel' },
                    {
                        text: 'Devam Et',
                        onPress: () => {
                            Alert.alert(
                                'Son Onay',
                                'Gerçekten bu tutarı hedeften çıkarmak istiyor musunuz?',
                                [
                                    { text: 'Hayır', style: 'cancel' },
                                    {
                                        text: 'Evet, Çıkar',
                                        onPress: () => {
                                            addMoneyToGoal(selectedGoal.id, finalAmount, reason);
                                            setActionModalVisible(false);
                                            resetForm();
                                        }
                                    }
                                ]
                            );
                        }
                    }
                ]
            );
        } else {
            addMoneyToGoal(selectedGoal.id, finalAmount, reason || 'Birikim eklendi');
            setActionModalVisible(false);
            resetForm();
        }
    };

    const handleDeleteGoalRequest = (goalId: string) => {
        Alert.alert(
            'Hedefi Sil',
            'Bu hedefi silmek istediğinize emin misiniz?',
            [
                { text: 'Vazgeç', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert(
                            'Son Kararınız mı?',
                            'Hedef kalıcı olarak silinecek.',
                            [
                                { text: 'Hayır', style: 'cancel' },
                                { text: 'Evet, Sil', style: 'destructive', onPress: () => deleteGoal(goalId) }
                            ]
                        );
                    }
                }
            ]
        );
    };

    const resetForm = () => {
        setName('');
        setTarget('');
        setAmount('');
        setReason('');
        setSelectedGoal(null);
    };

    const openEdit = (goal: any) => {
        setSelectedGoal(goal);
        setName(goal.name);
        setTarget(goal.targetAmount.toString());
        setEditModalVisible(true);
    };

    const openAction = (goal: any, type: 'add' | 'remove') => {
        setSelectedGoal(goal);
        setActionType(type);
        setActionModalVisible(true);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.primary.deep }]} edges={['top']}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Pressable onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
                        <Ionicons name="arrow-back" size={28} color={colors.glass.text.primary} />
                    </Pressable>
                    <Text style={[styles.title, { color: colors.glass.text.primary }]}>Hedefler</Text>
                </View>
                <Pressable
                    onPress={() => setAddModalVisible(true)}
                    style={[styles.addBtn, { backgroundColor: colors.primary.brand }]}
                >
                    <Ionicons name="add" size={24} color="#FFFFFF" />
                </Pressable>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Modals are kept at the top for accessibility although they render overlay */}
                <GlassModal visible={isAddModalVisible} onClose={() => setAddModalVisible(false)} title="Yeni Hedef">
                    <View style={{ gap: 16 }}>
                        <GlassInput label="Hedef Adı" value={name} onChangeText={setName} placeholder="Örn: Ev Peşinatı" />
                        <GlassInput label="Hedef Tutar" value={target} onChangeText={setTarget} placeholder="0.00" keyboardType="numeric" />
                        <GlassButton title="Kaydet" onPress={handleAddGoal} variant="primary" />
                    </View>
                </GlassModal>

                <GlassModal visible={isEditModalVisible} onClose={() => setEditModalVisible(false)} title="Hedefi Düzenle">
                    <View style={{ gap: 16 }}>
                        <GlassInput label="Hedef Adı" value={name} onChangeText={setName} />
                        <GlassInput label="Hedef Tutar" value={target} onChangeText={setTarget} keyboardType="numeric" />
                        <GlassButton title="Güncelle" onPress={handleEditGoal} variant="primary" />
                        <GlassButton title="Hedefi Sil" onPress={() => { setEditModalVisible(false); handleDeleteGoalRequest(selectedGoal.id); }} variant="secondary" />
                    </View>
                </GlassModal>

                <GlassModal
                    visible={isActionModalVisible}
                    onClose={() => setActionModalVisible(false)}
                    title={actionType === 'add' ? 'Para Ekle' : 'Para Çıkar'}
                >
                    <View style={{ gap: 16 }}>
                        <GlassInput label="Tutar" value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="0.00" />
                        <GlassInput label="Açıklama / Neden" value={reason} onChangeText={setReason} placeholder={actionType === 'add' ? 'İsteğe bağlı' : 'Neden çıkarıyorsunuz?'} />
                        <GlassButton
                            title={actionType === 'add' ? 'Ekle' : 'Çıkar'}
                            onPress={handleActionAmount}
                            variant={actionType === 'add' ? 'primary' : 'secondary'}
                        />
                    </View>
                </GlassModal>

                {(goals || []).map((goal) => {
                    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                    return (
                        <GlassCard key={goal.id} style={styles.goalCard} contentStyle={{ padding: 14 }}>
                            <View style={styles.goalHeader}>
                                <View style={[styles.iconContainer, { backgroundColor: `${goal.color}15` }]}>
                                    <Ionicons name={goal.icon as any} size={24} color={goal.color} />
                                </View>
                                <View style={styles.goalInfo}>
                                    <View style={styles.titleRow}>
                                        <Text style={[styles.goalTitle, { color: colors.glass.text.primary }]}>{goal.name}</Text>
                                        <Pressable onPress={() => openEdit(goal)}>
                                            <Ionicons name="ellipsis-horizontal" size={20} color={colors.glass.text.muted} />
                                        </Pressable>
                                    </View>
                                    <Text style={[styles.goalTarget, { color: colors.glass.text.secondary }]}>
                                        {formatCurrency(goal.targetAmount)} hedef
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.progressBarBack, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                                <LinearGradient
                                    colors={[goal.color, `${goal.color}88`]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.progressBarFill, { width: `${progress}%` }]}
                                />
                            </View>

                            <View style={styles.goalFooter}>
                                <View style={styles.amountInfo}>
                                    <Text style={[styles.currentLabel, { color: colors.glass.text.muted }]}>BİRİKİM</Text>
                                    <Text style={[styles.currentValue, { color: goal.color }]}>{formatCurrency(goal.currentAmount)}</Text>
                                </View>
                                <View style={styles.actionButtons}>
                                    <Pressable onPress={() => openAction(goal, 'remove')} style={[styles.miniBtn, { backgroundColor: `${colors.accent.red}15` }]}>
                                        <Ionicons name="remove" size={18} color={colors.accent.red} />
                                    </Pressable>
                                    <Pressable onPress={() => openAction(goal, 'add')} style={[styles.miniBtn, { backgroundColor: `${colors.accent.teal}15` }]}>
                                        <Ionicons name="add" size={18} color={colors.accent.teal} />
                                    </Pressable>
                                </View>
                            </View>
                        </GlassCard>
                    );
                })}

                <GlassCard style={styles.recommendationCard} variant="elevated" contentStyle={{ padding: 16 }}>
                    <View style={styles.recommendationHeader}>
                        <Ionicons name="sparkles" size={20} color={colors.accent.amber} />
                        <Text style={[styles.recommendationTitle, { color: colors.accent.amber }]}>AI Stratejisi</Text>
                    </View>
                    <Text style={[styles.recommendationText, { color: colors.glass.text.secondary }]}>
                        Aylık tasarrufunu ₺1.200 artırırsan "Avrupa Turu" hedefine 2 ay daha erken ulaşabilirsin.
                    </Text>
                </GlassCard>
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
        paddingBottom: 120,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 14,
    },
    title: {
        fontFamily: FONTS.family.bold,
        fontSize: 28,
        letterSpacing: -0.5,
    },
    addBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    goalCard: {
        marginBottom: 16,
    },
    goalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    goalInfo: {
        flex: 1,
    },
    goalTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 16,
    },
    goalTarget: {
        fontFamily: FONTS.family.medium,
        fontSize: 12,
        marginTop: 2,
    },
    progressBarBack: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 12,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    goalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    amountInfo: {
        gap: 2,
    },
    currentLabel: {
        fontFamily: FONTS.family.medium,
        fontSize: 10,
        letterSpacing: 0.5,
    },
    currentValue: {
        fontFamily: FONTS.family.bold,
        fontSize: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    miniBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recommendationCard: {
        marginTop: 8,
    },
    recommendationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    recommendationTitle: {
        fontFamily: FONTS.family.extraBold,
        fontSize: 15,
    },
    recommendationText: {
        fontFamily: FONTS.family.regular,
        fontSize: 14,
        lineHeight: 22,
    }
});
