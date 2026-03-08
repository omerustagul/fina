# 🎨 FinanceAI — Tasarım Sistemi & Glassmorphism Rehberi

---

## 🌈 Renk Paleti

### Ana Gradyanlar (Arka Plan)

```typescript
// theme/colors.ts

export const GRADIENTS = {
  // Ana arka plan — koyu mor-mavi derinlik
  background: {
    dark: ['#0A0015', '#0D0A2E', '#0A1628'],
    light: ['#E8EAF6', '#F3E5F5', '#EDE7F6'],
  },

  // Accent gradyanlar
  income: ['#00D2FF', '#7B2FBE'],       // Mavi → Mor (gelir)
  expense: ['#FF416C', '#FF4B2B'],      // Kırmızı-pembe (gider)
  savings: ['#11998E', '#38EF7D'],      // Yeşil (birikim)
  neutral: ['#4776E6', '#8E54E9'],      // Mavi-mor (genel)
  ai: ['#F7971E', '#FFD200'],           // Sarı-turuncu (AI)
  goal: ['#DA22FF', '#9733EE'],         // Mor (hedef)
} as const;

export const GLASS = {
  // Glassmorphism yüzey renkleri
  surface: {
    primary: 'rgba(255, 255, 255, 0.08)',
    secondary: 'rgba(255, 255, 255, 0.05)',
    elevated: 'rgba(255, 255, 255, 0.12)',
    highlight: 'rgba(255, 255, 255, 0.15)',
  },

  border: {
    subtle: 'rgba(255, 255, 255, 0.08)',
    default: 'rgba(255, 255, 255, 0.15)',
    strong: 'rgba(255, 255, 255, 0.25)',
  },

  text: {
    primary: 'rgba(255, 255, 255, 0.95)',
    secondary: 'rgba(255, 255, 255, 0.65)',
    muted: 'rgba(255, 255, 255, 0.40)',
    disabled: 'rgba(255, 255, 255, 0.25)',
  },

  shadow: {
    soft: 'rgba(0, 0, 0, 0.25)',
    medium: 'rgba(0, 0, 0, 0.40)',
    hard: 'rgba(0, 0, 0, 0.60)',
  }
} as const;

// Kategori renkleri
export const CATEGORY_COLORS = {
  food:          '#FF6B6B',
  transport:     '#4ECDC4',
  shopping:      '#45B7D1',
  entertainment: '#96CEB4',
  health:        '#88D8B0',
  education:     '#FFEAA7',
  housing:       '#DDA0DD',
  salary:        '#00D2FF',
  freelance:     '#38EF7D',
  investment:    '#FFD700',
  other:         '#B8B8B8',
} as const;
```

---

## 🪟 Glassmorphism Stil Sistemi

### Temel Glass Bileşen Stili

```typescript
// theme/glassmorphism.ts
import { StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export const glassStyles = StyleSheet.create({
  // Temel glass kart
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    // iOS için blur efekti BlurView ile eklenir
    // Android için blur yaklaşımı farklıdır
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 32,
      },
      android: {
        elevation: 8,
      }
    })
  },

  // Küçük glass rozet/badge
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.20)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  // Büyük hero kartı
  heroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },

  // Input alanı
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 16,
  },

  // Buton
  button: {
    primary: {
      borderRadius: 16,
      overflow: 'hidden',
      // İçi gradient LinearGradient ile doldurulur
    },
    secondary: {
      backgroundColor: 'rgba(255, 255, 255, 0.10)',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.20)',
    }
  }
});
```

### GlassCard Bileşeni

```typescript
// components/ui/GlassCard.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;       // blur yoğunluğu (0-100)
  variant?: 'default' | 'elevated' | 'subtle';
  animated?: boolean;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 20,
  variant = 'default',
  animated = true,
  delay = 0,
}) => {
  const Container = animated ? Animated.View : View;
  const animProps = animated
    ? { entering: FadeInDown.delay(delay).springify() }
    : {};

  const variantStyles = {
    default:  { backgroundColor: 'rgba(255,255,255,0.08)' },
    elevated: { backgroundColor: 'rgba(255,255,255,0.13)' },
    subtle:   { backgroundColor: 'rgba(255,255,255,0.04)' },
  };

  if (Platform.OS === 'ios') {
    return (
      <Container {...animProps} style={[styles.wrapper, style]}>
        <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[styles.content, variantStyles[variant]]}>
          {children}
        </View>
      </Container>
    );
  }

  // Android: blur yok, yarı-saydam arka plan
  return (
    <Container {...animProps} style={[styles.wrapper, variantStyles[variant], style]}>
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  }
});
```

