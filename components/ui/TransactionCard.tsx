import { useFinanceStore } from '@/stores/financeStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Transaction } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity as GHTouchableOpacity, Swipeable } from 'react-native-gesture-handler';
import { GlassCard } from './GlassCard';

let openedSwipeable: Swipeable | null = null;

interface TransactionCardProps {
    transaction: Transaction;
    onPress?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const TX_CARD_HEIGHT = 54;

export const TransactionCard: React.FC<TransactionCardProps> = ({
    transaction,
    onPress,
    onEdit,
    onDelete
}) => {
    const { colors } = useTheme();
    const categories = useFinanceStore((state) => state.categories);
    const category = (categories || []).find(c => c.id === transaction.categoryId) || {
        name: 'Diğer',
        icon: '📦',
        color: '#B8B8B8'
    };

    const isIncome = transaction.type === 'income';

    const swipeableRef = useRef<Swipeable>(null);

    const handlePress = () => {
        if (openedSwipeable && openedSwipeable !== swipeableRef.current) {
            openedSwipeable.close();
        }
        if (swipeableRef.current) swipeableRef.current.close();
        if (onPress) onPress();
    };

    const renderRightActions = (progress: any, dragX: any) => {
        if (!onEdit && !onDelete) return null;

        return (
            <View style={{ flexDirection: 'row', marginLeft: 10, height: TX_CARD_HEIGHT }}>
                {onEdit && (
                    <GHTouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            swipeableRef.current?.close();
                            if (onEdit) onEdit();
                        }}
                        style={{ width: TX_CARD_HEIGHT, height: '100%', backgroundColor: colors.accent.teal, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginRight: 8 }}
                    >
                        <Ionicons name="create-outline" size={20} color="#FFF" />
                    </GHTouchableOpacity>
                )}
                {onDelete && (
                    <GHTouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            swipeableRef.current?.close();
                            if (onDelete) onDelete();
                        }}
                        style={{ width: TX_CARD_HEIGHT, height: '100%', backgroundColor: colors.accent.red, justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}
                    >
                        <Ionicons name="trash-outline" size={20} color="#FFF" />
                    </GHTouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={{ marginBottom: 10 }}>
            <Swipeable
                ref={swipeableRef}
                friction={2}
                rightThreshold={40}
                overshootRight={false}
                onSwipeableWillOpen={() => {
                    if (openedSwipeable && openedSwipeable !== swipeableRef.current) {
                        openedSwipeable.close();
                    }
                    openedSwipeable = swipeableRef.current;
                }}
                renderRightActions={renderRightActions}
                containerStyle={{ overflow: 'visible' }}
            >
                <GlassCard style={styles.card} variant="subtle">
                    <GHTouchableOpacity onPress={handlePress} activeOpacity={0.8}>
                        <View style={[styles.container, { backgroundColor: 'transparent' }]}>
                            <View style={[styles.iconContainer, { backgroundColor: `${category.color}15` }]}>
                                {category.icon.length <= 2 ? (
                                    <Text style={styles.icon}>{category.icon}</Text>
                                ) : (
                                    <Ionicons name={category.icon as any} size={18} color={category.color} />
                                )}
                            </View>

                            <View style={styles.infoContainer}>
                                <Text style={[styles.title, { color: colors.glass.text.primary }]} numberOfLines={1}>{transaction.title}</Text>
                                <Text style={[styles.subtext, { color: colors.glass.text.secondary }]}>
                                    {category.name} • {format(new Date(transaction.date), 'd MMMM', { locale: tr })}
                                </Text>
                            </View>

                            <View style={styles.amountContainer}>
                                <Text style={[
                                    styles.amount,
                                    { color: isIncome ? colors.accent.teal : colors.accent.red }
                                ]}>
                                    {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                                </Text>
                            </View>
                        </View>
                    </GHTouchableOpacity>
                </GlassCard>
            </Swipeable>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 0,
        height: TX_CARD_HEIGHT,
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 2,
        height: '100%',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    icon: {
        fontSize: 16,
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontFamily: FONTS.family.semiBold,
        fontSize: 15,
    },
    subtext: {
        fontFamily: FONTS.family.regular,
        fontSize: 12,
        marginTop: 2,
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontFamily: FONTS.family.bold,
        fontSize: 16,
    },
});
