import { GlassCard } from '@/components/ui';
import { useTheme } from '@/stores/themeStore';
import { FONTS } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpCenterScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();

    const faqs = [
        {
            title: "Nasıl Hedef Ekleyebilirim?",
            desc: "Uygulamanın alt menüsünden 'Hedef' sekmesine tıklayın. Ardından sağ üstteki '+' butonuna basarak yeni hedefinizi isimlendirebilir ve tutar belirtebilirsiniz."
        },
        {
            title: "Yapay Zeka (AI) Asistanı Nasıl Çalışır?",
            desc: "Fina, harcamalarınızı analiz ederek size kişiselleştirilmiş finansal ipuçları sunar. Pano (Dashboard) ekranındaki 'Sesli Ekle' veya 'Fiş Tara' modüllerinden de verilerinizi AI'a hızlıca öğretebilirsiniz."
        },
        {
            title: "Bakiyem Eksiye Düşebilir Mi?",
            desc: "Evet. Gelirinizden fazla gider eklediğiniz durumlarda net bakiyeniz grafikte kırmızı ve eksi değerde gösterilecektir."
        },
        {
            title: "Bilgilerim Güvende Mi?",
            desc: "Tüm finansal verileriniz ve hedefleriniz, cihazınızın yerel depolama alanında şifreli olarak tutulmaktadır. Üçüncü şahıslarla paylaşılmaz."
        }
    ];

    const contactSupport = () => {
        Linking.openURL('mailto:support@fina.app?subject=Fina%20Yard%C4%B1m%20Talebi');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.primary.deep }]} edges={['top']}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.closeBtn}>
                    <Ionicons name="chevron-back" size={24} color={colors.glass.text.primary} />
                </Pressable>
                <Text style={[styles.title, { color: colors.glass.text.primary }]}>Yardım Merkezi</Text>
                <View style={styles.closeBtn} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.heroSection}>
                    <Ionicons name="help-buoy" size={64} color={colors.primary.brand} style={{ marginBottom: 16 }} />
                    <Text style={[styles.heroTitle, { color: colors.glass.text.primary }]}>Size Nasıl Yardımcı Olabiliriz?</Text>
                    <Text style={[styles.heroSub, { color: colors.glass.text.secondary }]}>Sıkça sorulan sorulara göz atın veya bizimle anında iletişime geçin.</Text>
                </View>

                {faqs.map((faq, index) => (
                    <GlassCard key={index} variant="subtle" style={styles.faqCard} contentStyle={{ gap: 8 }}>
                        <Text style={[styles.faqTitle, { color: colors.glass.text.primary }]}>{faq.title}</Text>
                        <Text style={[styles.faqDesc, { color: colors.glass.text.muted }]}>{faq.desc}</Text>
                    </GlassCard>
                ))}

                <View style={styles.contactDivider} />

                <Text style={[styles.notResolvedText, { color: colors.glass.text.primary }]}>
                    Aradığınızı bulamadınız mı?
                </Text>

                <Pressable onPress={contactSupport} style={styles.contactCard}>
                    <View style={[styles.contactIconBg, { backgroundColor: `${colors.accent.teal}20` }]}>
                        <Ionicons name="chatbubbles" size={24} color={colors.accent.teal} />
                    </View>
                    <View style={styles.contactTexts}>
                        <Text style={[styles.contactTitle, { color: colors.glass.text.primary }]}>Destek Ekibine Ulaş</Text>
                        <Text style={[styles.contactDesc, { color: colors.glass.text.muted }]}>Bizimle e-posta üzerinden iletişime geçin, 24 saat içinde yanıtlayalım.</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.glass.text.muted} />
                </Pressable>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    closeBtn: {
        width: 44,
    },
    title: {
        fontFamily: FONTS.family.bold,
        fontSize: 18,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 60,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 32,
        paddingHorizontal: 12,
        marginTop: 10,
    },
    heroTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 8,
    },
    heroSub: {
        fontFamily: FONTS.family.regular,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
    },
    faqCard: {
        marginBottom: 12,
        padding: 16,
    },
    faqTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 15,
    },
    faqDesc: {
        fontFamily: FONTS.family.regular,
        fontSize: 13,
        lineHeight: 20,
    },
    contactDivider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 32,
    },
    notResolvedText: {
        fontFamily: FONTS.family.bold,
        fontSize: 18,
        marginBottom: 16,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    contactIconBg: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contactTexts: {
        flex: 1,
        paddingRight: 16,
    },
    contactTitle: {
        fontFamily: FONTS.family.bold,
        fontSize: 15,
        marginBottom: 4,
    },
    contactDesc: {
        fontFamily: FONTS.family.regular,
        fontSize: 12,
        lineHeight: 18,
    }
});
