# 🎨 Fina — Marka Kimliği & Logo Brief

---

## 🧭 Marka Özeti

**Fina**, Türkiye merkezli, global vizyonlu bir kişisel finans yönetim uygulamasıdır.
Kullanıcılarına yapay zeka destekli finansal içgörüler sunan Fina, rakiplerinden farklı olarak
**güven, netlik ve sofistike bir deneyim** vadeder.

> *"Finansını anla. Geleceğini şekillendir."*

---

## 🎭 Marka Kişiliği

### Arketip: "Bilge Danışman"
Fina, kullanıcısına karmaşık finansal verileri sade ve anlaşılır bir dille aktaran,
yargılamayan, güvenilir bir rehber gibi davranır.

### Sıfatlar
| Olan | Olmayan |
|------|---------|
| Güvenilir | Soğuk / bürokratik |
| Sofistike | Gösterişli / abartılı |
| Net ve dürüst | Karmaşık |
| Modern | Modaya bağımlı |
| Empati kuran | Mesafeli |

### Ses Tonu (Tone of Voice)
- Kısa ve net cümleler
- Teknik jargondan kaçın, ama sığ da olma
- Kullanıcıyı "sen" diye hitap et
- Başarıları kutla, hataları nazikçe uyar
- Türkçe yazımda özensiz kısaltmalardan kaçın

---

## 🖋️ Logo Konsepti

### Yapı: İkon + Wordmark Kombinasyonu

```
[ İkon ]  fina
```

Logo iki bileşenden oluşur:
1. **İkon** — soyut, geometrik, tek renk uyumlu
2. **Wordmark** — "fina" kelimesi, küçük harf, özel tipografi

---

### İkon Konsept Yönleri (Tasarımcıya 3 Alternatif)

**Yön A — "Akış" (Önerilen)**
Üst üste binen iki soyut eğri çizgi — bir yandan akışı,
öte yandan büyümeyi temsil eder. Minimalist, sadece çizgilerden oluşur.
Referans his: Monzo, Wise logoları.

**Yön B — "F Harfi & Grafik"**
Stilize edilmiş "F" harfi, aynı zamanda yukarı çıkan bir bar grafik izlenimi verir.
Finans uygulaması olduğu sezilir ama klişeye düşmemeli.

**Yön C — "Elmas / Dörtgen"**
45 derece döndürülmüş, köşeleri yumuşatılmış kare — içinde ince bir dikey çizgi.
Premium, mücevher çağrışımı. Referans: Linear, Notion logoları.

---

### Wordmark Tipografisi

**Birincil Tercih:** `DM Sans` veya `Instrument Sans` — Light/Regular kesim
- Küçük harf: **fina**
- Harf aralığı (letter-spacing): +0.02em ile +0.05em arası
- Hiçbir zaman büyük harf FINA olarak kullanılmaz (ana logoda)

**Alternatif:** `Geist` veya `Syne` — daha teknik his için

> ⚠️ Tasarımcıya not: Inter ve Roboto kesinlikle kullanılmayacak.
> Tipografi seçimi markanın sofistike duruşunu doğrudan etkiler.

---

## 🎨 Renk Sistemi

### Ana Palet

```
Birincil (Primary)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#1A0533   — Derin Mor (arka plan, zemin)
#2D0F5E   — Orta Mor (yüzeyler)
#6C3CE1   — Canlı Mor (CTA, vurgu)
#9B6BF2   — Açık Mor (hover, ikincil vurgu)

Nötr (Neutral)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#0C0014   — Siyah-Mor (en koyu arka plan)
#FFFFFF   — Saf Beyaz (metin, ikonlar)
#E8E0F0   — Kırık Beyaz (ikincil metin)
#6B5F80   — Soluk Mor (devre dışı, placeholder)

Aksan (Accent)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#00E5CC   — Neon Turkuaz (gelir, pozitif)
#FF4D6D   — Mercan Kırmızı (gider, uyarı)
#FFD166   — Amber Sarı (AI vurgusu, hedef)
#38EF7D   — Neon Yeşil (başarı, tamamlama)
```

### Gradient Tanımları

