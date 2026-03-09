import { useTheme } from '@/stores/themeStore';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';

interface BalanceDonutProps {
    income: number;
    expense: number;
    size?: number;
    children?: React.ReactNode;
}

export const BalanceDonut: React.FC<BalanceDonutProps> = ({
    income = 0,
    expense = 0,
    size = 140,
    children,
}) => {
    const { colors } = useTheme();
    const rotation = useSharedValue(0);
    const strokeWidth = 8; // Incelterek daha zarif hale getirdim
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    // Proportional calculation
    const total = (income || 0) + (expense || 0);
    const incomeRatio = total === 0 ? 1 : (income || 0) / total;
    const expenseRatio = total === 0 ? 0 : (expense || 0) / total;

    const incomeDash = circumference * incomeRatio;
    const expenseDash = circumference * expenseRatio;

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 4000, // Daha hızlı ve efektif animasyon
                easing: Easing.bezier(0.4, 0, 0.2, 1),
            }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Animated.View style={[StyleSheet.absoluteFill, styles.center, animatedStyle]}>
                <Svg width={size} height={size}>
                    <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                        {/* Base track */}
                        <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke={colors.glass.border.subtle}
                            strokeWidth={strokeWidth}
                            fill="none"
                            opacity={0.3}
                        />

                        {/* Income Segment */}
                        <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke={colors.accent.teal}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={`${incomeDash} ${circumference}`}
                            strokeLinecap="round"
                        />

                        {/* Expense Segment */}
                        {expenseRatio > 0 && (
                            <Circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke={colors.accent.red}
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeDasharray={`${expenseDash} ${circumference}`}
                                strokeDashoffset={-incomeDash}
                                strokeLinecap="round"
                            />
                        )}
                    </G>
                </Svg>
            </Animated.View>

            {/* Content Container */}
            <View style={[StyleSheet.absoluteFill, styles.center, { zIndex: 10 }]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});
