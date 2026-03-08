# ⚙️ Fina — Kurulum, Bağımlılıklar & Kodlama Standartları

---

## 📦 package.json — Tüm Bağımlılıklar

```json
{
  "name": "Fina",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "lint": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-router": "~3.5.0",
    "react": "18.2.0",
    "react-native": "0.74.0",

    "@expo/vector-icons": "^14.0.0",
    "expo-blur": "~13.0.0",
    "expo-font": "~12.0.0",
    "expo-haptics": "~13.0.0",
    "expo-secure-store": "~13.0.0",
    "expo-notifications": "~0.28.0",
    "expo-background-fetch": "~12.0.0",
    "expo-task-manager": "~11.8.0",
    "expo-sharing": "~12.0.0",
    "expo-file-system": "~17.0.0",
    "expo-local-authentication": "~14.0.0",

    "react-native-reanimated": "~3.10.0",
    "react-native-gesture-handler": "~2.16.0",
    "react-native-safe-area-context": "4.10.1",
    "react-native-screens": "3.31.1",
    "react-native-svg": "15.2.0",

    "zustand": "^4.5.0",
    "@nozbe/watermelondb": "^0.27.0",
    "@nozbe/with-observables": "^1.6.0",

    "victory-native": "^40.0.0",
    "@shopify/react-native-skia": "^1.2.0",

    "expo-linear-gradient": "~13.0.0",
    "react-native-reanimated-carousel": "^3.5.0",

    "@react-native-async-storage/async-storage": "1.23.1",
    "date-fns": "^3.6.0",
    "i18n-js": "^4.4.0",
    "react-native-localize": "^3.0.4",

    "react-native-bottom-sheet": "@gorhom/bottom-sheet@^4",
    "@gorhom/bottom-sheet": "^4.6.0",

    "react-native-keyboard-controller": "^1.12.0",
    "react-native-confetti-cannon": "^1.5.2"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@types/react": "~18.2.0",
    "@types/react-native": "~0.73.0",
    "typescript": "^5.3.0",
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "prettier": "^3.2.0"
  }
}
```

---

## 🗂️ app.json (Expo Config)

```json
{
  "expo": {
    "name": "Fina",
    "slug": "fina",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0A0015"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.yourname.fina",
      "infoPlist": {
        "NSFaceIDUsageDescription": "Hesabınızı korumak için Face ID kullanılır",
        "NSCameraUsageDescription": "Makbuz fotoğrafı çekmek için kullanılır"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0A0015"
      },
      "package": "com.yourname.fina",
      "permissions": [
        "USE_BIOMETRIC",
        "USE_FINGERPRINT",
        "CAMERA",
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE"
      ]
    },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      [
        "expo-notifications",
        {
          "color": "#7B2FBE"
        }
      ],
      [
        "expo-local-authentication",
        {
          "faceIDPermission": "Hesabınızı korumak için Face ID kullanılır"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

---

## 📏 Kodlama Standartları

### TypeScript Kuralları

```typescript
// ✅ DOĞRU — Her zaman tipleri açık yaz
const addTransaction = async (
  transaction: Omit<Transaction, 'id' | 'createdAt'>
): Promise<void> => { ... }

// ✅ DOĞRU — Interface tercih et, Type ikincil
interface TransactionCardProps {
  transaction: Transaction;
  onPress: (id: string) => void;
  onSwipeDelete?: (id: string) => void;
}

// ❌ YANLIŞ — any kullanma
const data: any = await fetchData();

// ✅ DOĞRU — unknown kullan, guard ile daralt
const data: unknown = await fetchData();
if (isTransaction(data)) { ... }
```

### Bileşen Yapısı

```typescript
// Her bileşen için standart yapı:

import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { GLASS, SPACING, FONTS } from '@/theme';

// 1. Props interface
interface MyComponentProps {
  // ...
}

// 2. Component (arrow function, default export)
const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 }) => {
  // 3. Hooks (sıra önemli: state → ref → animated → memo → callback → effect)
  const scale = useSharedValue(1);
  
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15 });
    // ...
  }, []);

  // 4. Render
  return (
    <Animated.View style={[styles.container, animStyle]}>
      {/* içerik */}
    </Animated.View>
  );
};

// 5. Styles (en alta, theme token'ları kullan)
const styles = StyleSheet.create({
  container: {
    backgroundColor: GLASS.surface.primary,
    borderRadius: 20,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: GLASS.border.default,
  },
});

export default MyComponent;
```

### Para Birimi Formatlama

```typescript
// utils/currency.ts
export const formatCurrency = (
  amount: number,
  currency: string = 'TRY',
  locale: string = 'tr-TR'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Kullanım
formatCurrency(1234.56, 'TRY') // ₺1.234,56
formatCurrency(1234.56, 'USD', 'en-US') // $1,234.56
```

### Tarih Yardımcıları

```typescript
// utils/dateHelpers.ts
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
         startOfYear, endOfYear, format, isToday, isYesterday } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';

