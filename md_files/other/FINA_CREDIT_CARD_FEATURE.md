# 💳 Fina — Akıllı Kredi Kartı Yönetimi & Findeks Optimizasyonu
## Özellik Spesifikasyonu v1.0

---

## 🎯 Özelliğin Amacı

Kullanıcının sahip olduğu tüm kredi kartlarını tek bir ekranda yönetmesini,
hesap özetlerini takip etmesini ve Fina'nın yapay zeka destekli ödeme motoru
sayesinde **Findeks (KKB) kredi notunu düşürmeden, mümkünse artıracak şekilde**
hangi karta ne kadar ödeme yapması gerektiğini otomatik olarak hesaplamasını sağlar.

---

## 🧠 Temel Mantık: Findeks Skoru Nasıl Etkilenir?

Sistemin doğru karar verebilmesi için şu faktörler baz alınır:

### 1. Kart Kullanım Oranı (Utilization Rate) — En Kritik Faktör
```
Kullanım Oranı = Borç Bakiyesi / Kredi Limiti × 100

İdeal hedef:  < %30  → Skor korunur veya artar
Tehlike zonu: > %50  → Skor düşmeye başlar
Kritik zone:  > %80  → Skor ciddi zarar görür
```

### 2. Asgari Ödeme Kaçırma
```
- 1 asgari ödeme kaçırma  → Skor -40 ile -80 puan
- 30+ gün gecikme         → Skor -100 ile -150 puan
- Hiç ödeme yapılmaması   → Skor yıkıcı zarar görür
```

### 3. Toplam Borç / Toplam Limit Oranı (Cross-card utilization)
```
Tüm kartların toplam borcu / Tüm kartların toplam limiti
Bu oran %30 altında tutulmalı — her kart tek tek değil, TOPLAM önemli
```

### 4. Ödeme Düzenliliği (Payment History)
```
- Düzenli asgari ödeme bile skoru korur
- Tam ödeme skoru en çok artırır
- Erken ödeme de pozitif sinyal verir
```

---

## 📐 Akıllı Ödeme Algoritması

### Girdi Değerleri (Her Kart İçin)

```typescript
interface CreditCard {
  id: string;
  bankName: string;               // "Garanti", "Yapı Kredi", vb.
  cardName: string;               // "Bonus Card", "World Card", vb.
  lastFourDigits: string;
  creditLimit: number;            // Toplam kredi limiti
  currentDebt: number;            // Güncel borç bakiyesi
  statementDebt: number;          // Hesap özeti borcu (son ekstre)
  minimumPayment: number;         // Asgari ödeme tutarı
  minimumPaymentMode: 'auto' | 'manual'; // Sistem mi hesaplasın kullanıcı mı girer
  paymentDueDate: Date;           // Son ödeme tarihi
  statementClosingDate: Date;     // Hesap kesim tarihi
  interestRate: number;           // Aylık faiz oranı (%)
  color: string;                  // Kart rengi (UI için)
  cardNetwork: 'visa' | 'mastercard' | 'troy' | 'amex';
}
```

### Asgari Ödeme Otomatik Hesaplama

```typescript
// Türkiye'deki bankaların genel asgari ödeme formülü:
function calculateMinimumPayment(card: CreditCard): number {
  const MINIMUM_PAYMENT_RATE = 0.20; // %20 (BDDK zorunluluğu — 2024 itibarıyla)
  const MINIMUM_FIXED_AMOUNT = 100;  // Minimum sabit tutar (₺)

  if (card.statementDebt <= 0) return 0;

  const calculated = card.statementDebt * MINIMUM_PAYMENT_RATE;
  return Math.max(calculated, MINIMUM_FIXED_AMOUNT);

  // Not: Bazı bankalar %25 uygular, kullanıcı manuel override edebilir
}
```

### Ana Ödeme Dağıtım Algoritması

