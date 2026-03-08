import { useFinanceStore } from '@/stores/financeStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export default function AddVoiceScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const { addTransaction } = useFinanceStore();

    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    const pulse = useSharedValue(1);

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
        opacity: 2 - pulse.value,
    }));

    useEffect(() => {
        if (isRecording) {
            pulse.value = withRepeat(withTiming(1.3, { duration: 800 }), -1, true);
        } else {
            pulse.value = withTiming(1);
        }
    }, [isRecording]);

    const startRecording = async () => {
        try {
            if (permissionResponse?.status !== 'granted') {
                await requestPermission();
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            setRecording(recording);
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        setRecording(null);
        setIsRecording(false);
        setIsProcessing(true);

        try {
            await recording?.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });

            // Simulate AI Processing
            setTimeout(() => {
                const isIncome = Math.random() > 0.5;
                addTransaction({
                    title: isIncome ? 'Freelance Ödemesi' : 'Sesli Market Harcaması',
                    amount: Math.floor(Math.random() * 2000) + 150,
                    type: isIncome ? 'income' : 'expense',
                    categoryId: isIncome ? '3' : '1', // Mock categories
                    date: Date.now(),
                    recurrence: 'none'
                });
                setIsProcessing(false);
                router.back();
            }, 2500);

        } catch (error) {
            console.error(error);
            setIsProcessing(false);
        }
    };

    const handleMicPress = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <View style={styles.container}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => !isRecording && !isProcessing && router.back()}>
                <View style={styles.backdrop} />
            </Pressable>

            <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} style={[styles.modalContent, { backgroundColor: colors.glass.surface.elevated, borderColor: colors.glass.border.strong }]}>
                <Pressable onPress={() => router.back()} style={styles.closeBtn}>
                    <Ionicons name="close" size={28} color={colors.glass.text.primary} />
                </Pressable>

                {isProcessing ? (
                    <View style={styles.centerBox}>
                        <Ionicons name="sparkles" size={40} color={colors.accent.amber} style={styles.iconMargin} />
                        <Text style={[styles.title, { color: colors.glass.text.primary }]}>Ses Analiz Ediliyor...</Text>
                        <Text style={[styles.subtitle, { color: colors.glass.text.secondary }]}>
                            Fina verilerinizi işliyor. İşlem birazdan eklenecek.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.centerBox}>
                        <Text style={[styles.title, { color: colors.glass.text.primary }]}>
                            {isRecording ? "Sizi Dinliyorum..." : "Sesli Komut Verin"}
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.glass.text.secondary }]}>
                            {isRecording ? "Detayları anlattıktan sonra tekrar dokunun." : "'Dün market alışverişine 350 lira verdim' gibi."}
                        </Text>

                        <View style={styles.micStage}>
                            <Animated.View style={[styles.pulseRing, pulseStyle, { backgroundColor: isRecording ? `${colors.accent.red}40` : 'transparent' }]} />

                            <Pressable
                                onPress={handleMicPress}
                                style={[styles.micBtn, { backgroundColor: isRecording ? colors.accent.red : colors.accent.purple }]}
                            >
                                <Ionicons name={isRecording ? "stop" : "mic"} size={40} color="#FFF" />
                            </Pressable>
                        </View>
                    </View>
                )}

            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        borderWidth: 1,
        borderBottomWidth: 0,
        paddingTop: 32,
        paddingBottom: 60,
        paddingHorizontal: 24,
    },
    closeBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 44,
        zIndex: 10,
    },
    centerBox: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    iconMargin: {
        marginBottom: 16,
    },
    title: {
        fontFamily: FONTS.family.bold,
        fontSize: 24,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: FONTS.family.medium,
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 40,
    },
    micStage: {
        width: 140,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    pulseRing: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    micBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    }
});
