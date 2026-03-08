# 📱 FinanceAI — Ekranlar & Özellikler Detayı

---

## 1. 🏠 Dashboard (Ana Sayfa)

### Bileşenler & Sıralama

```
Dashboard
├── [1] StatusBar (şeffaf, light content)
├── [2] Header — "Merhaba, {isim} 👋" + bildirim ikonu
├── [3] BalanceHero Kartı (büyük cam kart)
│   ├── Toplam bakiye (animasyonlu sayaç)
│   ├── Bu ay: Gelir ↑ | Gider ↓
│   └── Mini donut grafik (sağ köşe)
├── [4] QuickActions Satırı (yatay scroll)
│   ├── + Gelir Ekle
│   ├── - Gider Ekle
│   ├── 🎯 Hedef
│   └── 🤖 AI Analiz
├── [5] AI Insight Kartı (varsa — sarı neon border)
│   ├── AI ikonu + "Yapay Zeka Önerisi"
│   └── Kısa insight metni (max 2 satır) + "Detaylar →"
├── [6] Bütçe Durumu Kartı
│   ├── Aylık bütçe progress bar
│   └── Kategori bazlı mini progress'ler
├── [7] Son İşlemler (max 5 adet)
│   └── "Tümünü Gör →" linki
└── [8] Hedefler Özeti
    └── En yakın hedefe ilerleyiş
```

### BalanceHero Kartı Detayı

```typescript
// Büyük arka plan blur'lu cam kart
// Üst kısımda hafif gradient overlay (mor-mavi)
// Bakiye: Inter ExtraBold, 48px, beyaz
// Para birimi sembolü sol üstte küçük boyutlu
// Animasyon: mount'ta 0→gerçek değer, 1.2s spring
// Alt kısım: iki kolon — Gelir (yeşil ok ↑) | Gider (kırmızı ok ↓)
```

---

## 2. 💸 İşlemler Ekranı

### Özellikler

```
İşlemler
├── Arama Çubuğu (glass input)
├── Filtre Satırı (yatay scroll)
│   ├── Tümü | Gelir | Gider
│   └── Kategori filtreleri
├── Tarih Gruplu Liste
│   ├── "Bugün" başlığı
│   ├── TransactionCard × n
│   ├── "Dün" başlığı
│   └── ...
└── Floating Action Button (+ ekle)
```

### TransactionCard Bileşeni

```typescript
// Swipe-to-delete (sola kaydır → kırmızı silme alanı)
// Swipe-to-edit (sağa kaydır → mavi düzenleme alanı)
// Sol: Kategori ikonu (renkli daire, emoji/SF Symbol)
// Orta: İşlem adı + kategori etiketi
// Sağ: Tutar (gelir=yeşil, gider=kırmızı) + tarih
// Press: Detay sayfasına geçiş (shared element transition)
```

### İşlem Ekleme Modal

```typescript
// Bottom sheet modal (yarım ekran → tam ekran)
// Adım 1: Tür seçimi — Gelir / Gider (animasyonlu toggle)
// Adım 2: Tutar girişi (büyük sayı klavyesi, native-like)
// Adım 3: Kategori seçimi (grid, emoji ikonlu)
// Adım 4: Detaylar — not, tarih, tekrarlama
// Kaydet: haptic feedback + confetti animasyonu (gelir için)
// Zorunlu alanlar: tür, tutar, kategori
```

---

## 3. 📊 Analitik Ekranı

### İçerik

```
Analitik
├── Dönem Seçici (Bu Hafta | Bu Ay | Bu Yıl | Özel)
├── Özet Kartları (3'lü grid)
│   ├── Toplam Gelir
│   ├── Toplam Gider
│   └── Net (Tasarruf)
├── Trend Grafiği (LineChart / AreaChart)
│   └── Gelir vs Gider karşılaştırması
├── Harcama Dağılımı (DonutChart)
│   └── Kategori bazlı yüzdeler
├── En Çok Harcanan Kategoriler (HorizontalBarChart)
├── Günlük Ortalama Harcama
└── AI Analiz Özeti Kartı
```

### Grafik Etkileşimleri