```typescript
interface PaymentPlan {
  cardId: string;
  recommendedPayment: number;
  minimumPayment: number;
  utilizationAfterPayment: number;  // ödeme sonrası kullanım oranı
  scoreImpact: 'positive' | 'neutral' | 'negative';
  priority: number;                 // 1 = en öncelikli
  reasoning: string;                // Neden bu kadar önerildi
}

function calculateOptimalPayments(
  cards: CreditCard[],
  availableBudget: number           // Kullanıcının ödemelere ayırabileceği toplam para
): PaymentPlan[] {

  // ADIM 1: Tüm asgarileri öde — bunlar zorunlu
  const totalMinimums = cards.reduce((sum, c) => sum + c.minimumPayment, 0);

  if (availableBudget < totalMinimums) {
    // Bütçe asgarileri karşılamıyor — sadece en kritik kartlara öncelik ver
    return prioritizeByDueDate(cards, availableBudget);
  }

  let remainingBudget = availableBudget - totalMinimums;
  const plans: PaymentPlan[] = cards.map(card => ({
    cardId: card.id,
    recommendedPayment: card.minimumPayment, // Başlangıç: asgari ödeme
    minimumPayment: card.minimumPayment,
    utilizationAfterPayment: calculateUtilization(card, card.minimumPayment),
    scoreImpact: 'neutral',
    priority: 0,
    reasoning: 'Asgari ödeme',
  }));

  // ADIM 2: Kalan bütçeyi öncelik sırasına göre dağıt
  // Öncelik sırası:
  //   1. Kullanım oranı %80+ olan kartlar (kritik — hemen düşür)
  //   2. Son ödeme tarihi en yakın olan kartlar
  //   3. Kullanım oranı %50-80 arası kartlar (%30 altına çek)
  //   4. En yüksek faiz oranlı kart (avalanche metodu)
  //   5. En düşük borçlu kart (snowball metodu — psikolojik motivasyon)

  const prioritized = [...cards].sort((a, b) => {
    const scoreA = getPriorityScore(a);
    const scoreB = getPriorityScore(b);
    return scoreB - scoreA;
  });

  for (const card of prioritized) {
    if (remainingBudget <= 0) break;

    const plan = plans.find(p => p.cardId === card.id)!;
    const targetDebt = card.creditLimit * 0.29; // %30'un altına çek
    const extraNeeded = Math.max(0, card.currentDebt - card.minimumPayment - targetDebt);
    const extraPayment = Math.min(extraNeeded, remainingBudget);

    plan.recommendedPayment += extraPayment;
    remainingBudget -= extraPayment;

    // Kalan bütçe varsa tam ödemeye çalış
    if (remainingBudget > 0) {
      const fullPaymentExtra = Math.min(
        card.statementDebt - plan.recommendedPayment,
        remainingBudget
      );
      if (fullPaymentExtra > 0) {
        plan.recommendedPayment += fullPaymentExtra;
        remainingBudget -= fullPaymentExtra;
      }
    }

    plan.utilizationAfterPayment = calculateUtilization(card, plan.recommendedPayment);
    plan.scoreImpact = getScoreImpact(plan.utilizationAfterPayment);
    plan.reasoning = buildReasoning(card, plan);
  }

  return plans.sort((a, b) => b.priority - a.priority);
}

function getPriorityScore(card: CreditCard): number {
  const utilization = (card.currentDebt / card.creditLimit) * 100;
  const daysUntilDue = getDaysUntilDue(card.paymentDueDate);

  let score = 0;
  if (utilization > 80) score += 100;
  else if (utilization > 50) score += 60;
  else if (utilization > 30) score += 30;

  if (daysUntilDue <= 3)  score += 80;
  else if (daysUntilDue <= 7)  score += 50;
  else if (daysUntilDue <= 14) score += 20;

  score += card.interestRate * 2; // Yüksek faiz = yüksek öncelik

  return score;
}
```

---

## 📱 Ekranlar & UI

### 1. Kredi Kartları Ana Ekranı

```
KrediKartları Ekranı
├── Header: "Kredi Kartları" + toplam borç özeti
├── Özet Şerit (yatay, 3 metrik)
│   ├── Toplam Borç
│   ├── Toplam Limit
│   └── Ortalama Kullanım Oranı (renk kodlu)
│
├── Kart Listesi (dikey scroll)
│   └── CreditCardCard × n
│       ├── Banka logosu / renk
│       ├── Kart adı + son 4 hane
│       ├── Borç / Limit gösterimi
│       ├── Kullanım oranı progress bar (renk kodlu)
│       ├── Son ödeme tarihi (yakınsa kırmızı)
│       └── Asgari ödeme tutarı
│
├── Findeks Skoru Simülatörü Kartı (AI destekli)
│   ├── "Önerilen ödemeleri yaparsanız:"
│   ├── Tahmini skor değişimi (+X puan)
│   └── "Planı Gör →" butonu
│
└── FAB: + Yeni Kart Ekle
```

