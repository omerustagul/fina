import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { formatCurrency } from '@/utils/currency';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BalanceDonut } from '../charts/BalanceDonut';
import { GlassCard } from './GlassCard';

interface BalanceHeroProps {
    balance: number;
    income: number;
    expense: number;
}

export const BalanceHero: React.FC<BalanceHeroProps> = ({
    balance,
    income,
    expense,
}) => {
    const { colors, isDark } = useTheme();

    return (
        <Animated.View entering={FadeInDown.duration(600).springify()}>
            <GlassCard variant="elevated" style={styles.card}>
                <View style={[styles.content, { backgroundColor: 'transparent' }]}>
                    <View style={styles.mainInfo}>
                        <Text style={[styles.label, { color: colors.glass.text.secondary }]}>Toplam Bakiye</Text>
                        <View style={styles.balanceContainer}>
                            <Text style={[styles.currencySymbol, { color: balance < 0 ? colors.accent.red : colors.glass.text.muted }]}>
                                {balance < 0 ? '-' : ''}₺
                            </Text>
                            <Text style={[styles.balanceText, { color: balance < 0 ? colors.accent.red : colors.glass.text.primary }]}>
                                {new Intl.NumberFormat('tr-TR').format(Math.trunc(Math.abs(balance)))}
                            </Text>
                            <Text style={[styles.balanceDecimal, { color: balance < 0 ? colors.accent.red : colors.glass.text.muted }]}>
                                ,{(Math.abs(balance) % 1).toFixed(2).split('.')[1]}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.chartContainer}>
                        <BalanceDonut income={income} expense={expense} size={100}>
                            <Text style={{
                                color: balance < 0 ? colors.accent.red : colors.accent.teal,
                                fontFamily: FONTS.family.bold,
                                fontSize: 13
                            }}>
                                {balance < 0 ? 'Ekside' : 'Artıda'}
                            </Text>
                        </BalanceDonut>
                    </View>
                </View>

                <View style={[styles.statsContainer, { borderTopColor: colors.glass.border.subtle }]}>
                    <View style={styles.statBox}>
                        <View style={[styles.statIcon, { backgroundColor: isDark ? `${colors.accent.teal}20` : `${colors.accent.teal}15` }]}>
                            <Text style={{ color: colors.accent.teal, fontSize: 16 }}>↑</Text>
                        </View>
                        <View>
                            <Text style={[styles.statLabel, { color: colors.glass.text.muted }]}>Gelir</Text>
                            <Text style={[styles.statValue, { color: colors.accent.teal }]}>
                                +{formatCurrency(income)}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.statDivider, { backgroundColor: colors.glass.border.subtle }]} />

                    <View style={styles.statBox}>
                        <View style={[styles.statIcon, { backgroundColor: isDark ? `${colors.accent.red}20` : `${colors.accent.red}15` }]}>
                            <Text style={{ color: colors.accent.red, fontSize: 16 }}>↓</Text>
                        </View>
                        <View>
                            <Text style={[styles.statLabel, { color: colors.glass.text.muted }]}>Gider</Text>
                            <Text style={[styles.statValue, { color: colors.accent.red }]}>
                                -{formatCurrency(expense)}
                            </Text>
                        </View>
                    </View>
                </View>
            </GlassCard>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 20,
        padding: 0,
    },
    content: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    mainInfo: {
        flex: 1,
    },
    label: {
        fontFamily: FONTS.family.medium,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 8,
    },
    currencySymbol: {
        fontFamily: FONTS.family.bold,
        fontSize: 24,
        marginRight: 4,
    },
    balanceText: {
        fontFamily: FONTS.family.extraBold,
        fontSize: 44,
        letterSpacing: -1,
    },
    balanceDecimal: {
        fontFamily: FONTS.family.bold,
        fontSize: 24,
    },
    chartContainer: {
        marginLeft: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        paddingVertical: 18,
    },
    statBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    statIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statLabel: {
        fontFamily: FONTS.family.medium,
        fontSize: 11,
        textTransform: 'uppercase',
    },
    statValue: {
        fontFamily: FONTS.family.bold,
        fontSize: 15,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: '60%',
        alignSelf: 'center',
    },
});