```
- Grafiğe dokunma: tooltip göster (cam kart)
- Pasta dilimine dokunma: kategori detayı aç
- Dönem değişimi: akıcı veri geçiş animasyonu
- Zoom: pinch gesture ile zaman aralığı değiştirme
```

---

## 4. 🎯 Hedefler Ekranı

### Özellikler

```
Hedefler
├── Aktif Hedefler (yatay scroll kart listesi)
│   └── GoalCard: isim, ikon, progress ring, kalan tutar, tarih
├── + Yeni Hedef Ekle butonu
├── Tamamlanan Hedefler (küçük liste)
└── AI Hedef Önerisi Kartı
```

### GoalCard Bileşeni

```typescript
// Dairesel progress (SVG animated ring)
// Gradient renk (hedefe özel)
// İçinde: yüzde tamamlanma + kalan gün
// Altında: "₺X / ₺Y" gösterimi
// Long press: hızlı ödeme ekleme
```

### Yeni Hedef Ekleme

```
- Hedef adı
- Hedef tutarı
- Bitiş tarihi
- Ikon seçici (emoji grid)
- Renk seçici
- Aylık katkı önerisi (AI hesaplar)
```

---

## 5. 👤 Profil & Ayarlar Ekranı

```
Profil
├── Kullanıcı Adı & Avatar (emoji seçici)
├── İstatistik Özeti (toplam işlem, aktif süre)
├── ──── HESAP ────
├── Para Birimi Seçimi
├── Dil Seçimi (TR / EN)
├── Bildirim Ayarları
├── ──── GÜVENLİK ────
├── Biyometrik Kilit
├── Uygulama PIN'i
├── ──── VERİ ────
├── Veri Dışa Aktar (CSV / PDF)
├── Veri İçe Aktar
├── Tüm Verileri Sil
├── ──── YAPAY ZEKA ────
├── Claude API Anahtarı (opsiyonel)
├── AI Analiz Sıklığı
└── ──── HAKKINDA ────
    ├── Uygulama Versiyonu
    └── Gizlilik Politikası
```

---

## 6. 🤖 AI Asistan Modal

```
AI Chat Ekranı
├── Header: "FinanceAI Asistanı" + model bilgisi
├── Chat Geçmişi (sohbet baloncukları)
├── Hızlı Soru Önerileri (yatay chip'ler)
│   ├── "Bu ay nerede fazla harcadım?"
│   ├── "Tasarruf önerileri ver"
│   ├── "Bütçemi değerlendir"
│   └── "Finansal hedeflerimi analiz et"
├── Mesaj Input
└── Gönder Butonu
```

### AI Yanıt Formatı

```typescript
// Yanıtlar markdown destekli render edilir
// Code blocks → glass styled container
// Sayısal veriler → yeşil/kırmızı renk kodlaması
// Listeler → bullet animasyonu
// Yanıt gelirken: typing indicator (3 nokta animasyonu)
```

---

## 7. 🎉 Onboarding Akışı

```
Karşılama (3 adım)
├── Splash: Logo + "FinanceAI" animasyonu
├── Adım 1: "Finanslarını akıllıca yönet" (özellik sunumu)
├── Adım 2: Para birimi & dil seçimi
├── Adım 3: İlk bütçe kurulumu (opsiyonel)
└── Dashboard'a giriş
```

---

## 8. 🔔 Bildirimler

```
Bildirim Tipleri:
├── Günlük harcama hatırlatıcısı (ayarlanabilir saat)
├── Bütçe aşım uyarısı (%80 ve %100)
├── Hedef tamamlama kutlaması 🎉
├── Aylık AI analiz raporu hazır
└── Tekrarlayan işlem hatırlatıcısı
```

---

## 9. 📤 Veri Dışa Aktarma

```
Export Seçenekleri:
├── CSV (tüm işlemler)
├── PDF Raporu (aylık özet + grafikler)
└── Paylaş (sistem share sheet)
```

---

## 10. 🔄 Tekrarlayan İşlemler

```
Tekrarlama Seçenekleri:
├── Günlük
├── Haftalık (gün seçimi)
├── Aylık (gün seçimi)
├── Yıllık
└── Özel aralık

Otomatik oluşturma: Uygulama açıldığında
Background task: Expo Background Fetch ile
```