### 2. Akıllı Ödeme Planı Ekranı

```
Ödeme Planı
├── "Bu ay elinizde:" input alanı (net kullanılabilir para)
├── [Planı Hesapla] butonu
│
├── ─── HESAPLAMA SONUCU ───
│
├── Genel Durum Kartı
│   ├── Toplam önerilene ödeme
│   ├── Asgari toplamı
│   ├── Tahmini Findeks etkisi
│   └── Ödeme sonrası toplam kullanım oranı
│
├── Kart Bazlı Ödeme Listesi (öncelik sırasına göre)
│   └── PaymentPlanCard × n
│       ├── Kart adı + banka
│       ├── Önerilen ödeme tutarı (büyük, belirgin)
│       ├── Asgari ödeme (karşılaştırma)
│       ├── Ödeme sonrası kullanım oranı
│       ├── Skor etkisi rozeti (✅ Artıyor / ➡️ Korunuyor)
│       └── Gerekçe metni (kısa, AI üretiyor)
│
├── Bütçe Yetersiz Uyarısı (gerekiyorsa)
│   └── "Asgari ödemeler için ₺X eksik. Ne yapmalısınız?"
│
└── [Ödeme Takibine Geç] butonu
```

### 3. Kart Detay & Hesap Özeti Ekranı

```
Kart Detayı
├── Görsel Kart (3D kart tasarımı, banka renginde)
├── Limit / Borç / Kullanılabilir üçlü metrik
├── Kullanım oranı büyük gauge (yarım daire)
│
├── ─── HESAP ÖZETİ ───
├── Hesap kesim tarihi
├── Son ödeme tarihi (geri sayım)
├── Hesap özeti borcu
├── Asgari ödeme
│   ├── [Otomatik Hesapla] toggle
│   └── Manuel giriş alanı (toggle kapalıysa)
│
├── ─── GEÇMİŞ ───
├── Son 6 ay ödeme geçmişi (takvim görünümü)
│   ├── 🟢 Tam ödeme
│   ├── 🟡 Asgari ödeme
│   ├── 🔴 Gecikme
│   └── ⚪ Ödeme yok (borç yoktu)
│
└── ─── İŞLEMLER ───
    ├── Kart bilgilerini düzenle
    ├── Kartı sil
    └── Hatırlatıcı kur
```

### 4. Kart Ekleme Akışı

```
Kart Ekle (Bottom Sheet → Tam Ekran)
│
├── Adım 1: Banka Seçimi
│   └── Popüler Türk bankaları grid (logo + isim)
│       Garanti | Yapı Kredi | İş Bankası | Akbank
│       Ziraat | Halkbank | QNB | Denizbank | TEB | ING
│       └── [Diğer] seçeneği
│
├── Adım 2: Kart Bilgileri
│   ├── Kart adı (isteğe bağlı — "Bonus Card", "World" vb.)
│   ├── Son 4 hane (güvenlik — tam numara asla istenmez)
│   ├── Kredi limiti
│   └── Güncel borç bakiyesi
│
├── Adım 3: Hesap Özeti
│   ├── Hesap kesim günü (ayın kaçı)
│   ├── Son ödeme günü (ayın kaçı)
│   ├── Hesap özeti borcu
│   ├── Asgari ödeme
│   │   ├── [Sistem hesaplasın] butonu
│   │   └── [Manuel gir] alanı
│   └── Faiz oranı (isteğe bağlı)
│
├── Adım 4: Görsel Kişiselleştirme
│   ├── Kart rengi seçici
│   └── Kart ağı (Visa / Mastercard / Troy)
│
└── [Kaydet] → Konfeti animasyonu + "Kart eklendi!"
```

---

## 🔔 Bildirim Sistemi

