import { GlassButton } from '@/components/ui';
import { useFinanceStore } from '@/stores/financeStore';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddScanScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { addTransaction } = useFinanceStore();

    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<'back' | 'front'>('back');
    const [isProcessing, setIsProcessing] = useState(false);

    // Simulate photo analysis
    const takePicture = () => {
        setIsProcessing(true);
        // Fake AI OCR & Extraction Delay
        setTimeout(() => {
            const isIncome = Math.random() > 0.8;
            addTransaction({
                title: isIncome ? 'Fatura İadesi' : 'Fiş: Kahve Dünyası',
                amount: Math.floor(Math.random() * 500) + 50,
                type: isIncome ? 'income' : 'expense',
                categoryId: isIncome ? '3' : '1', // Mock categories
                date: Date.now(),
                recurrence: 'none'
            });
            setIsProcessing(false);
            router.back();
        }, 2500);
    };

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.primary.deep }]}>
                <View style={styles.permissionBox}>
                    <Text style={[styles.title, { color: colors.glass.text.primary }]}>Kamera İzni Gerekli</Text>
                    <Text style={[styles.subtitle, { color: colors.glass.text.secondary }]}>
                        Fişleri tarayabilmek için kamera erişimine izin vermeniz gerekiyor.
                    </Text>
                    <GlassButton title="İzin Ver" variant="primary" onPress={requestPermission} />
                    <GlassButton title="Geri Dön" variant="secondary" onPress={() => router.back()} style={{ marginTop: 12 }} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#000' }]} edges={['top']}>
            {isProcessing ? (
                <View style={[styles.processingContainer, { backgroundColor: colors.primary.deep }]}>
                    <Ionicons name="scan-circle" size={80} color={colors.accent.amber} style={styles.pulseIcon} />
                    <Text style={[styles.procTitle, { color: colors.glass.text.primary }]}>Yapay Zeka Fişi Tarıyor</Text>
                    <Text style={[styles.procSub, { color: colors.glass.text.secondary }]}>
                        Satırlar, tarihler ve toplam tutar saptanıyor...
                    </Text>
                </View>
            ) : (
                <View style={styles.cameraBox}>
                    <CameraView style={styles.camera} facing={facing}>
                        <View style={styles.topControls}>
                            <Pressable style={styles.closeBtn} onPress={() => router.back()}>
                                <Ionicons name="close" size={28} color="#FFF" />
                            </Pressable>
                            <Pressable style={styles.flipBtn} onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}>
                                <Ionicons name="camera-reverse" size={28} color="#FFF" />
                            </Pressable>
                        </View>

                        <View style={styles.guideBox}>
                            <View style={styles.cornerTL} />
                            <View style={styles.cornerTR} />
                            <View style={styles.cornerBL} />
                            <View style={styles.cornerBR} />
                            <Text style={styles.guideText}>Fişi bu alana ortalayın</Text>
                        </View>

                        <View style={styles.bottomControls}>
                            <Pressable style={styles.captureBtn} onPress={takePicture}>
                                <View style={styles.captureInner} />
                            </Pressable>
                        </View>
                    </CameraView>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    permissionBox: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontFamily: FONTS.family.bold,
        fontSize: 24,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: FONTS.family.regular,
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 32,
    },
    cameraBox: {
        flex: 1,
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        overflow: 'hidden',
    },
    camera: {
        flex: 1,
    },
    topControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    closeBtn: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flipBtn: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    guideBox: {
        flex: 1,
        margin: 40,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cornerTL: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#FFF' },
    cornerTR: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#FFF' },
    cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#FFF' },
    cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#FFF' },
    guideText: {
        color: '#FFF',
        fontFamily: FONTS.family.medium,
        fontSize: 14,
        opacity: 0.8,
        marginTop: 100,
    },
    bottomControls: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    captureBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFF',
    },
    processingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    pulseIcon: {
        marginBottom: 24,
    },
    procTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 24,
        marginBottom: 8,
    },
    procSub: {
        fontFamily: FONTS.family.regular,
        fontSize: 15,
    }
});