```css
/* Ana marka gradyanı — logo ve hero alanlarda */
--gradient-brand: linear-gradient(135deg, #2D0F5E 0%, #6C3CE1 100%);

/* Premium yüzey gradyanı */
--gradient-surface: linear-gradient(145deg, #1A0533 0%, #0C0014 100%);

/* Gelir vurgusu */
--gradient-income: linear-gradient(135deg, #00E5CC 0%, #38EF7D 100%);

/* Gider vurgusu */
--gradient-expense: linear-gradient(135deg, #FF4D6D 0%, #FF8C42 100%);

/* AI / Yapay Zeka aksanı */
--gradient-ai: linear-gradient(135deg, #FFD166 0%, #FF9A3C 100%);
```

---

## 📐 Logo Kullanım Kuralları

### Boyutlar

| Kullanım Alanı | Minimum Boyut |
|----------------|---------------|
| App Icon (iOS/Android) | 1024×1024px kaynak |
| Tab Bar / Küçük ikon | 24×24px |
| Splash Screen | Orijinal oran, beyaz zemin üzeri |
| Pazarlama görseli | Vektör (SVG/AI) |

### Güvenli Alan (Clear Space)
Logo çevresinde her yönde en az **logo yüksekliğinin %25'i** kadar boş alan bırakılır.

### Renk Varyantları
| Versiyon | Kullanım |
|----------|----------|
| **Renkli** (mor gradient + beyaz) | Koyu arka planlar, ana kullanım |
| **Beyaz** (tam beyaz) | Koyu fotoğraf üzeri |
| **Tek Renk Mor** | Baskı, tek renk kullanım |
| **Siyah** | Açık arka planlar |

### Kesinlikle Yapılmayacaklar
- ❌ Logo rengi değiştirilmez
- ❌ İkon ve wordmark birbirinden ayrılmaz (yalnızca app icon hariç)
- ❌ Logo gölge almaz
- ❌ Logo döndürülmez
- ❌ Logo uzatılıp sıkıştırılmaz
- ❌ Düşük kontrastlı arka plan üzerine konulmaz

---

## 📱 App Icon Tasarımı

```
Arka Plan: Koyu mor (#1A0533) veya brand gradient
İkon:      Beyaz, merkezi hizalı, ikonun etrafında %15 padding
Köşe:      iOS standartlarına göre yuvarlanmış (sistem kırpar)
```

**His:** Apple'ın uygulama mağazasında Revolut, N26 gibi
premium fintech ikonlarının yanında durduğunda aynı ligde hissettirmeli.

---

## 🌐 Marka Sesi — Örnek Metinler

### App Store Açıklaması (TR)
> "Fina ile gelir ve giderlerini tek bir yerde takip et.
> Yapay zeka destekli analizlerle harcama alışkanlıklarını anla,
> finansal hedeflerine daha hızlı ulaş."

### Onboarding Karşılama
> "Hoş geldin. Finansını anlamanın en kolay yolu buradan başlıyor."

### Boş Durum (İlk Kullanım)
> "Henüz işlem yok. İlk gelirini veya giderini ekleyerek başla."

### Bütçe Aşım Uyarısı
> "Bu ay market harcamaların bütçenin %85'ine ulaştı.
> Fina seni önceden uyarmak istedi."

### AI Öneri
> "Geçen aya göre yemek harcamaların %23 arttı.
> Küçük bir düzenlemeyle bu ay ₺480 tasarruf edebilirsin."

---

## 🔤 Marka Adı Yazım Kuralları

| Bağlam | Yazım |
|--------|-------|
| Logo / Wordmark | `fina` (küçük harf) |
| Cümle içi | `Fina` (baş harf büyük) |
| Hashtag | `#Fina` veya `#FinaApp` |
| Domain önerisi | `fina.app` / `getfina.app` / `finawallet.app` |
| Social handle | `@finaapp` |

---

## 📦 Tasarımcıya Teslim Edilecek Dosyalar

```
fina-brand-kit/
├── logo/
│   ├── fina-logo-primary.svg
│   ├── fina-logo-white.svg
│   ├── fina-logo-black.svg
│   ├── fina-icon-only.svg
│   └── fina-wordmark-only.svg
├── app-icon/
│   ├── fina-icon-1024.png
│   ├── fina-icon-512.png
│   └── fina-icon-android-adaptive.png
├── colors/
│   └── fina-color-palette.ase   (Adobe Swatch)
├── fonts/
│   └── kullanılan-font-lisansı.txt
└── guidelines/
    └── fina-brand-guidelines.pdf
```