```typescript
const NOTIFICATION_RULES = [
  {
    trigger: '7 gün önce',
    title: '💳 Ödeme Hatırlatıcısı',
    body: '{bankName} kartın için son ödeme tarihi 7 gün sonra. Önerilen ödeme: ₺{amount}',
  },
  {
    trigger: '3 gün önce',
    title: '⚠️ Yaklaşan Ödeme',
    body: '{bankName} son ödeme tarihi 3 gün sonra. Asgari ödeme: ₺{minimum}',
  },
  {
    trigger: '1 gün önce',
    title: '🚨 Yarın Son Gün!',
    body: '{bankName} kartı için yarın son ödeme günün. Gecikme Findeks skorunu etkiler.',
  },
  {
    trigger: 'Hesap kesim günü',
    title: '📋 Yeni Hesap Özeti',
    body: '{bankName} hesap özetin kesildi. Borç: ₺{debt}. Ödeme planını güncelle.',
  },
  {
    trigger: 'Kullanım %80 aştığında',
    title: '📊 Yüksek Kullanım Uyarısı',
    body: '{bankName} kullanım oranın %{rate} oldu. Findeks skorunu korumak için ödeme önerilir.',
  },
];
```

---

## 🤖 AI Entegrasyonu (Claude)

### Ödeme Gerekçesi Üretimi

```typescript
async function generatePaymentReasoning(
  card: CreditCard,
  plan: PaymentPlan,
  context: FinancialContext
): Promise<string> {

  const prompt = `
Kullanıcının ${card.bankName} kredi kartı için ödeme önerisi:
- Mevcut borç: ₺${card.currentDebt}
- Kredi limiti: ₺${card.creditLimit}
- Kullanım oranı: %${((card.currentDebt / card.creditLimit) * 100).toFixed(0)}
- Önerilen ödeme: ₺${plan.recommendedPayment}
- Ödeme sonrası kullanım oranı: %${plan.utilizationAfterPayment.toFixed(0)}
- Öncelik sırası: ${plan.priority}. kart

Bu ödeme önerisi için kullanıcıya yönelik 1-2 cümlelik, net ve motive edici bir gerekçe yaz.
Türkçe, "sen" diliyle, teknik jargon olmadan.
`;

  return claudeService.complete(prompt);
}
```

### Findeks Skoru Simülasyonu

```typescript
async function simulateFindeksImpact(
  cards: CreditCard[],
  plans: PaymentPlan[]
): Promise<FindeksSimulation> {

  const beforeUtilization = calculateTotalUtilization(cards);
  const afterUtilization  = calculateUtilizationAfterPayments(cards, plans);
  const allMinimumsPaid   = plans.every(p => p.recommendedPayment >= p.minimumPayment);

  // Kaba simülasyon (gerçek Findeks algoritması kapalıdır, bu yaklaşık)
  let estimatedScoreChange = 0;

  // Kullanım oranı düşürme etkisi
  const utilizationDrop = beforeUtilization - afterUtilization;
  if (utilizationDrop > 20) estimatedScoreChange += 15;
  else if (utilizationDrop > 10) estimatedScoreChange += 8;
  else if (utilizationDrop > 5)  estimatedScoreChange += 4;

  // Tüm asgariler ödendiyse
  if (allMinimumsPaid) estimatedScoreChange += 5;

  // Herhangi bir kart %80+ üzerindeyse
  const hasHighUtilization = plans.some(p => p.utilizationAfterPayment > 80);
  if (hasHighUtilization) estimatedScoreChange -= 10;

  return {
    currentUtilization:    beforeUtilization,
    projectedUtilization:  afterUtilization,
    estimatedScoreChange,
    confidence:            'approximate', // Kesin değil, tahmin
    disclaimer:            'Bu simülasyon tahminidir. Gerçek Findeks algoritması KKB tarafından belirlenir.',
  };
}
```

---

## 📊 Veri Modeli — WatermelonDB

