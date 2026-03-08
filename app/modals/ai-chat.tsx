import { GlassCard } from '@/components/ui/GlassCard';
import { ChatMessage, ClaudeFinanceService } from '@/services/ai/claudeService';
import { useFinanceStore } from '@/stores/financeStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, interpolate, Layout, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AIChatScreen() {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useTheme();

    const flow = useSharedValue(0);
    const borderOpacity = useSharedValue(0);

    useEffect(() => {
        flow.value = withRepeat(
            withTiming(1, { duration: 3000 }),
            -1,
            false
        );
        borderOpacity.value = withTiming(loading ? 1 : 0.4, { duration: 500 });
    }, [loading]);

    const animatedFlowStyle = useAnimatedStyle(() => {
        return {
            opacity: borderOpacity.value,
            transform: [
                { translateX: interpolate(flow.value, [0, 1], [-100, 0]) },
                { scale: 1.5 }
            ],
        };
    });

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true));
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false));

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const { transactions, getTotalIncome, getTotalExpense, getTopCategories, getBudgetStatus, selectedCurrency } = useFinanceStore();

    // In a real app, this would come from a secure store or user settings
    const aiService = new ClaudeFinanceService('YOUR_API_KEY_HERE');

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        const context = {
            totalIncome: getTotalIncome(),
            totalExpense: getTotalExpense(),
            netSavings: getTotalIncome() - getTotalExpense(),
            topCategories: getTopCategories(),
            currentBudgets: getBudgetStatus(),
            goals: [],
            currency: selectedCurrency
        };

        try {
            const response = await aiService.chat(input, context, messages);
            const aiMsg: ChatMessage = { role: 'assistant', content: response };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Bir hata oluştu, lütfen tekrar dene.' }]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    return (
        <View style={[styles.container, { backgroundColor: colors.primary.deep }]}>
            <BlurView intensity={isDark ? 40 : 80} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />

            <View style={[styles.header, { paddingTop: insets.top + 10, borderBottomColor: colors.glass.border.subtle }]}>
                <View style={styles.headerLeft}>
                    <Pressable onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: colors.glass.surface.secondary }]}>
                        <Ionicons name="chevron-back" size={24} color={colors.glass.text.primary} />
                    </Pressable>
                </View>

                <View style={styles.headerTitleContainer}>
                    <View style={[styles.aiIcon, { backgroundColor: isDark ? 'rgba(255, 209, 102, 0.1)' : 'rgba(255, 179, 0, 0.1)' }]}>
                        <Ionicons name="sparkles" size={16} color={colors.accent.amber} />
                    </View>
                    <Text style={[styles.headerTitle, { color: colors.glass.text.primary }]}>FinanceAI Asistanı</Text>
                </View>

                <View style={styles.headerRight} />
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.chatList}
                contentContainerStyle={[styles.chatContent, { paddingBottom: 20 }]}
                showsVerticalScrollIndicator={false}
            >
                {messages.length === 0 && (
                    <Animated.View entering={FadeIn.delay(300)} style={styles.emptyState}>
                        <Ionicons name="chatbubbles-outline" size={64} color={colors.glass.text.muted} />
                        <Text style={[styles.emptyText, { color: colors.glass.text.secondary }]}>Merhaba Ömer! Finansal durumunla ilgili her şeyi sorabilirsin.</Text>
                        <View style={styles.suggestions}>
                            {['Bu ay nerede fazla harcadım?', 'Tasarruf önerisi ver', 'Harcama trendimi analiz et'].map((s, i) => (
                                <Pressable key={i} onPress={() => setInput(s)} style={[styles.suggestionChip, { borderColor: colors.glass.border.subtle, backgroundColor: colors.glass.surface.secondary }]}>
                                    <Text style={[styles.suggestionText, { color: colors.accent.teal }]}>{s}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </Animated.View>
                )}

                {messages.map((m, i) => (
                    <Animated.View
                        key={i}
                        entering={FadeInUp.duration(400)}
                        layout={Layout.springify()}
                        style={[
                            styles.messageWrapper,
                            m.role === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper
                        ]}
                    >
                        <View style={styles.messageOuterContainer}>
                            <View style={styles.messageBorderGradient}>
                                <LinearGradient
                                    colors={
                                        m.role === 'assistant'
                                            ? [colors.accent.purple, colors.accent.teal]
                                            : [colors.primary.brand, colors.accent.purple]
                                    }
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={StyleSheet.absoluteFill}
                                />
                            </View>
                            <GlassCard
                                style={styles.messageCard}
                                variant="elevated"
                                animated={false}
                            >
                                <Text style={[styles.messageText, { color: colors.glass.text.primary }]}>{m.content}</Text>
                            </GlassCard>
                        </View>
                    </Animated.View>
                ))}

                {loading && (
                    <View style={styles.aiMessageWrapper}>
                        <View style={styles.messageOuterContainer}>
                            <View style={styles.messageBorderGradient}>
                                <LinearGradient
                                    colors={[colors.accent.purple, colors.accent.teal]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={StyleSheet.absoluteFill}
                                />
                            </View>
                            <GlassCard style={styles.messageCard} variant="elevated" animated={false}>
                                <Text style={[styles.loadingText, { color: colors.glass.text.muted }]}>Düşünüyorum...</Text>
                            </GlassCard>
                        </View>
                    </View>
                )}
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={[styles.inputContainer, { paddingBottom: isKeyboardOpen ? 8 : (insets.bottom > 0 ? insets.bottom : 12) }]}>
                    <View style={styles.inputOuterWrapper}>
                        <Animated.View style={[styles.animatedBorderContainer, animatedFlowStyle]}>
                            <LinearGradient
                                colors={[
                                    colors.primary.brand,
                                    colors.accent.purple,
                                    colors.accent.teal,
                                    colors.primary.brand,
                                    colors.accent.purple,
                                    colors.accent.teal
                                ]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.gradientBorder}
                            />
                        </Animated.View>

                        <View style={[styles.inputInnerContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                            <TextInput
                                style={[styles.input, { color: colors.glass.text.primary }]}
                                placeholder="Mesajını yaz..."
                                placeholderTextColor={colors.glass.text.muted}
                                value={input}
                                onChangeText={setInput}
                                multiline
                            />
                            <Pressable
                                onPress={handleSend}
                                disabled={!input.trim() || loading}
                                style={[
                                    styles.sendButton,
                                    { backgroundColor: colors.accent.purple },
                                    (!input.trim() || loading) && { opacity: 0.5 }
                                ]}
                            >
                                <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 15,
        borderBottomWidth: 1,
    },
    headerLeft: {
        width: 40,
    },
    headerRight: {
        width: 40,
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    headerTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 18,
    },
    chatList: {
        flex: 1,
    },
    chatContent: {
        padding: 20,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        paddingHorizontal: 40,
    },
    emptyText: {
        fontFamily: FONTS.family.medium,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        lineHeight: 24,
    },
    suggestions: {
        marginTop: 30,
        width: '100%',
    },
    suggestionChip: {
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
    },
    suggestionText: {
        fontFamily: FONTS.family.medium,
        fontSize: 14,
        textAlign: 'center',
    },
    messageWrapper: {
        marginBottom: 15,
        maxWidth: '85%',
        position: 'relative',
    },
    messageOuterContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        padding: 1.5, // Border width
        position: 'relative',
    },
    messageBorderGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 20,
        overflow: 'hidden',
    },
    userMessageWrapper: {
        alignSelf: 'flex-end',
    },
    aiMessageWrapper: {
        alignSelf: 'flex-start',
    },
    messageCard: {
        padding: 2,
        paddingHorizontal: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'transparent',
        borderWidth: 0,
    },
    messageText: {
        fontFamily: FONTS.family.regular,
        fontSize: 15,
        lineHeight: 22,
    },
    loadingText: {
        fontFamily: FONTS.family.medium,
        fontSize: 13,
        fontStyle: 'italic',
    },
    inputContainer: {
        paddingHorizontal: 16,
        paddingTop: 0,
    },
    inputOuterWrapper: {
        borderRadius: 30,
        overflow: 'hidden',
        padding: 2, // Border thickness
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatedBorderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '200%',
        height: '100%',
    },
    gradientBorder: {
        width: '100%',
        height: '100%',
    },
    inputInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 28,
        padding: 4,
        paddingLeft: 16,
        width: '100%',
    },
    input: {
        flex: 1,
        fontFamily: FONTS.family.regular,
        fontSize: 16,
        paddingVertical: 10,
        maxHeight: 120,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});