---

## ✍️ Tipografi

```typescript
// theme/typography.ts
import { Platform } from 'react-native';

export const FONTS = {
  // Inter font ailesi (expo-font ile yüklenir)
  family: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    extraBold: 'Inter-ExtraBold',
  },

  size: {
    xs:   11,
    sm:   13,
    md:   15,
    base: 16,
    lg:   18,
    xl:   20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 34,
    '5xl': 42,
    hero:  56,
  },

  lineHeight: {
    tight:   1.2,
    normal:  1.5,
    relaxed: 1.8,
  }
} as const;
```

---

## 📐 Spacing & Layout

```typescript
// theme/spacing.ts
export const SPACING = {
  xs:  4,
  sm:  8,
  md:  12,
  base: 16,
  lg:  20,
  xl:  24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export const RADIUS = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  '2xl': 24,
  '3xl': 28,
  full: 9999,
} as const;

// Güvenli alan sabitleri
export const LAYOUT = {
  tabBarHeight: 84,
  headerHeight: 60,
  screenPadding: 20,
} as const;
```

---

## 🎭 Animasyon Rehberi

### Kullanılacak Animasyon Tipleri

```typescript
// Sayfa geçişleri
entering: FadeInDown.springify().damping(15)
exiting:  FadeOutUp.springify()

// Kart hover/press efekti
scale: withSpring(0.97, { damping: 15 })

// Sayı sayaç animasyonu (bakiye gösterimi)
// react-native-reanimated ile useDerivedValue + useAnimatedProps

// Tab bar ikonu
withSpring(selected ? 1 : 0, { overshootClamping: false })

// Skeleton loading
// Mantine-style shimmer effect

// Transaction swipe-to-delete
// Gesture Handler + Reanimated kombinasyonu

// Modal açılış
SlideInDown.springify().damping(18)
```

### Mikro-animasyon Prensipleri

- Tüm dokunma aksiyonları **<200ms** geri bildirim vermeli
- Spring animasyonları tercih edilmeli (timing yerine)
- `damping: 12-18` aralığı doğal hissettirmelidir
- Sayfa geçişleri **<350ms** tamamlanmalı
- Skeleton loader arka planla uyumlu renk kullanmalı

---

## 🌙 Dark Mode (Varsayılan)

Uygulama **varsayılan olarak koyu tema** kullanır. Açık tema opsiyonel olarak sunulabilir. Sistem teması otomatik algılanır.

```typescript
// hooks/useTheme.ts
import { useColorScheme } from 'react-native';
import { useSettingsStore } from '@/stores/settingsStore';

export const useTheme = () => {
  const systemScheme = useColorScheme();
  const { themePreference } = useSettingsStore();

  const isDark = themePreference === 'system'
    ? systemScheme === 'dark'
    : themePreference === 'dark';

  return { isDark, colors: isDark ? darkColors : lightColors };
};
```

---

## 📊 Grafik Tasarım Rehberi

### Renk & Stil Tutarlılığı

- Tüm grafikler **şeffaf arka plan** üzerine çizilmeli
- Çizgi grafikler: `strokeWidth: 2.5`, gradient fill
- Bar grafikler: `borderRadius: 8`, gradient renk
- Pasta grafikler: `innerRadius: 60%` (donut), neon glow efekti
- Eksen etiketleri: `rgba(255,255,255,0.5)` renk
- Grid çizgileri: `rgba(255,255,255,0.06)` renk

### Animasyonlu Grafik Yükleme

Her grafik mount olduğunda `withTiming(1, { duration: 800 })` ile animasyonlu çizim yapılmalıdır.