```typescript
// Yeni tablolar schema.ts dosyasına eklenir

tableSchema({
  name: 'credit_cards',
  columns: [
    { name: 'bank_name',              type: 'string' },
    { name: 'card_name',              type: 'string', isOptional: true },
    { name: 'last_four_digits',       type: 'string', isOptional: true },
    { name: 'credit_limit',           type: 'number' },
    { name: 'current_debt',           type: 'number' },
    { name: 'statement_debt',         type: 'number' },
    { name: 'minimum_payment',        type: 'number' },
    { name: 'minimum_payment_mode',   type: 'string' },  // 'auto' | 'manual'
    { name: 'payment_due_day',        type: 'number' },  // Ayın kaçı (1-31)
    { name: 'statement_closing_day',  type: 'number' },  // Ayın kaçı (1-31)
    { name: 'interest_rate',          type: 'number', isOptional: true },
    { name: 'card_network',           type: 'string' },
    { name: 'color',                  type: 'string' },
    { name: 'is_active',              type: 'boolean' },
    { name: 'created_at',             type: 'number' },
    { name: 'updated_at',             type: 'number' },
  ],
}),

tableSchema({
  name: 'payment_history',
  columns: [
    { name: 'credit_card_id',   type: 'string', isIndexed: true },
    { name: 'payment_date',     type: 'number' },
    { name: 'amount_paid',      type: 'number' },
    { name: 'statement_debt',   type: 'number' },
    { name: 'minimum_payment',  type: 'number' },
    { name: 'payment_type',     type: 'string' }, // 'full' | 'minimum' | 'partial' | 'none'
    { name: 'was_on_time',      type: 'boolean' },
    { name: 'created_at',       type: 'number' },
  ],
}),

tableSchema({
  name: 'payment_plans',
  columns: [
    { name: 'plan_date',           type: 'number' },
    { name: 'available_budget',    type: 'number' },
    { name: 'total_recommended',   type: 'number' },
    { name: 'total_minimum',       type: 'number' },
    { name: 'plan_details',        type: 'string' }, // JSON array
    { name: 'findeks_simulation',  type: 'string' }, // JSON object
    { name: 'is_executed',         type: 'boolean' },
    { name: 'created_at',          type: 'number' },
  ],
}),
```

---

## ⚡ Zustand Store

```typescript
// stores/creditCardStore.ts

interface CreditCardState {
  cards: CreditCard[];
  paymentPlans: PaymentPlan[];
  currentPlan: PaymentPlan[] | null;
  availableBudget: number;

  // Actions
  addCard:           (card: Omit<CreditCard, 'id'>) => Promise<void>;
  updateCard:        (id: string, updates: Partial<CreditCard>) => Promise<void>;
  deleteCard:        (id: string) => Promise<void>;
  updateStatementDebt: (id: string, debt: number, minimum: number) => Promise<void>;

  // Ödeme planı
  setAvailableBudget:    (amount: number) => void;
  calculatePaymentPlan:  () => PaymentPlan[];
  markPaymentExecuted:   (cardId: string, amount: number) => Promise<void>;

  // Hesaplama getters
  getTotalDebt:          () => number;
  getTotalLimit:         () => number;
  getTotalUtilization:   () => number;
  getCardsNeedingAttention: () => CreditCard[];
}
```

---

## 🗺️ Geliştirme Öncelikleri

```
Faz 1 — Temel Kart Yönetimi
├── CreditCard veri modeli & WatermelonDB entegrasyonu
├── Kart ekleme akışı (4 adım)
├── Kart listesi ekranı
└── Kart detay ekranı

Faz 2 — Asgari Ödeme & Hesap Özeti
├── Otomatik asgari ödeme hesaplama
├── Manuel asgari ödeme girişi
├── Hesap kesim / son ödeme tarihi takibi
└── Bildirim sistemi

Faz 3 — Akıllı Ödeme Planı
├── Ödeme dağıtım algoritması
├── Ödeme planı ekranı
├── Findeks simülasyonu
└── AI gerekçe üretimi

Faz 4 — Geçmiş & Analitik
├── Ödeme geçmişi takvimi
├── Kart bazlı harcama analizi
└── Utilization trend grafiği
```

---

## ⚠️ Önemli Notlar & Yasal Uyarı

```
1. GÜVENLİK
   - Tam kart numarası ASLA saklanmaz, sadece son 4 hane
   - CVV / şifre gibi bilgiler hiçbir koşulda istenmez
   - Tüm veriler yerel cihazda saklanır, sunucuya gönderilmez

2. FİNDEKS UYARISI
   - Uygulama gerçek Findeks/KKB sistemine bağlı değildir
   - Skor simülasyonu tahmindir, garanti verilmez
   - Kullanıcıya açık disclaimer gösterilir

3. FİNANSAL DANIŞMANLIK
   - Uygulama finansal danışmanlık hizmeti vermez
   - Öneriler algoritmiktir, kişisel finans uzmanı değildir
   - Kullanıcı kendi kararından sorumludur

4. BDDK UYUMU
   - Asgari ödeme hesaplaması BDDK'nın %20 zorunluluğunu baz alır
   - Bu oran değişirse manuel güncelleme gerekir
```