export const getDateRange = (period: 'week' | 'month' | 'year'): DateRange => {
  const now = new Date();
  switch (period) {
    case 'week':  return { start: startOfWeek(now, { locale: tr }), end: endOfWeek(now, { locale: tr }) };
    case 'month': return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'year':  return { start: startOfYear(now), end: endOfYear(now) };
  }
};

export const formatTransactionDate = (date: Date, locale = 'tr'): string => {
  if (isToday(date))     return 'Bugün';
  if (isYesterday(date)) return 'Dün';
  return format(date, 'd MMMM yyyy', { locale: locale === 'tr' ? tr : enUS });
};
```

---

## 🧭 Navigation (Expo Router)

```typescript
// app/_layout.tsx
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'ios' 
            ? 'transparent' 
            : 'rgba(10, 0, 21, 0.95)',
          borderTopWidth: 0,
          elevation: 0,
          height: 84,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView tint="dark" intensity={60} style={{ flex: 1 }} />
          ) : null,
      }}
    >
      <Tabs.Screen name="index"        options={{ title: 'Ana Sayfa' }} />
      <Tabs.Screen name="transactions" options={{ title: 'İşlemler' }} />
      <Tabs.Screen name="analytics"    options={{ title: 'Analitik' }} />
      <Tabs.Screen name="goals"        options={{ title: 'Hedefler' }} />
      <Tabs.Screen name="profile"      options={{ title: 'Profil' }} />
    </Tabs>
  );
}
```

---

## 🔔 Bildirim Servisi

```typescript
// services/notifications/reminderService.ts
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const scheduleDailyReminder = async (hour: number, minute: number) => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💰 Günlük Harcama Kaydı',
      body: 'Bugünkü harcamalarını kaydetmeyi unutma!',
      data: { screen: 'add-transaction' },
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
};

export const sendBudgetWarning = async (
  categoryName: string,
  percentage: number
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `⚠️ ${categoryName} Bütçe Uyarısı`,
      body: `${categoryName} bütçenizin %${percentage}'ini kullandınız.`,
      data: { screen: 'analytics' },
    },
    trigger: null, // anında gönder
  });
};
```

---

## 🧪 Test Stratejisi

```
Test Araçları:
├── Jest + @testing-library/react-native (unit & component)
├── Detox (E2E - opsiyonel)
└── TypeScript strict mode (statik analiz)

Öncelikli Test Alanları:
├── financeStore.ts → tüm hesaplama metodları
├── claudeService.ts → prompt oluşturma, hata yönetimi
├── currency.ts → formatlama edge case'leri
├── dateHelpers.ts → dönem hesaplamaları
└── TransactionCard → render, swipe aksiyonları
```

---

## 🚀 Geliştirme Öncelikleri (Aşama Aşama)

```
Faz 1 — Temel Altyapı (1-2 hafta)
├── Proje kurulumu, navigasyon, tema sistemi
├── WatermelonDB schema ve repository'ler
├── Zustand store'ları
└── GlassCard, GlassButton, GlassInput bileşenleri

Faz 2 — Çekirdek Özellikler (2-3 hafta)
├── Dashboard ekranı
├── İşlem ekleme/listeleme/silme
├── Kategori yönetimi
└── Temel grafikler (DonutChart, LineChart)

Faz 3 — Gelişmiş Özellikler (2-3 hafta)
├── Bütçe yönetimi
├── Finansal hedefler
├── Gelişmiş analitik ekranı
└── Bildirim servisi

Faz 4 — AI & Cilalama (1-2 hafta)
├── Claude API entegrasyonu
├── AI insight kartları
├── AI chat ekranı
├── Animasyonların iyileştirilmesi
└── Onboarding akışı

Faz 5 — Yayın Hazırlığı
├── Veri dışa aktarma (CSV, PDF)
├── Biyometrik kimlik doğrulama
├── Performance optimizasyonu
├── App Store / Play Store görselleri
└── EAS Build ile yayına hazırlık
```

---

## ⚡ Performans Kuralları

1. **FlatList** — büyük listeler için `getItemLayout`, `keyExtractor`, `windowSize: 5`
2. **React.memo** — tüm liste öğesi bileşenlerine uygula
3. **useMemo** — pahalı hesaplamalar (toplam, filtreleme) için
4. **useCallback** — event handler'lar için
5. **Lazy Loading** — grafikler için dinamik import kullan
6. **Image Caching** — expo-image kütüphanesi kullan
7. **Hermes** — Android'de JavaScript motoru olarak aktif bırak
8. **InteractionManager** — ağır işlemleri animasyon sonrasına ertele
