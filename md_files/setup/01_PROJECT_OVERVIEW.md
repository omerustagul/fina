# 💰 FinanceAI — Yapay Zeka Destekli Kişisel Finans Uygulaması
## Proje Genel Bakış & Mimari Prompt

---

## 🎯 Proje Tanımı

**FinanceAI**, React Native (Expo) altyapısı üzerine inşa edilmiş, yapay zeka destekli, Glassmorphism tasarım diline sahip bir kişisel finans yönetim uygulamasıdır. Kullanıcıların gelir ve giderlerini kolayca takip edebilmelerini, finansal hedefler belirleyebilmelerini ve yapay zeka destekli içgörülerle daha bilinçli finansal kararlar alabilmelerini sağlar.

Uygulama hem **Android** hem de **iOS** platformlarında sorunsuz çalışacak şekilde geliştirilecektir.

---

## 🏗️ Teknik Mimari

### Framework & Temel Teknolojiler

```
React Native (Expo SDK 51+)
├── TypeScript (strict mode)
├── Expo Router v3 (file-based navigation)
├── React Native Reanimated 3 (animasyonlar)
├── React Native Gesture Handler (swipe/gesture)
└── Expo Modules (kamera, bildirimler, güvenli depolama)
```

### State Management

```
Zustand (global state)
├── useFinanceStore     → işlemler, bakiye, kategoriler
├── useAIStore          → AI analiz sonuçları, öneriler
├── useSettingsStore    → tema, dil, para birimi
└── useGoalStore        → finansal hedefler
```

### Veritabanı & Depolama

```
WatermelonDB (local SQLite - offline-first)
├── transactions        → gelir/gider kayıtları
├── categories          → özel kategoriler
├── budgets             → bütçe planları
├── goals               → finansal hedefler
└── ai_insights         → AI analiz geçmişi

Expo SecureStore        → API anahtarları, hassas veriler
AsyncStorage            → kullanıcı tercihleri
```

### Yapay Zeka Entegrasyonu

```
Anthropic Claude API (claude-sonnet-4-5)
├── Harcama analizi ve pattern tespiti
├── Bütçe optimizasyon önerileri
├── Finansal hedef yol haritası
├── Anormal harcama uyarıları
└── Aylık finansal rapor özeti
```

### Grafik & Görselleştirme

```
Victory Native XL (charts - Skia tabanlı)
├── LineChart           → gelir/gider trendi
├── BarChart            → kategori karşılaştırması
├── PieChart / DonutChart → harcama dağılımı
└── AreaChart           → birikim trendi
```

---

## 📁 Proje Klasör Yapısı

```
financeai/
├── app/                          # Expo Router sayfaları
│   ├── (tabs)/
│   │   ├── index.tsx             # Dashboard
│   │   ├── transactions.tsx      # İşlemler
│   │   ├── analytics.tsx         # Analitik & Grafikler
│   │   ├── goals.tsx             # Finansal Hedefler
│   │   └── profile.tsx           # Profil & Ayarlar
│   ├── modals/
│   │   ├── add-transaction.tsx   # İşlem ekleme modal
│   │   ├── transaction-detail.tsx
│   │   └── ai-chat.tsx           # AI Asistan modal
│   ├── onboarding/
│   │   ├── welcome.tsx
│   │   ├── setup-currency.tsx
│   │   └── setup-budget.tsx
│   └── _layout.tsx
│
├── components/
│   ├── ui/                       # Temel UI bileşenleri
│   │   ├── GlassCard.tsx
│   │   ├── GlassButton.tsx
│   │   ├── GlassInput.tsx
│   │   ├── GlassBadge.tsx
│   │   └── GlassModal.tsx
│   ├── charts/
│   │   ├── SpendingDonut.tsx
│   │   ├── TrendLine.tsx
│   │   ├── CategoryBar.tsx
│   │   └── SavingsArea.tsx
│   ├── transactions/
│   │   ├── TransactionCard.tsx
│   │   ├── TransactionList.tsx
│   │   └── TransactionFilter.tsx
│   ├── ai/
│   │   ├── AIInsightCard.tsx
│   │   ├── AIChatBubble.tsx
│   │   └── AILoadingAnimation.tsx
│   └── dashboard/
│       ├── BalanceHero.tsx
│       ├── QuickActions.tsx
│       └── RecentActivity.tsx
│
├── stores/
│   ├── financeStore.ts
│   ├── aiStore.ts
│   ├── settingsStore.ts
│   └── goalStore.ts
│
├── services/
│   ├── ai/
│   │   ├── claudeService.ts      # Claude API client
│   │   ├── analysisPrompts.ts    # AI prompt templates
│   │   └── insightParser.ts
│   ├── database/
│   │   ├── schema.ts             # WatermelonDB schema
│   │   ├── migrations.ts
│   │   └── repositories/
│   └── notifications/
│       └── reminderService.ts
│
├── hooks/
│   ├── useTransactions.ts
│   ├── useAnalytics.ts
│   ├── useAIInsights.ts
│   ├── useBudget.ts
│   └── useTheme.ts
│
├── theme/
│   ├── colors.ts                 # Glassmorphism renk paleti
│   ├── typography.ts
│   ├── spacing.ts
│   └── glassmorphism.ts          # Glass style helpers
│
├── utils/
│   ├── currency.ts
│   ├── dateHelpers.ts
│   ├── formatters.ts
│   └── validators.ts
│
└── types/
    ├── transaction.ts
    ├── category.ts
    ├── budget.ts
    ├── goal.ts
    └── ai.ts
```

---

## 🔐 Güvenlik & Gizlilik

- Tüm veriler **yerel cihazda** saklanır (WatermelonDB/SQLite)
- API anahtarları **Expo SecureStore** ile şifreli saklanır
- Claude API'ye gönderilen veriler anonimleştirilir (isim, hesap no yok)
- Biyometrik kimlik doğrulama desteği (FaceID / Fingerprint)
- Uygulama arka plana geçtiğinde ekran kilitlenir

---

## 🌍 Lokalizasyon & Para Birimi

- Çoklu para birimi desteği: TRY, USD, EUR, GBP
- Türkçe ve İngilizce dil desteği
- Tarih formatı lokalizasyonu
- i18n-js kütüphanesi kullanımı

---

## 📱 Platform Desteği

| Platform | Min Versiyon |
|----------|-------------|
| iOS      | 14.0+       |
| Android  | API 26+ (Android 8.0+) |
| Expo SDK | 51+         |
