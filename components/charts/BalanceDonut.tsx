import { COLORS } from '@/theme';
import React from 'react';
import { Text, View } from 'react-native';

interface BalanceDonutProps {
    income: number;
    expense: number;
    size?: number;
}

export const BalanceDonut: React.FC<BalanceDonutProps> = ({
    income,
    expense,
    size = 100,
}) => {
    // TEMPORARY: Disabled Skia to fix React 19 crash
    const balance = income - expense;
    const isNegative = balance < 0;

    return (
        <View style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 8,
            borderColor: isNegative ? COLORS.accent.red : COLORS.accent.teal,
            borderLeftColor: isNegative ? `${COLORS.accent.red}40` : `${COLORS.accent.teal}40`,
            borderTopColor: isNegative ? `${COLORS.accent.red}40` : `${COLORS.accent.teal}40`,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text style={{ color: isNegative ? COLORS.accent.red : COLORS.accent.teal, fontSize: 13, fontWeight: 'bold' }}>
                {isNegative ? 'Ekside' : 'Artıda'}
            </Text>
        </View>
    );
};
